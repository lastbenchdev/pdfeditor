import React from 'react';
import { Hero } from '../components/Hero';
import { ToolsGrid } from '../components/ToolsGrid';
import { topSixTools } from '../data/tools';
import { PrivacyBanner } from '../components/PrivacyBanner';

export const Home: React.FC = () => {
  return (
    <div className="pb-20 bg-white dark:bg-slate-950">
      <Hero />
      <PrivacyBanner />
      <ToolsGrid
        title="Popular Tools"
        description="The PDF operations everyone reaches for, all in one place."
        tools={topSixTools}
      />
    </div>
  );
};
