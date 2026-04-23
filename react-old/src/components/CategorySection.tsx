import React from 'react';
import { ToolCard } from './ToolCard';
import type { Tool } from '../data/tools';
import type { Category } from '../data/categories';

interface CategorySectionProps {
  category: Category;
  tools: Tool[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, tools }) => {
  if (tools.length === 0) return null;

  return (
    <section id={category.id} className="py-12 border-b border-slate-200 dark:border-slate-800 last:border-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            {category.name}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">{category.description}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.name}
              description={tool.description}
              icon={tool.icon}
              status={tool.status}
              isLocal={tool.isLocal}
              onClick={() => {
                if (tool.route) {
                  window.location.hash = `#/editor?tool=${tool.id}`;
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
