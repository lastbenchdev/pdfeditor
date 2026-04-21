import React, { useState, useEffect } from 'react';
import { LayersIcon, GithubIcon, SunIcon, MoonIcon } from './Icons';

export const Header: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    // Fall back to system preference if nothing is saved.
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <a href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white no-underline">
          <LayersIcon className="text-indigo-600 dark:text-indigo-400" />
          <span>PDF Toolkit</span>
        </a>
        <nav className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer flex items-center justify-center transition-all duration-200"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href="https://github.com/THANSHEER/pdf-toolkit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 h-10 text-sm font-semibold rounded-full bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <GithubIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
