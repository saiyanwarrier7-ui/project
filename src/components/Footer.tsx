import React from 'react';
import { ViewTab } from '../types';
import { GraduationCap, Github, Globe, Heart, Shield } from 'lucide-react';
import { storageService } from '../services/storageService';

interface FooterProps {
  onNavigate: (tab: ViewTab) => void;
  onResetFactory: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onResetFactory }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-display">Student Project Hub</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A university academic project repository designed to preserve, showcase, and evaluate student engineering and research work.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  All Academic Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Featured Capstones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Live Deployed Websites
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Students & Faculty
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('upload-project')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Submit Academic Project
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('student-dashboard')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Academic Evaluation Board
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Repository Tools
            </h4>
            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                Evaluation demo tools & seed reset for testing:
              </p>
              <button
                onClick={onResetFactory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                Reset Demo Data
              </button>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Student Project Hub. Academic open repository for university researchers and engineering teams.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Peer-reviewed integrity</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
