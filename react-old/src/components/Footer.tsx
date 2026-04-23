import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Privacy First</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Processing happens entirely in your browser. Your files are never uploaded to our servers.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Lightning Fast</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Using multi-threaded Web Workers, we ensure your browser stays responsive during heavy tasks.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Highly Secure</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              End-to-end security with local file handling. No tracking, no data storage, pure utility.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">PDF Toolkit</h5>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Fast, private, browser-first PDF tools for everyday document workflows.
            </p>
          </div>

          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#/" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#/tools" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Explore Tools
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Resources</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/THANSHEER/pdf-toolkit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/THANSHEER/pdf-toolkit/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Report Issue
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Legal</h5>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              This project is licensed under
              {' '}
              <a
                href="https://github.com/THANSHEER/pdf-toolkit/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                AGPL-3.0
              </a>
              .
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>Copyright {new Date().getFullYear()} PDF Toolkit. All rights reserved.</p>
          <p>Built for private, local-first PDF workflows.</p>
        </div>
      </div>
    </footer>
  );
};
