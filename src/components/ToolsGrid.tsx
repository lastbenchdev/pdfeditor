import React from 'react';
import { ToolCard } from './ToolCard';
import type { Tool } from '../data/tools';

interface ToolsGridProps {
  title?: string;
  description?: string;
  tools: Tool[];
  id?: string;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ title, description, tools, id }) => {
  return (
    <section id={id} className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        {(title || description) && (
          <div className="text-center mb-16 max-w-2xl mx-auto">
            {title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.name}
              description={tool.description}
              icon={tool.icon}
              status={tool.status}
              isLocal={tool.isLocal}
              onClick={() => {
                // If it's a real tool with a route, navigate
                if (tool.route) {
                  window.location.hash = `#${tool.route}`;
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};