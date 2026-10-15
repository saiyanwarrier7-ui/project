import React, { useState } from 'react';
import { Project, ProjectCategory, ViewTab } from '../types';
import {
  ArrowRight,
  Search,
  ExternalLink,
  Github,
  Eye,
  Heart,
  FileText,
  Sparkles,
  Layers,
  CheckCircle,
  GraduationCap,
  Globe,
  Code2,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: ViewTab, projectId?: string) => void;
  featuredProjects: Project[];
  categories: ProjectCategory[];
  totalProjects: number;
  onOpenLivePreview: (url: string, title: string) => void;
  onSelectProject: (projectId: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  featuredProjects,
  categories,
  totalProjects,
  onOpenLivePreview,
  onSelectProject,
  onSearchSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      onNavigate('explore');
    } else {
      onNavigate('explore');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      
      {/* Hero Section: Split Screen 1440px layout */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Typographic Hierarchy */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Clean Kicker (Zero-Pill discipline) */}
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Academic Project Repository & Showcase
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-slate-950 dark:text-white leading-[1.1] text-balance">
                Where Student Engineering Meets Real-World Impact
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                A centralized university repository for students to archive capstone research, share technical documentation, discover peer innovations, and interact with live deployed applications.
              </p>

              {/* Integrated Search Bar */}
              <form onSubmit={handleSearch} className="max-w-xl">
                <div className="relative flex items-center shadow-xs">
                  <Search className="w-5 h-5 absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by topic (e.g. AI Attendance, IoT, Next.js, Computer Vision)..."
                    className="w-full pl-11 pr-28 py-3.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('explore')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                >
                  <span>Explore Repository</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('upload-project')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                >
                  <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Submit Academic Project</span>
                </button>
              </div>

              {/* Clean metadata notes */}
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>Verified student authors</span>
                <span aria-hidden="true">·</span>
                <span>Peer-reviewed capstones</span>
                <span aria-hidden="true">·</span>
                <span>Direct GitHub & Live Demos</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Container */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 group">
                <img
                  src="/src/assets/images/hero_student_hub_1792043367120.jpg"
                  alt="Students collaborating on engineering projects"
                  referrerPolicy="no-referrer"
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Featured Capstone</span>
                    <span className="text-slate-500">Academic Year 2025-2026</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    AI-based Attendance System with Facial Recognition
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    Computer Vision · ResNet-101 · Real-time RTSP
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Full-width Metric Strip below hero split */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
                {totalProjects}+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verified Student Projects
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
                18+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Academic Departments
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
                4,800+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Document Downloads
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
                100%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Open Student Work
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Projects Bento / Showcase Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              Curated Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              Featured Student Capstone Projects
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            <span>View all projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
            >
              {/* Thumbnail Container */}
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
                {project.liveDemoUrl && (
                  <button
                    onClick={() => onOpenLivePreview(project.liveDemoUrl, project.title)}
                    className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600/90 hover:bg-blue-600 backdrop-blur-xs rounded-md shadow-xs transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Live Website</span>
                  </button>
                )}
              </div>

              {/* Content Box */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-medium text-blue-600 dark:text-blue-400">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.academicYear}</span>
                  </div>

                  <h3
                    onClick={() => onSelectProject(project.id)}
                    className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors line-clamp-1"
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[11px] text-slate-400 px-1 py-0.5">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <img
                      src={project.authorAvatar}
                      alt={project.authorName}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
                      {project.authorName}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{project.viewsCount}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span className="tabular-nums">{project.likesCount}</span>
                    </span>
                  </div>
                </div>

                {/* Direct Action Row */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="w-full py-2 text-xs font-semibold text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    View Project
                  </button>
                  {project.liveDemoUrl ? (
                    <button
                      onClick={() => onOpenLivePreview(project.liveDemoUrl, project.title)}
                      className="w-full py-2 text-xs font-semibold text-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                    >
                      Visit Live Demo
                    </button>
                  ) : (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 text-xs font-semibold text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Categories Grid */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              Academic Disciplines
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              Explore Projects by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Browse cross-disciplinary undergraduate and graduate student innovations across major engineering domains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onSearchSubmit(category.name);
                  onNavigate('explore');
                }}
                className="flex items-start gap-4 p-5 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-950 transition-all duration-200 group shadow-xs"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white font-bold"
                  style={{ backgroundColor: category.color }}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features / Why Student Project Hub */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Interactive Live Deployments
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Don't just read about student projects—experience them. Visit live hosted web applications with direct one-click interactive previews.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Verifiable Documentation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Download complete capstone reports, conference drafts, circuit schematics, and presentation slide decks submitted by students.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Academic Peer Review
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Submissions undergo evaluation by faculty chairs and project coordinators ensuring genuine intellectual integrity.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
