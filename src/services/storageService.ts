import { Project, User, ProjectCategory, ProjectReport, ProjectFile } from '../types';
import { SEED_USERS, SEED_CATEGORIES, SEED_PROJECTS } from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'sph_users_v1',
  CURRENT_USER: 'sph_current_user_v1',
  PROJECTS: 'sph_projects_v1',
  CATEGORIES: 'sph_categories_v1',
  REPORTS: 'sph_reports_v1',
  LIKED_PROJECTS: 'sph_liked_projects_v1',
  BOOKMARKED_PROJECTS: 'sph_bookmarked_projects_v1',
  VIEWED_PROJECTS: 'sph_viewed_projects_v1',
  THEME: 'sph_theme_v1',
};

// Safe storage wrapper
class StorageService {
  private users: User[] = [];
  private projects: Project[] = [];
  private categories: ProjectCategory[] = [];
  private reports: ProjectReport[] = [];
  private currentUser: User | null = null;
  private likedProjectIds: Set<string> = new Set();
  private bookmarkedProjectIds: Set<string> = new Set();
  private viewedProjectIds: Set<string> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      // 1. Users
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = [...SEED_USERS];
        this.saveUsers();
      }

      // Current user
      const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedCurrentUser) {
        this.currentUser = JSON.parse(storedCurrentUser);
      } else {
        // Default to student Alex Rivera
        this.currentUser = this.users[0] || SEED_USERS[0];
        this.saveCurrentUser();
      }

      // 2. Categories
      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (storedCategories) {
        this.categories = JSON.parse(storedCategories);
      } else {
        this.categories = [...SEED_CATEGORIES];
        this.saveCategories();
      }

      // 3. Projects
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        this.projects = JSON.parse(storedProjects);
      } else {
        this.projects = [...SEED_PROJECTS];
        this.saveProjects();
      }

      // 4. Reports
      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (storedReports) {
        this.reports = JSON.parse(storedReports);
      } else {
        this.reports = [];
        this.saveReports();
      }

      // 5. Likes & Bookmarks
      const storedLikes = localStorage.getItem(STORAGE_KEYS.LIKED_PROJECTS);
      if (storedLikes) {
        this.likedProjectIds = new Set(JSON.parse(storedLikes));
      }

      const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_PROJECTS);
      if (storedBookmarks) {
        this.bookmarkedProjectIds = new Set(JSON.parse(storedBookmarks));
      }

      const storedViews = localStorage.getItem(STORAGE_KEYS.VIEWED_PROJECTS);
      if (storedViews) {
        this.viewedProjectIds = new Set(JSON.parse(storedViews));
      }
    } catch (err) {
      console.warn('LocalStorage error, falling back to in-memory state', err);
      this.users = [...SEED_USERS];
      this.currentUser = SEED_USERS[0];
      this.categories = [...SEED_CATEGORIES];
      this.projects = [...SEED_PROJECTS];
    }
  }

  // --- Users & Auth ---
  public getUsers(): User[] {
    return [...this.users];
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public switchUser(userId: string): User | null {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      this.saveCurrentUser();
    }
    return this.currentUser;
  }

  public login(email: string): { success: boolean; user?: User; error?: string } {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }
    this.currentUser = user;
    this.saveCurrentUser();
    return { success: true, user };
  }

  public register(userData: Omit<User, 'id' | 'joinedDate'>): { success: boolean; user?: User; error?: string } {
    const exists = this.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    this.users.push(newUser);
    this.saveUsers();
    this.currentUser = newUser;
    this.saveCurrentUser();
    return { success: true, user: newUser };
  }

  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  public updateUserProfile(updated: Partial<User>): User | null {
    if (!this.currentUser) return null;
    const index = this.users.findIndex(u => u.id === this.currentUser?.id);
    if (index === -1) return null;

    const merged = { ...this.users[index], ...updated };
    this.users[index] = merged;
    this.currentUser = merged;
    this.saveUsers();
    this.saveCurrentUser();

    // Also update authorName/authorAvatar in user's projects
    let changedProjects = false;
    this.projects = this.projects.map(p => {
      if (p.authorId === merged.id) {
        changedProjects = true;
        return {
          ...p,
          authorName: merged.name,
          authorAvatar: merged.avatar,
          authorDepartment: merged.department,
          authorEmail: merged.email,
        };
      }
      return p;
    });
    if (changedProjects) {
      this.saveProjects();
    }

    return merged;
  }

  public deleteUserAccount(userId: string): boolean {
    this.users = this.users.filter(u => u.id !== userId);
    this.saveUsers();
    if (this.currentUser?.id === userId) {
      this.logout();
    }
    return true;
  }

  // --- Projects ---
  public getProjects(filter?: {
    category?: string;
    search?: string;
    authorId?: string;
    status?: 'all' | 'approved' | 'pending' | 'rejected';
    department?: string;
    sortBy?: 'newest' | 'popular' | 'likes' | 'title';
  }): Project[] {
    let list = [...this.projects];

    // Status filter: By default public views see 'approved' unless specified
    if (filter?.status && filter.status !== 'all') {
      list = list.filter(p => p.status === filter.status);
    }

    if (filter?.authorId) {
      list = list.filter(p => p.authorId === filter.authorId);
    }

    if (filter?.category && filter.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === filter.category?.toLowerCase());
    }

    if (filter?.department && filter.department !== 'all') {
      list = list.filter(p => p.department.toLowerCase() === filter.department?.toLowerCase());
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.abstract.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.technologies.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    const sortBy = filter?.sortBy || 'newest';
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    } else if (sortBy === 'popular') {
      list.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (sortBy === 'likes') {
      list.sort((a, b) => b.likesCount - a.likesCount);
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }

  public getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  public createProject(projectData: Omit<Project, 'id' | 'viewsCount' | 'likesCount' | 'bookmarksCount' | 'submissionDate'>): Project {
    const newProject: Project = {
      ...projectData,
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      viewsCount: 1,
      likesCount: 0,
      bookmarksCount: 0,
      submissionDate: new Date().toISOString().split('T')[0],
      status: this.currentUser?.role === 'admin' ? 'approved' : 'approved', // instantly approved or pending
    };

    this.projects.unshift(newProject);
    this.saveProjects();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>, requestingUserId?: string): { success: boolean; project?: Project; error?: string } {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Project not found.' };
    }

    const project = this.projects[index];
    const isOwner = requestingUserId && project.authorId === requestingUserId;
    const isAdmin = this.currentUser?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return { success: false, error: 'Unauthorized: You can only edit your own academic projects.' };
    }

    const updatedProject: Project = {
      ...project,
      ...updates,
    };

    this.projects[index] = updatedProject;
    this.saveProjects();
    return { success: true, project: updatedProject };
  }

  public deleteProject(id: string, requestingUserId?: string): { success: boolean; error?: string } {
    const project = this.projects.find(p => p.id === id);
    if (!project) return { success: false, error: 'Project not found.' };

    const isOwner = requestingUserId && project.authorId === requestingUserId;
    const isAdmin = this.currentUser?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return { success: false, error: 'Unauthorized: You can only delete your own projects.' };
    }

    this.projects = this.projects.filter(p => p.id !== id);
    this.saveProjects();
    return { success: true };
  }

  public updateProjectStatus(id: string, status: 'approved' | 'pending' | 'rejected', rejectionReason?: string): boolean {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.projects[index].status = status;
    if (rejectionReason) {
      this.projects[index].rejectionReason = rejectionReason;
    } else if (status === 'approved') {
      delete this.projects[index].rejectionReason;
    }
    this.saveProjects();
    return true;
  }

  // --- Likes, Bookmarks, Views ---
  public toggleLike(projectId: string): { liked: boolean; totalLikes: number } {
    const isLiked = this.likedProjectIds.has(projectId);
    const project = this.projects.find(p => p.id === projectId);

    if (isLiked) {
      this.likedProjectIds.delete(projectId);
      if (project) project.likesCount = Math.max(0, project.likesCount - 1);
    } else {
      this.likedProjectIds.add(projectId);
      if (project) project.likesCount += 1;
    }

    this.saveLikes();
    this.saveProjects();

    return {
      liked: !isLiked,
      totalLikes: project ? project.likesCount : 0,
    };
  }

  public isLiked(projectId: string): boolean {
    return this.likedProjectIds.has(projectId);
  }

  public toggleBookmark(projectId: string): { bookmarked: boolean; totalBookmarks: number } {
    const isBookmarked = this.bookmarkedProjectIds.has(projectId);
    const project = this.projects.find(p => p.id === projectId);

    if (isBookmarked) {
      this.bookmarkedProjectIds.delete(projectId);
      if (project) project.bookmarksCount = Math.max(0, project.bookmarksCount - 1);
    } else {
      this.bookmarkedProjectIds.add(projectId);
      if (project) project.bookmarksCount += 1;
    }

    this.saveBookmarks();
    this.saveProjects();

    return {
      bookmarked: !isBookmarked,
      totalBookmarks: project ? project.bookmarksCount : 0,
    };
  }

  public isBookmarked(projectId: string): boolean {
    return this.bookmarkedProjectIds.has(projectId);
  }

  public incrementViews(projectId: string): void {
    if (!this.viewedProjectIds.has(projectId)) {
      this.viewedProjectIds.add(projectId);
      const project = this.projects.find(p => p.id === projectId);
      if (project) {
        project.viewsCount += 1;
        this.saveProjects();
      }
      this.saveViews();
    }
  }

  public getBookmarkedProjects(): Project[] {
    return this.projects.filter(p => this.bookmarkedProjectIds.has(p.id));
  }

  // --- Categories ---
  public getCategories(): ProjectCategory[] {
    return [...this.categories];
  }

  public addCategory(cat: Omit<ProjectCategory, 'id' | 'slug'>): ProjectCategory {
    const newCat: ProjectCategory = {
      ...cat,
      id: `cat_${Date.now()}`,
      slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
    this.categories.push(newCat);
    this.saveCategories();
    return newCat;
  }

  public deleteCategory(id: string): boolean {
    this.categories = this.categories.filter(c => c.id !== id);
    this.saveCategories();
    return true;
  }

  // --- Reports ---
  public getReports(): ProjectReport[] {
    return [...this.reports];
  }

  public submitReport(reportData: Omit<ProjectReport, 'id' | 'timestamp' | 'status'>): ProjectReport {
    const newReport: ProjectReport = {
      ...reportData,
      id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    this.reports.unshift(newReport);
    this.saveReports();
    return newReport;
  }

  public updateReportStatus(id: string, status: 'resolved' | 'dismissed'): boolean {
    const report = this.reports.find(r => r.id === id);
    if (!report) return false;
    report.status = status;
    this.saveReports();
    return true;
  }

  // --- File Download Utility ---
  public downloadProjectFile(file: ProjectFile, projectTitle: string): void {
    // Generate real downloadable content if it's a seed file or user uploaded
    let blob: Blob;
    if (file.url && file.url.startsWith('data:')) {
      // Decode data URL
      try {
        const parts = file.url.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        blob = new Blob([uInt8Array], { type: contentType });
      } catch {
        blob = new Blob([`Simulated documentation file: ${file.name}\nProject: ${projectTitle}`], { type: 'text/plain' });
      }
    } else {
      // Create authentic simulated academic document package
      const content = `========================================================================
ACADEMIC PROJECT REPOSITORY — OFFICIAL DOCUMENT ARCHIVE
STUDENT PROJECT HUB
========================================================================
Project Title: ${projectTitle}
File Name:     ${file.name}
File Type:     ${file.type.toUpperCase()}
Report Size:   ${file.sizeFormatted}
Archive Hash:  ${Math.random().toString(36).substring(2, 12).toUpperCase()}
Verified:      Academic Evaluation Board
Date:          ${file.uploadedAt || new Date().toISOString().split('T')[0]}

DOCUMENT OVERVIEW:
${file.description || 'Capstone project research documentation, architectural diagrams, and experimental validation benchmarks.'}

TABLE OF CONTENTS:
1. Executive Summary & Abstract
2. System Architecture & Component Specifications
3. Implementation Details & Algorithmic Benchmarks
4. Security Analysis & Threat Vector Audit
5. Deployment Guide & Environment Dependencies
6. Conclusion & Future Research Directions

For live code and latest releases, visit the repository GitHub link.
========================================================================`;
      blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    }

    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
  }

  // --- Reset to Factory Seed ---
  public resetToFactory(): void {
    localStorage.clear();
    this.users = [...SEED_USERS];
    this.currentUser = SEED_USERS[0];
    this.categories = [...SEED_CATEGORIES];
    this.projects = [...SEED_PROJECTS];
    this.reports = [];
    this.likedProjectIds.clear();
    this.bookmarkedProjectIds.clear();
    this.viewedProjectIds.clear();
    this.saveUsers();
    this.saveCurrentUser();
    this.saveCategories();
    this.saveProjects();
  }

  // --- Persistence Helpers ---
  private saveUsers() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
  }
  private saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    }
  }
  private saveCategories() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
  }
  private saveProjects() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
  }
  private saveReports() {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
  }
  private saveLikes() {
    localStorage.setItem(STORAGE_KEYS.LIKED_PROJECTS, JSON.stringify(Array.from(this.likedProjectIds)));
  }
  private saveBookmarks() {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKED_PROJECTS, JSON.stringify(Array.from(this.bookmarkedProjectIds)));
  }
  private saveViews() {
    localStorage.setItem(STORAGE_KEYS.VIEWED_PROJECTS, JSON.stringify(Array.from(this.viewedProjectIds)));
  }
}

export const storageService = new StorageService();
