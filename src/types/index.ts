export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  course: string;
  year: string;
  rollNumber: string;
  avatar: string;
  bio: string;
  githubProfile?: string;
  linkedinProfile?: string;
  website?: string;
  joinedDate: string;
}

export type FileType = 'pdf' | 'zip' | 'ppt' | 'docx' | 'code' | 'doc';

export interface ProjectFile {
  id: string;
  name: string;
  type: FileType;
  sizeFormatted: string;
  sizeBytes: number;
  url: string; // Data URL or downloadable blob
  uploadedAt: string;
  description?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  email?: string;
  rollNumber?: string;
}

export type ProjectStatus = 'approved' | 'pending' | 'rejected';

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  abstract: string; // Rich detailed overview: background, methodology, architecture, results
  category: string;
  technologies: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorDepartment: string;
  authorEmail: string;
  teamMembers: TeamMember[];
  department: string;
  academicYear: string;
  thumbnail: string;
  galleryImages?: string[];
  files: ProjectFile[];
  githubUrl: string;
  liveDemoUrl: string;
  status: ProjectStatus;
  rejectionReason?: string;
  viewsCount: number;
  likesCount: number;
  bookmarksCount: number;
  submissionDate: string;
  featured?: boolean;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
}

export interface ProjectReport {
  id: string;
  projectId: string;
  projectTitle: string;
  reporterName: string;
  reporterEmail: string;
  reason: 'Plagiarism / IP Violation' | 'Inappropriate Content' | 'Broken or Misleading Links' | 'Incorrect Academic Metadata' | 'Other';
  details: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export type ViewTab =
  | 'home'
  | 'explore'
  | 'project-details'
  | 'student-dashboard'
  | 'upload-project'
  | 'edit-project'
  | 'my-projects'
  | 'student-profile'
  | 'admin-dashboard'
  | 'login'
  | 'register';
