import React, { useRef, useEffect } from 'react';
import { categoriesData, type Category } from '../data/categories';
import { 
  FileTextIcon, 
  MinimizeIcon, 
  FileUpIcon, 
  DownloadIcon, 
  PenToolIcon, 
  LockIcon,
  LayersIcon
} from './Icons';

interface CategoryNavProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  'file-text': FileTextIcon,
  'minimize': MinimizeIcon,
  'file-up': FileUpIcon,
  'download': DownloadIcon,
  'pen-tool': PenToolIcon,
  'lock': LockIcon,
  'all': LayersIcon
};

export const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategoryId, onSelectCategory }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected item into view on mobile
  useEffect(() => {
    const activeItem = scrollRef.current?.querySelector('[data-active="true"]');
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategoryId]);

  const categories = [
    { id: 'all', name: 'All Tools', icon: 'all' },
    ...categoriesData
  ];

  return (
    <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-16 z-30 mb-8">
      <div 
        ref={scrollRef}
        className="w-full flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-4 px-6"
      >
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || FileTextIcon;
          const isActive = selectedCategoryId === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              data-active={isActive}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-bold text-sm border-2
                ${isActive 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-105' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-current'}`} />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
