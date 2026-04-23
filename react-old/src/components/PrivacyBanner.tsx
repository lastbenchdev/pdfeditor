import React from 'react';

const EyeOffIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ZapIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ServerOffIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" />
    <path d="M10 10.5 4 16.5" />
    <path d="m2 12 10 10" />
    <path d="M4 4 2 2" />
    <path d="M7 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2" />
    <path d="M22 22 2 2" />
  </svg>
);

const pillars = [
  {
    icon: ServerOffIcon,
    iconBg: 'bg-indigo-50 dark:bg-indigo-950',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    accentBadge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
    badge: '100% Local',
    title: 'Zero server contact',
    description: 'Your PDF files are processed entirely inside your browser. They never leave your device — not even for a millisecond.',
  },
  {
    icon: EyeOffIcon,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accentBadge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    badge: 'No Tracking',
    title: 'Completely private',
    description: 'No accounts. No analytics on your files. No upload logs. What you do with your PDFs stays between you and your browser.',
  },
  {
    icon: ZapIcon,
    iconBg: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'hover:border-amber-300 dark:hover:border-amber-700',
    accentBadge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    badge: 'Instant',
    title: 'No wait times',
    description: 'No upload queues. No server bottlenecks. Processing happens at browser speed — results are ready in seconds.',
  },
];

export const PrivacyBanner: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-10">
      {/* Section label */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 max-w-[80px]" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Built on trust
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 max-w-[80px]" />
      </div>

      {/* Pillar cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pillars.map(({ icon: Icon, iconBg, iconColor, borderColor, accentBadge, badge, title, description }) => (
          <div
            key={title}
            className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${borderColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
          >
            {/* Icon + badge row */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${accentBadge}`}>
                {badge}
              </span>
            </div>

            {/* Text */}
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5 tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};