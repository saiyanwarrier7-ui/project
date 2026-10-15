import React, { useState } from 'react';
import { ViewTab, User } from '../types';
import {
  GraduationCap,
  Sun,
  Moon,
  PlusCircle,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  FolderGit2,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab, projectId?: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  allUsers: User[];
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  onLogout,
  onSwitchUser,
  allUsers,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single Brand Element */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg tracking-tight whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-5 h-5 transition-transform group-hover:scale-105" />
              </div>
              <span className="font-display">Student Project Hub</span>
            </button>
          </div>

          {/* Zone 2: 4–5 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onNavigate('explore')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                currentTab === 'explore'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : ''
              }`}
            >
              Explore Projects
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => onNavigate('student-dashboard')}
                  className={`whitespace-nowrap shrink-0 transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                    currentTab === 'student-dashboard'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : ''
                  }`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => onNavigate('my-projects')}
                  className={`whitespace-nowrap shrink-0 transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                    currentTab === 'my-projects'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : ''
                  }`}
                >
                  My Projects
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                  currentTab === 'admin-dashboard'
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1 Primary Action + Theme Toggle + User Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {currentUser ? (
              <>
                {/* Primary CTA */}
                <button
                  onClick={() => onNavigate('upload-project')}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Project</span>
                </button>

                {/* User Menu & Role Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="hidden lg:block text-left text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[110px]">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                        {currentUser.role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-fadeIn"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                          {currentUser.department}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => onNavigate('student-profile')}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                        >
                          <UserIcon className="w-3.5 h-3.5" />
                          <span>Student Profile</span>
                        </button>
                        <button
                          onClick={() => onNavigate('my-projects')}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                        >
                          <FolderGit2 className="w-3.5 h-3.5" />
                          <span>Manage My Projects</span>
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => onNavigate('admin-dashboard')}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Admin Moderation</span>
                          </button>
                        )}
                      </div>

                      {/* Fast Account Switcher for Demo testing */}
                      <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Switch Demo Account
                        </p>
                        <div className="space-y-1">
                          {allUsers.map((u) => (
                            <button
                              key={u.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSwitchUser(u.id);
                                setUserDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2 py-1 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                u.id === currentUser.id
                                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span className="truncate max-w-[140px] text-left">{u.name}</span>
                              <span className="text-[10px] text-slate-400 uppercase">
                                {u.role === 'admin' ? 'Admin' : 'Student'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1">
            <button
              onClick={() => {
                onNavigate('explore');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Explore Projects</span>
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => {
                    onNavigate('student-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Student Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('my-projects');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
                >
                  <FolderGit2 className="w-4 h-4 text-slate-400" />
                  <span>My Projects</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('upload-project');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg text-left"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit New Project</span>
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  onNavigate('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
