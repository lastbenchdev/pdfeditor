import React from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: 'ready' | 'beta' | 'experimental';
  isLocal?: boolean;
  onClick?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, status, isLocal, onClick }) => {
  return (
    <div 
      className={`
        group relative flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm 
        hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 no-underline cursor-pointer h-full
        ${status === 'experimental' ? 'opacity-90' : 'opacity-100'}
      `}
      onClick={onClick} 
      role="button" 
      tabIndex={0}
    >
      {/* Top row: Icon + Status */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-indigo-200 dark:group-hover:shadow-indigo-900/40">
          {icon}
        </div>
        
        <div className="flex flex-col items-end gap-1.5">
          {isLocal && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
              Local
            </span>
          )}
          {status === 'experimental' && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
              Experimental
            </span>
          )}
          {status === 'beta' && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              Beta
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 transition-colors duration-300 line-clamp-3">
        {description}
      </p>

      {/* Decorative arrow */}
      <div className="mt-auto pt-6 flex items-center text-xs font-bold text-indigo-500/0 group-hover:text-indigo-500 transition-all duration-500 translate-x--2 group-hover:translate-x-0">
        Try tool <span className="ml-1">→</span>
      </div>
    </div>
  );
};
