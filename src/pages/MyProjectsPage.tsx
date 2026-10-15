import React, { useState } from 'react';
import { Project, User, ViewTab } from '../types';
import {
  FolderGit2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Heart,
  Globe,
  Github,
  CheckCircle2,
  Clock3,
  XCircle,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

interface MyProjectsPageProps {
  currentUser: User;
  projects: Project[];
  onNavigate: (tab: ViewTab, projectId?: string) => void;
  onSelectProject: (projectId: string) => void;
  onOpenLivePreview: (url: string, title: string) => void;
  onRequestDelete: (projectId: string, projectTitle: string) => void;
}

export const MyProjectsPage: React.FC<MyProjectsPageProps> = ({
  currentUser,
  projects,
  onNavigate,
  onSelectProject,
  onOpenLivePreview,
  onRequestDelete,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Enforce ownership: only show projects owned by current user
  const userProjects = projects.filter(p => p.authorId === currentUser.id);

  const filtered = userProjects.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved & Public</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock3 className="w-3.5 h-3.5" />
            <span>Under Review</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>Revisions Requested</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              Project Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-950 dark:text-white">
              My Uploaded Projects ({userProjects.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage your academic project repository entries, update source code links, and track peer engagement.
            </p>
          </div>

          <button
            onClick={() => onNavigate('upload-project')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Project</span>
          </button>
        </div>

        {/* Toolbar: Search & Status Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in my projects..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
            />
          </div>

          {/* Segmented status buttons */}
          <div className="flex items-center gap-1 text-xs self-stretch sm:self-auto overflow-x-auto">
            {(['all', 'approved', 'pending', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'all' ? 'All Projects' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
            <FolderGit2 className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery || filterStatus !== 'all'
                ? 'No projects matching your filter'
                : 'You have not uploaded any projects yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Share your research papers, capstone models, or software implementations with peer reviewers.
            </p>
            <button
              onClick={() => onNavigate('upload-project')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              Upload Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((proj) => (
              <div
                key={proj.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Left Information */}
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={proj.thumbnail}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{proj.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Academic Year {proj.academicYear}</span>
                      <span aria-hidden="true">·</span>
                      <span>Submitted {proj.submissionDate}</span>
                    </div>

                    <h3
                      onClick={() => onSelectProject(proj.id)}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer truncate"
                    >
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-2xl">
                      {proj.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs">
                      {getStatusBadge(proj.status)}
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="tabular-nums font-mono">{proj.viewsCount} views</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span className="tabular-nums font-mono">{proj.likesCount} likes</span>
                      </span>
                      <span className="text-slate-500">
                        {proj.files?.length || 0} attached files
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onNavigate('edit-project', proj.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onRequestDelete(proj.id, proj.title)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Direct live links */}
                  <div className="flex items-center gap-2 text-xs">
                    {proj.liveDemoUrl && (
                      <button
                        onClick={() => onOpenLivePreview(proj.liveDemoUrl, proj.title)}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Live Preview</span>
                      </button>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        <Github className="w-3 h-3" />
                        <span>Repo</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
