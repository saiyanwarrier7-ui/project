import React, { useState } from 'react';
import { User, ViewTab } from '../types';
import { storageService } from '../services/storageService';
import {
  GraduationCap,
  ShieldCheck,
  User as UserIcon,
  Lock,
  Mail,
  Building2,
  BookOpen,
  Calendar,
  Hash,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

interface AuthPagesProps {
  mode: 'login' | 'register';
  onNavigate: (tab: ViewTab) => void;
  onAuthSuccess: (user: User) => void;
  demoUsers: User[];
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  mode,
  onNavigate,
  onAuthSuccess,
  demoUsers,
}) => {
  // Login State
  const [loginEmail, setLoginEmail] = useState('alex.rivera@university.edu');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [course, setCourse] = useState('B.Tech in Computer Science');
  const [year, setYear] = useState('Year 4 (Senior)');
  const [rollNumber, setRollNumber] = useState('');
  const [bio, setBio] = useState('');

  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = storageService.login(loginEmail);
    if (!res.success || !res.user) {
      setError(res.error || 'Authentication failed. Check your email.');
      return;
    }
    onAuthSuccess(res.user);
    onNavigate('student-dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !rollNumber.trim()) {
      setError('Please provide your name, institutional email, and roll number.');
      return;
    }

    const res = storageService.register({
      name: name.trim(),
      email: email.trim(),
      role: 'student',
      department,
      course,
      year,
      rollNumber: rollNumber.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      bio: bio.trim() || 'Student researcher and developer.',
      githubProfile: `https://github.com/${name.toLowerCase().replace(/\s+/g, '')}`,
    });

    if (!res.success || !res.user) {
      setError(res.error || 'Registration failed.');
      return;
    }

    onAuthSuccess(res.user);
    onNavigate('student-dashboard');
  };

  const handleQuickLogin = (user: User) => {
    storageService.switchUser(user.id);
    onAuthSuccess(user);
    if (user.role === 'admin') {
      onNavigate('admin-dashboard');
    } else {
      onNavigate('student-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-md mb-3">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
          {mode === 'login' ? 'Sign in to Student Project Hub' : 'Register Student Account'}
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          {mode === 'login'
            ? 'Access your academic repository dashboard and manage capstone uploads.'
            : 'Join the university project archive to showcase research and collaborate.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        
        {/* Quick Demo Switcher Strip */}
        <div className="mb-6 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 shadow-xs">
          <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Fast 1-Click Demo Login</span>
            <span className="text-[10px] text-blue-500 font-normal">Pre-configured roles</span>
          </div>

          <div className="space-y-1.5">
            {demoUsers.slice(0, 3).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-100/50 dark:hover:bg-slate-800 border border-blue-100 dark:border-slate-800 text-xs transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="text-left min-w-0">
                    <span className="font-semibold text-slate-900 dark:text-white truncate block">
                      {u.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {u.department}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {u.role === 'admin' ? 'Faculty Admin' : 'Student'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Auth Box */}
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Google Auth Action */}
          <div className="mb-6">
            <GoogleSignInButton
              label={mode === 'register' ? 'Register with Google Account' : 'Sign in with Google'}
              isRegister={mode === 'register'}
              onSuccess={(user, isNewUser) => {
                onAuthSuccess(user);
                onNavigate('student-dashboard');
              }}
              onError={(err) => setError(err)}
            />

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">
                  {mode === 'register' ? 'Or register with email' : 'Or sign in with email'}
                </span>
              </div>
            </div>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Need a student account? Register here
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Roll No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CS-2023-010"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year *
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Year 4 (Senior)">Year 4 (Senior)</option>
                    <option value="Year 3 (Junior)">Year 3 (Junior)</option>
                    <option value="Year 2 (Sophomore)">Year 2 (Sophomore)</option>
                    <option value="Year 1 (Freshman)">Year 1 (Freshman)</option>
                    <option value="Postgraduate / M.Tech">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Degree / Program *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer Science"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                Create Student Account
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Already registered? Sign in
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
