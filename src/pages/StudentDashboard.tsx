import React from 'react';
import { Project, User, ProjectCategory, ViewTab } from '../types';
import {
  Upload,
  FolderGit2,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock3,
  XCircle,
  FileText,
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User;
  projects: Project[];
  categories: ProjectCategory[];
  onNavigate: (tab: ViewTab, projectId?: string) => void;
  onSelectProject: (projectId: string) => void;
  onOpenLivePreview: (url: string, title: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  projects,
  categories,
  onNavigate,
  onSelectProject,
  onOpenLivePreview,
}) => {
  // My projects
  const myProjects = projects.filter(p => p.authorId === currentUser.id);

  // Aggregated Stats
  const totalViewsOnMyProjects = myProjects.reduce((acc, p) => acc + p.viewsCount, 0);
  const totalLikesOnMyProjects = myProjects.reduce((acc, p) => acc + p.likesCount, 0);

  // Recently uploaded across the platform
  const recentProjects = [...projects]
    .filter(p => p.status === 'approved')
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .slice(0, 4);

  // Popular projects
  const popularProjects = [...projects]
    .filter(p => p.status === 'approved')
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, 3);

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Clock3 className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>Revision Required</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="text-xs uppercase font-semibold tracking-wider text-blue-300">
              Student Academic Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track your academic project performance, manage documentation archives, and see how other students are exploring your research.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('upload-project')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Submit New Academic Project</span>
              </button>
              <button
                onClick={() => onNavigate('my-projects')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs rounded-lg transition-colors border border-white/20"
              >
                <span>Manage My Projects ({myProjects.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4-KPI Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">My Projects Uploaded</span>
              <FolderGit2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {myProjects.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Active repository submissions
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Total Project Views</span>
              <Eye className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {totalViewsOnMyProjects.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Cumulative student impressions
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Total Likes Received</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {totalLikesOnMyProjects.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Peer endorsements
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Repository Projects</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {projects.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Across 18 university departments
            </div>
          </div>
        </div>

        {/* 2-Column Split: My Projects (left 7 cols) & Popular/Categories (right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: My Projects Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    My Academic Projects
                  </h2>
                  <p className="text-xs text-slate-500">Your recent submissions to the repository</p>
                </div>
                <button
                  onClick={() => onNavigate('my-projects')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {myProjects.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <FolderGit2 className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    No projects submitted yet
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload your capstone thesis, mini project, or research software to showcase here.
                  </p>
                  <button
                    onClick={() => onNavigate('upload-project')}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload First Project</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myProjects.slice(0, 3).map((proj) => (
                    <div key={proj.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex items-center gap-3">
                        <img
                          src={proj.thumbnail}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3
                            onClick={() => onSelectProject(proj.id)}
                            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer truncate"
                          >
                            {proj.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>{proj.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{getStatusBadge(proj.status)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="tabular-nums">{proj.viewsCount}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                            <span className="tabular-nums">{proj.likesCount}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => onSelectProject(proj.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recently Uploaded across Campus */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    Recently Uploaded to Repository
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Explore all
                </button>
              </div>

              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="text-blue-600 dark:text-blue-400">{p.authorName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p.submissionDate}</span>
                      </div>
                    </div>
                    {p.liveDemoUrl && (
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                        Live Demo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Popular Projects & Category Shortcuts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Popular Projects */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  Most Popular Projects
                </h2>
              </div>

              <div className="space-y-3">
                {popularProjects.map((p, index) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="w-6 text-center text-xs font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </div>
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-md object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3 h-3" />
                          <span className="tabular-nums">{p.viewsCount}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-rose-500">
                          <Heart className="w-3 h-3" fill="currentColor" />
                          <span className="tabular-nums">{p.likesCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Shortcuts */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  Categories
                </h2>
              </div>
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const count = projects.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onNavigate('explore')}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                      <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                        {count} projects
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
