'use client';

import React from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
      title={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      <div className="relative w-6 h-6">
        {/* Sun icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
            isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        
        {/* Moon icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-slate-600 dark:text-slate-300 transition-all duration-300 ${
            isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {isDarkMode ? 'Mode clair' : 'Mode sombre'}
      </div>
    </button>
  );
};