import React, { useState } from 'react';
import { User, Project, ViewTab } from '../types';
import { storageService } from '../services/storageService';
import {
  User as UserIcon,
  Building2,
  GraduationCap,
  Calendar,
  Hash,
  Github,
  Linkedin,
  Globe,
  Edit,
  Check,
  Bookmark,
  FolderGit2,
  Eye,
  Heart,
  Save,
} from 'lucide-react';

interface StudentProfilePageProps {
  currentUser: User;
  onUpdateUser: (updated: Partial<User>) => void;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onNavigate: (tab: ViewTab) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({
  currentUser,
  onUpdateUser,
  projects,
  onSelectProject,
  onNavigate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [department, setDepartment] = useState(currentUser.department);
  const [course, setCourse] = useState(currentUser.course);
  const [year, setYear] = useState(currentUser.year);
  const [rollNumber, setRollNumber] = useState(currentUser.rollNumber);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [githubProfile, setGithubProfile] = useState(currentUser.githubProfile || '');
  const [linkedinProfile, setLinkedinProfile] = useState(currentUser.linkedinProfile || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  
  const [activeTab, setActiveTab] = useState<'my-projects' | 'bookmarks'>('my-projects');
  const [savedNotice, setSavedNotice] = useState(false);

  const myProjects = projects.filter(p => p.authorId === currentUser.id);
  const bookmarkedProjects = storageService.getBookmarkedProjects();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim(),
      department: department.trim(),
      course: course.trim(),
      year: year.trim(),
      rollNumber: rollNumber.trim(),
      bio: bio.trim(),
      avatar: avatar.trim(),
      githubProfile: githubProfile.trim(),
      linkedinProfile: linkedinProfile.trim(),
      website: website.trim(),
    });

    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                    {currentUser.name}
                  </h1>
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{currentUser.email}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{currentUser.department}</span>
                  <span aria-hidden="true">·</span>
                  <span>Joined {currentUser.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedNotice && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>Profile updated</span>
                </span>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Form vs View Details */}
          {isEditing ? (
            <form onSubmit={handleSave} className="pt-6 space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Edit Student Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree / Course
                  </label>
                  <input
                    type="text"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Standing / Year
                  </label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student ID / Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bio & Research Interests
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="url"
                  placeholder="GitHub URL"
                  value={githubProfile}
                  onChange={(e) => setGithubProfile(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={linkedinProfile}
                  onChange={(e) => setLinkedinProfile(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
                <input
                  type="url"
                  placeholder="Personal Website URL"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentUser.bio || 'No bio added yet.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Course / Major</div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                    {currentUser.course}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Academic Year</div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                    {currentUser.year}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Student Roll No.</div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 font-mono">
                    {currentUser.rollNumber}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Published Projects</div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                    {myProjects.length}
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="flex items-center gap-3 pt-2">
                {currentUser.githubProfile && (
                  <a
                    href={currentUser.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {currentUser.linkedinProfile && (
                  <a
                    href={currentUser.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {currentUser.website && (
                  <a
                    href={currentUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Tab Switcher: My Projects vs Bookmarked */}
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6">
            <button
              onClick={() => setActiveTab('my-projects')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'my-projects'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Published Projects ({myProjects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'bookmarks'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarked Projects ({bookmarkedProjects.length})</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'my-projects' ? (
            myProjects.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <p className="text-xs text-slate-500">You haven't uploaded any projects yet.</p>
                <button
                  onClick={() => onNavigate('upload-project')}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
                >
                  Upload First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500 cursor-pointer shadow-xs transition-colors"
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover rounded-lg mb-3"
                    />
                    <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mb-1">
                      {p.category}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {p.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            )
          ) : (
            bookmarkedProjects.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <Bookmark className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-xs text-slate-500">You haven't bookmarked any projects yet.</p>
                <button
                  onClick={() => onNavigate('explore')}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 rounded-lg"
                >
                  Explore Projects
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500 cursor-pointer shadow-xs transition-colors"
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover rounded-lg mb-3"
                    />
                    <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mb-1">
                      {p.category}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {p.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};
