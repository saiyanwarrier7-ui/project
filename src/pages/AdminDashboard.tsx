import React, { useState } from 'react';
import { Project, User, ProjectCategory, ProjectReport, ViewTab } from '../types';
import { storageService } from '../services/storageService';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  FolderGit2,
  Layers,
  Trash2,
  Eye,
  Plus,
  Search,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  projects: Project[];
  users: User[];
  categories: ProjectCategory[];
  reports: ProjectReport[];
  onNavigate: (tab: ViewTab, projectId?: string) => void;
  onSelectProject: (projectId: string) => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  projects,
  users,
  categories,
  reports,
  onNavigate,
  onSelectProject,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'students' | 'categories' | 'reports'>('submissions');
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Rejection modal state
  const [rejectingProjectId, setRejectingProjectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Category creation
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3B82F6');
  const [showAddCat, setShowAddCat] = useState(false);

  // Search in tabs
  const [searchQuery, setSearchQuery] = useState('');

  // Moderation handlers
  const handleApprove = (id: string) => {
    storageService.updateProjectStatus(id, 'approved');
    onRefreshData();
  };

  const handleOpenReject = (id: string) => {
    setRejectingProjectId(id);
    setRejectionReason('');
  };

  const handleConfirmReject = () => {
    if (rejectingProjectId) {
      storageService.updateProjectStatus(
        rejectingProjectId,
        'rejected',
        rejectionReason.trim() || 'Project does not meet repository capstone documentation guidelines.'
      );
      setRejectingProjectId(null);
      onRefreshData();
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Permanently remove this project from the university repository?')) {
      storageService.deleteProject(id);
      onRefreshData();
    }
  };

  const handleDismissReport = (id: string) => {
    storageService.updateReportStatus(id, 'dismissed');
    onRefreshData();
  };

  const handleResolveReport = (id: string) => {
    storageService.updateReportStatus(id, 'resolved');
    onRefreshData();
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      storageService.addCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim() || 'Academic discipline category',
        color: newCatColor,
        iconName: 'Layers',
      });
      setNewCatName('');
      setNewCatDesc('');
      setShowAddCat(false);
      onRefreshData();
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this category?')) {
      storageService.deleteCategory(id);
      onRefreshData();
    }
  };

  const pendingCount = projects.filter(p => p.status === 'pending').length;
  const activeReportsCount = reports.filter(r => r.status === 'pending').length;

  const filteredProjects = projects.filter(p => {
    if (submissionFilter !== 'all' && p.status !== submissionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return p.title.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Academic Evaluation Board</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-950 dark:text-white">
              Admin & Moderation Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Review student capstone submissions, enforce integrity standards, and manage institutional records.
            </p>
          </div>
        </div>

        {/* 4-KPI Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Pending Approvals</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {pendingCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Awaiting faculty evaluation</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Total Student Submissions</span>
              <FolderGit2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {projects.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Across 18 departments</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Registered Students</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {users.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Active student accounts</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Policy Reports</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {activeReportsCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Pending review cases</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'submissions'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Project Submissions ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Disciplines & Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Integrity Reports ({reports.length})</span>
          </button>
        </div>

        {/* Tab 1: Project Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            
            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title, author, or category..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1 text-xs self-stretch sm:self-auto overflow-x-auto">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSubmissionFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
                      submissionFilter === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'All Submissions' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table / Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{p.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>Author: {p.authorName}</span>
                          <span aria-hidden="true">·</span>
                          <span>{p.submissionDate}</span>
                        </div>

                        <h3
                          onClick={() => onSelectProject(p.id)}
                          className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer truncate"
                        >
                          {p.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xl">
                          {p.shortDescription}
                        </p>

                        {p.rejectionReason && (
                          <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded">
                            Revision note: {p.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {p.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(p.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleOpenReject(p.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Request Revision</span>
                          </button>
                        </>
                      )}

                      {p.status === 'approved' && (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40">
                          Approved
                        </span>
                      )}

                      {p.status === 'rejected' && (
                        <button
                          onClick={() => handleApprove(p.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 rounded-lg"
                        >
                          Re-approve
                        </button>
                      )}

                      <button
                        onClick={() => onSelectProject(p.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Inspect
                      </button>

                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Student Accounts */}
        {activeTab === 'students' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                University Student & Faculty Roster
              </h3>
              <span className="text-xs text-slate-500">{users.length} enrolled users</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => {
                const userProjectCount = projects.filter(p => p.authorId === u.id).length;
                return (
                  <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {u.name}
                          </p>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{u.department}</span>
                          <span aria-hidden="true">·</span>
                          <span>Roll: {u.rollNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs shrink-0">
                      <span className="text-slate-500 font-mono">
                        {userProjectCount} {userProjectCount === 1 ? 'project' : 'projects'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Category Management */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Academic Disciplines & Categories
                </h3>
                <p className="text-xs text-slate-500">Configure project taxonomy and research tags</p>
              </div>
              <button
                onClick={() => setShowAddCat(!showAddCat)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            {showAddCat && (
              <form onSubmit={handleCreateCategory} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 animate-fadeIn">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  New Category Definition
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Category Name"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white sm:col-span-2"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddCat(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const count = projects.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {cat.name}
                        </span>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{count} projects linked</span>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Integrity Reports */}
        {activeTab === 'reports' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Academic Policy & Plagiarism Incident Reports
                </h3>
                <p className="text-xs text-slate-500">Student and peer reports awaiting committee investigation</p>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  All clear! No pending policy reports.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Academic integrity monitoring is active.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((r) => (
                  <div key={r.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                          {r.reason}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">
                          {new Date(r.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className={`text-[11px] font-semibold uppercase ${
                          r.status === 'resolved' ? 'text-emerald-600' : r.status === 'dismissed' ? 'text-slate-400' : 'text-amber-600'
                        }`}>
                          {r.status}
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectProject(r.projectId)}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer"
                      >
                        {r.projectTitle}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg">
                        "{r.details}"
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Reported by: {r.reporterName} ({r.reporterEmail})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start">
                      {r.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResolveReport(r.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg"
                          >
                            Mark Resolved
                          </button>
                          <button
                            onClick={() => handleDismissReport(r.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onSelectProject(r.projectId)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 rounded-lg"
                      >
                        Inspect Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rejection Note Modal */}
        {rejectingProjectId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Request Revisions for Project
              </h3>
              <p className="text-xs text-slate-500">
                Provide constructive feedback so the student can update their documentation and resubmit.
              </p>

              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please attach complete benchmark charts and ensure GitHub repository is set to public visibility..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingProjectId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                >
                  Send Revision Request
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
