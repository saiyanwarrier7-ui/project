/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewTab, User, Project, ProjectCategory, ProjectReport } from './types';
import { storageService } from './services/storageService';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LivePreviewModal } from './components/LivePreviewModal';
import { ReportModal } from './components/ReportModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { UploadProjectPage } from './pages/UploadProjectPage';
import { MyProjectsPage } from './pages/MyProjectsPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPages } from './pages/AuthPages';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editProjectId, setEditProjectId] = useState<string | undefined>(undefined);
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');

  // Domain State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [reports, setReports] = useState<ProjectReport[]>([]);

  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('sph_theme') === 'dark' ||
      (!localStorage.getItem('sph_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Modals State
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const [reportModal, setReportModal] = useState<{ isOpen: boolean; projectId: string; title: string }>({
    isOpen: false,
    projectId: '',
    title: '',
  });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; projectId: string; title: string }>({
    isOpen: false,
    projectId: '',
    title: '',
  });

  // Sync theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sph_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sph_theme', 'light');
    }
  }, [isDark]);

  // Load data from storageService
  const refreshAllData = () => {
    setCurrentUser(storageService.getCurrentUser());
    setUsers(storageService.getUsers());
    setProjects(storageService.getProjects({ status: 'all' }));
    setCategories(storageService.getCategories());
    setReports(storageService.getReports());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleNavigate = (tab: ViewTab, projectId?: string) => {
    if (projectId) {
      setSelectedProjectId(projectId);
      if (tab === 'edit-project') {
        setEditProjectId(projectId);
      }
    } else if (tab !== 'project-details' && tab !== 'edit-project') {
      setEditProjectId(undefined);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentTab('project-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchUser = (userId: string) => {
    const updated = storageService.switchUser(userId);
    setCurrentUser(updated);
    refreshAllData();
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    const res = storageService.updateUserProfile(updated);
    if (res) {
      setCurrentUser(res);
      refreshAllData();
    }
  };

  const handleToggleLike = (projectId: string) => {
    storageService.toggleLike(projectId);
    refreshAllData();
  };

  const handleToggleBookmark = (projectId: string) => {
    storageService.toggleBookmark(projectId);
    refreshAllData();
  };

  const handleOpenLivePreview = (url: string, title: string) => {
    setPreviewModal({ isOpen: true, url, title });
  };

  const handleOpenReportModal = (projectId: string, title: string) => {
    setReportModal({ isOpen: true, projectId, title });
  };

  const handleRequestDelete = (projectId: string, title: string) => {
    setDeleteModal({ isOpen: true, projectId, title });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.projectId) {
      storageService.deleteProject(deleteModal.projectId, currentUser?.id);
      refreshAllData();
      if (currentTab === 'project-details') {
        setCurrentTab('explore');
      }
    }
  };

  const handleResetFactory = () => {
    if (confirm('Reset Student Project Hub to default sample repository data?')) {
      storageService.resetToFactory();
      refreshAllData();
      setCurrentTab('home');
    }
  };

  // Find active project for Details
  const activeProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId) || projects[0]
    : projects[0];

  const relatedProjects = activeProject
    ? projects.filter(
        p => p.id !== activeProject.id &&
        (p.category === activeProject.category || p.department === activeProject.department) &&
        p.status === 'approved'
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={users}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            onNavigate={handleNavigate}
            featuredProjects={projects.filter(p => p.status === 'approved')}
            categories={categories}
            totalProjects={projects.filter(p => p.status === 'approved').length}
            onOpenLivePreview={handleOpenLivePreview}
            onSelectProject={handleSelectProject}
            onSearchSubmit={(q) => {
              setInitialSearchQuery(q);
              setCurrentTab('explore');
            }}
          />
        )}

        {currentTab === 'explore' && (
          <ExplorePage
            projects={projects}
            categories={categories}
            onSelectProject={handleSelectProject}
            onOpenLivePreview={handleOpenLivePreview}
            onToggleLike={handleToggleLike}
            isLiked={(id) => storageService.isLiked(id)}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={(id) => storageService.isBookmarked(id)}
            initialQuery={initialSearchQuery}
            onClearInitialQuery={() => setInitialSearchQuery('')}
          />
        )}

        {currentTab === 'project-details' && activeProject && (
          <ProjectDetailsPage
            project={activeProject}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenLivePreview={handleOpenLivePreview}
            onOpenReportModal={handleOpenReportModal}
            onDeleteProject={(id) => handleRequestDelete(id, activeProject.title)}
            onToggleLike={handleToggleLike}
            isLiked={storageService.isLiked(activeProject.id)}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={storageService.isBookmarked(activeProject.id)}
            relatedProjects={relatedProjects}
          />
        )}

        {currentTab === 'student-dashboard' && (
          currentUser ? (
            <StudentDashboard
              currentUser={currentUser}
              projects={projects}
              categories={categories}
              onNavigate={handleNavigate}
              onSelectProject={handleSelectProject}
              onOpenLivePreview={handleOpenLivePreview}
            />
          ) : (
            <AuthPages
              mode="login"
              onNavigate={handleNavigate}
              onAuthSuccess={(user) => {
                setCurrentUser(user);
                refreshAllData();
              }}
              demoUsers={users}
            />
          )
        )}

        {currentTab === 'upload-project' && (
          currentUser ? (
            <UploadProjectPage
              currentUser={currentUser}
              categories={categories}
              onNavigate={handleNavigate}
              onProjectSaved={(projectId) => {
                refreshAllData();
                handleSelectProject(projectId);
              }}
              projects={projects}
            />
          ) : (
            <AuthPages
              mode="login"
              onNavigate={handleNavigate}
              onAuthSuccess={(user) => {
                setCurrentUser(user);
                refreshAllData();
              }}
              demoUsers={users}
            />
          )
        )}

        {currentTab === 'edit-project' && (
          currentUser ? (
            <UploadProjectPage
              currentUser={currentUser}
              categories={categories}
              onNavigate={handleNavigate}
              onProjectSaved={(projectId) => {
                refreshAllData();
                handleSelectProject(projectId);
              }}
              editProjectId={editProjectId}
              projects={projects}
            />
          ) : (
            <AuthPages
              mode="login"
              onNavigate={handleNavigate}
              onAuthSuccess={(user) => {
                setCurrentUser(user);
                refreshAllData();
              }}
              demoUsers={users}
            />
          )
        )}

        {currentTab === 'my-projects' && (
          currentUser ? (
            <MyProjectsPage
              currentUser={currentUser}
              projects={projects}
              onNavigate={handleNavigate}
              onSelectProject={handleSelectProject}
              onOpenLivePreview={handleOpenLivePreview}
              onRequestDelete={handleRequestDelete}
            />
          ) : (
            <AuthPages
              mode="login"
              onNavigate={handleNavigate}
              onAuthSuccess={(user) => {
                setCurrentUser(user);
                refreshAllData();
              }}
              demoUsers={users}
            />
          )
        )}

        {currentTab === 'student-profile' && (
          currentUser ? (
            <StudentProfilePage
              currentUser={currentUser}
              onUpdateUser={handleUpdateProfile}
              projects={projects}
              onSelectProject={handleSelectProject}
              onNavigate={handleNavigate}
            />
          ) : (
            <AuthPages
              mode="login"
              onNavigate={handleNavigate}
              onAuthSuccess={(user) => {
                setCurrentUser(user);
                refreshAllData();
              }}
              demoUsers={users}
            />
          )
        )}

        {currentTab === 'admin-dashboard' && (
          currentUser?.role === 'admin' ? (
            <AdminDashboard
              currentUser={currentUser}
              projects={projects}
              users={users}
              categories={categories}
              reports={reports}
              onNavigate={handleNavigate}
              onSelectProject={handleSelectProject}
              onRefreshData={refreshAllData}
            />
          ) : (
            <div className="py-20 text-center max-w-md mx-auto px-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Faculty Admin Access Required
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                You are currently signed in as a Student. Switch to Professor Robert Vance to access evaluation and moderation tools.
              </p>
              <button
                onClick={() => {
                  const adminUser = users.find(u => u.role === 'admin');
                  if (adminUser) handleSwitchUser(adminUser.id);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
              >
                Switch to Admin Account
              </button>
            </div>
          )
        )}

        {(currentTab === 'login' || currentTab === 'register') && (
          <AuthPages
            mode={currentTab}
            onNavigate={handleNavigate}
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              refreshAllData();
            }}
            demoUsers={users}
          />
        )}
      </main>

      {/* Modals */}
      <LivePreviewModal
        isOpen={previewModal.isOpen}
        url={previewModal.url}
        projectTitle={previewModal.title}
        onClose={() => setPreviewModal({ isOpen: false, url: '', title: '' })}
      />

      <ReportModal
        isOpen={reportModal.isOpen}
        projectId={reportModal.projectId}
        projectTitle={reportModal.title}
        onClose={() => setReportModal({ isOpen: false, projectId: '', title: '' })}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        projectTitle={deleteModal.title}
        onClose={() => setDeleteModal({ isOpen: false, projectId: '', title: '' })}
        onConfirm={handleConfirmDelete}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onResetFactory={handleResetFactory}
      />

    </div>
  );
}
