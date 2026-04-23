import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { CategorySection } from '../components/CategorySection';
import { CategoryNav } from '../components/CategoryNav';
import { toolsData } from '../data/tools';
import { categoriesData } from '../data/categories';

export const AllTools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  const filteredTools = useMemo(() => {
    if (!searchQuery) return toolsData;
    
    return toolsData.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery) ||
      tool.keywords.some(k => k.includes(searchQuery)) ||
      tool.tags.some(t => t.includes(searchQuery))
    );
  }, [searchQuery]);

  const displayedCategories = useMemo(() => {
    // If searching, show all categories that have matching tools
    if (searchQuery) {
      return categoriesData.filter(cat => 
        filteredTools.some(tool => tool.category === cat.id)
      );
    }
    
    // If not searching, filter by selected category
    if (selectedCategoryId === 'all') {
      return categoriesData;
    }
    
    return categoriesData.filter(cat => cat.id === selectedCategoryId);
  }, [searchQuery, selectedCategoryId, filteredTools]);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">All PDF Tools</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          The complete toolkit for all your PDF requirements.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 z-40 relative group">
        <SearchBar 
          onSearch={setQuery => {
            setSearchQuery(setQuery);
            // Optionally reset category when searching? Let's keep it for now.
          }} 
        />
      </div>

      <CategoryNav 
        selectedCategoryId={selectedCategoryId} 
        onSelectCategory={id => {
          setSelectedCategoryId(id);
          setSearchQuery(''); // Clear search when selecting a category for better browsing UX
        }} 
      />

      <div className="space-y-4">
        {displayedCategories.map((category) => {
          const catTools = filteredTools.filter(t => t.category === category.id);
          return (
            <CategorySection 
              key={category.id}
              category={category}
              tools={catTools}
            />
          );
        })}
        
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-4 font-bold">No tools found matching your search.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
              }}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Clear filters and search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
