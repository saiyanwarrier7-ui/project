import React, { useState, useEffect } from 'react';
import { Project, User, ViewTab, ProjectFile } from '../types';
import { storageService } from '../services/storageService';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  Heart,
  Bookmark,
  Download,
  FileText,
  FileArchive,
  Presentation,
  FileCode,
  Users,
  Calendar,
  Building2,
  AlertTriangle,
  Eye,
  Check,
  Edit,
  Trash2,
  Share2,
} from 'lucide-react';

interface ProjectDetailsPageProps {
  project: Project;
  currentUser: User | null;
  onNavigate: (tab: ViewTab, projectId?: string) => void;
  onOpenLivePreview: (url: string, title: string) => void;
  onOpenReportModal: (projectId: string, title: string) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleLike: (projectId: string) => void;
  isLiked: boolean;
  onToggleBookmark: (projectId: string) => void;
  isBookmarked: boolean;
  relatedProjects: Project[];
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({
  project,
  currentUser,
  onNavigate,
  onOpenLivePreview,
  onOpenReportModal,
  onDeleteProject,
  onToggleLike,
  isLiked,
  onToggleBookmark,
  isBookmarked,
  relatedProjects,
}) => {
  const [copied, setCopied] = useState(false);

  // Increment views on load
  useEffect(() => {
    storageService.incrementViews(project.id);
  }, [project.id]);

  const isOwner = currentUser?.id === project.authorId;
  const isAdmin = currentUser?.role === 'admin';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFileIcon = (type: ProjectFile['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'zip':
        return <FileArchive className="w-5 h-5 text-amber-500" />;
      case 'ppt':
        return <Presentation className="w-5 h-5 text-orange-500" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Repository</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(project.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors shadow-xs ${
                isBookmarked
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {/* Like */}
            <button
              onClick={() => onToggleLike(project.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors shadow-xs ${
                isLiked
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5" fill={isLiked ? 'currentColor' : 'none'} />
              <span className="tabular-nums">{project.likesCount}</span>
            </button>

            {/* Edit / Delete if author or admin */}
            {(isOwner || isAdmin) && (
              <>
                <button
                  onClick={() => onNavigate('edit-project', project.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </>
            )}

            {/* Report */}
            <button
              onClick={() => onOpenReportModal(project.id, project.title)}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Report Academic Integrity Issue"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Header Box */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          
          {/* Metadata Row (Zero-Pill discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>Academic Year {project.academicYear}</span>
            <span aria-hidden="true">·</span>
            <span>Submitted {project.submissionDate}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{project.status} status</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-slate-950 dark:text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-4 leading-relaxed max-w-4xl">
            {project.shortDescription}
          </p>

          {/* Primary Action Links & Live Website Button */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            
            {/* Live Website Primary Button */}
            {project.liveDemoUrl && (
              <>
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Live Deployed Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onOpenLivePreview(project.liveDemoUrl, project.title)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-900/50 rounded-lg transition-colors"
                >
                  <span>Interactive In-App Preview</span>
                </button>
              </>
            )}

            {/* GitHub Repo */}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            {/* Views counter */}
            <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
              <Eye className="w-4 h-4" />
              <span className="tabular-nums">{project.viewsCount} total views</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Abstract, Architecture & Media */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Project Image Frame */}
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs bg-slate-900">
              <img
                src={project.thumbnail}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[460px] object-cover"
              />
            </div>

            {/* Detailed Abstract & Project Methodology */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4">
                Abstract & Methodology
              </h2>
              
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed whitespace-pre-line">
                {project.abstract}
              </div>
            </div>

            {/* Downloadable Project Files & Documentation */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Project Documentation & Downloads
                </h2>
                <span className="text-xs text-slate-500">
                  {project.files?.length || 0} files attached
                </span>
              </div>

              {project.files && project.files.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {project.files.map((file) => (
                    <div
                      key={file.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="uppercase font-mono">{file.type}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{file.sizeFormatted}</span>
                            {file.description && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="truncate max-w-xs">{file.description}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => storageService.downloadProjectFile(file, project.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors shrink-0 self-start sm:self-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4">No downloadable documents attached yet.</p>
              )}
            </div>

          </div>

          {/* Right Column (4 cols): Metadata, Author, Team & Tech Stack */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Primary Author Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Primary Student Author
              </h3>

              <div className="flex items-center gap-3">
                <img
                  src={project.authorAvatar}
                  alt={project.authorName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {project.authorName}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{project.authorDepartment}</p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                    {project.authorEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members Roster */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Project Team Members
                </h3>
              </div>

              {project.teamMembers && project.teamMembers.length > 0 ? (
                <div className="space-y-3">
                  {project.teamMembers.map((member, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800 last:border-none">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{member.name}</span>
                      <span className="text-slate-500 text-right">{member.role}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Individual student submission.</p>
              )}
            </div>

            {/* Technologies Used */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Technologies & Tools
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Academic Department & Year */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Department</span>
                </span>
                <span className="font-medium text-slate-900 dark:text-white text-right max-w-[180px] truncate">
                  {project.department}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Academic Term</span>
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {project.academicYear}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Related Academic Projects
                </h3>
                <p className="text-xs text-slate-500">
                  More work in {project.category} or related engineering disciplines
                </p>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Browse all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate('project-details', rel.id)}
                  className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all shadow-xs"
                >
                  <img
                    src={rel.thumbnail}
                    alt={rel.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-36 object-cover rounded-lg mb-3"
                  />
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mb-1">
                    {rel.category}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
