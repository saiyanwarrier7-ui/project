import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory, ViewTab } from '../types';
import {
  Search,
  Filter,
  Eye,
  Heart,
  Github,
  Globe,
  SlidersHorizontal,
  Bookmark,
  Layers,
  ArrowUpDown,
  X,
  ChevronRight,
} from 'lucide-react';

interface ExplorePageProps {
  projects: Project[];
  categories: ProjectCategory[];
  onSelectProject: (projectId: string) => void;
  onOpenLivePreview: (url: string, title: string) => void;
  onToggleLike: (projectId: string) => void;
  isLiked: (projectId: string) => boolean;
  onToggleBookmark: (projectId: string) => void;
  isBookmarked: (projectId: string) => boolean;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  projects,
  categories,
  onSelectProject,
  onOpenLivePreview,
  onToggleLike,
  isLiked,
  onToggleBookmark,
  isBookmarked,
  initialQuery = '',
  onClearInitialQuery,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'likes' | 'title'>('newest');
  const [visibleCount, setVisibleCount] = useState(6);

  // Extract all distinct technologies across approved projects
  const allTechnologies = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => p.technologies.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Must be approved for public gallery
      if (p.status !== 'approved') return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Tech filter
      if (selectedTech !== 'all' && !p.technologies.some(t => t.toLowerCase() === selectedTech.toLowerCase())) {
        return false;
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        const matchesAbstract = p.abstract.toLowerCase().includes(q);
        const matchesAuthor = p.authorName.toLowerCase().includes(q);
        const matchesTech = p.technologies.some(t => t.toLowerCase().includes(q));
        const matchesCat = p.category.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesAbstract || matchesAuthor || matchesTech || matchesCat;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
      }
      if (sortBy === 'popular') {
        return b.viewsCount - a.viewsCount;
      }
      if (sortBy === 'likes') {
        return b.likesCount - a.likesCount;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [projects, selectedCategory, selectedTech, searchQuery, sortBy]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            Academic Project Repository
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-slate-950 dark:text-white">
            Explore Student Projects
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
            Discover peer-reviewed engineering projects, capstone prototypes, and research archives built by students across disciplines.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-8 shadow-xs space-y-4">
          
          {/* Row 1: Search + Sorter */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project name, keywords, author, or tech stack..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    if (onClearInitialQuery) onClearInitialQuery();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorter & Tech selector */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-200"
              >
                <option value="newest">Newest Submissions</option>
                <option value="popular">Most Viewed</option>
                <option value="likes">Most Liked</option>
                <option value="title">Title (A-Z)</option>
              </select>

              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="text-xs font-medium px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-200"
              >
                <option value="all">All Technologies</option>
                {allTechnologies.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Category Segmented Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* Results Metadata Bar (Zero-Pill discipline) */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6 px-1">
          <div className="flex items-center gap-2">
            <span>Showing {displayedProjects.length} of {filteredProjects.length} academic projects</span>
            {(selectedCategory !== 'all' || selectedTech !== 'all' || searchQuery) && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedTech('all');
                    setSearchQuery('');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {displayedProjects.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
            <Layers className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching projects found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria, category filters, or technology tags.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTech('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => {
              const liked = isLiked(project.id);
              const bookmarked = isBookmarked(project.id);

              return (
                <div
                  key={project.id}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />

                    {/* Bookmark Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(project.id);
                      }}
                      className={`absolute top-3 left-3 p-1.5 rounded-md backdrop-blur-xs transition-colors shadow-xs ${
                        bookmarked
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-900/60 text-white hover:bg-slate-900/80'
                      }`}
                      title={bookmarked ? 'Remove Bookmark' : 'Bookmark Project'}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? 'currentColor' : 'none'} />
                    </button>

                    {/* Live Website Badge */}
                    {project.liveDemoUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLivePreview(project.liveDemoUrl, project.title);
                        }}
                        className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600/90 hover:bg-blue-600 backdrop-blur-xs rounded-md shadow-xs transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Live Demo</span>
                      </button>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Zero-Pill Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {project.category}
                        </span>
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

                    {/* Author & Metrics */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={project.authorAvatar}
                          alt={project.authorName}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                            {project.authorName}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {project.department}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="tabular-nums">{project.viewsCount}</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(project.id);
                          }}
                          className={`flex items-center gap-1 transition-colors ${
                            liked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'
                          }`}
                          title="Like Project"
                        >
                          <Heart className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} />
                          <span className="tabular-nums">{project.likesCount}</span>
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
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
                          Live Demo
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
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {displayedProjects.length < filteredProjects.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              Load More Projects ({filteredProjects.length - displayedProjects.length} remaining)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
