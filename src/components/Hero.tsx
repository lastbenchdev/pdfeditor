import React, { useState, useEffect } from 'react';
import { FileUpIcon, PickaxeIcon } from './Icons';

export const Hero: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [
    "Ad Free & Open Source.",
    "Client-side & Privacy-oriented.",
    "100% In-Browser."
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && displayText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, typingSpeed]);

  return (
    <section className="relative overflow-hidden pt-12 pb-8 md:pt-20 md:pb-12 bg-white dark:bg-slate-950">
      {/* Premium Background Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_top,_var(--color-accent-hover)_0%,_transparent_70%)] opacity-[0.03] dark:opacity-[0.07]"></div>
      
      <div className="max-w-5xl mx-auto px-6 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Next-Gen PDF Tools
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-8">
          All-in-one PDF tools. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400 min-h-[1.2em] inline-block md:whitespace-nowrap">
            {displayText}
            <span className="inline-block w-[3px] h-[0.8em] bg-accent ml-1 -mb-1 animate-pulse"></span>
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed font-medium md:whitespace-nowrap">
          Merge, split, compress, and edit your PDFs directly in your browser. 
          <span className="block mt-3 text-slate-900 dark:text-white font-bold"> 
            Your files never leave your device. 
          </span>
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-accent text-white font-extrabold rounded-full transition-all hover:bg-accent-hover hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
            onClick={() => alert('File picker coming soon!')}
          >
            <FileUpIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            Select PDF file
          </button>
          <a 
            href="#/tools" 
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-bg text-primary border-2 border-border hover:border-accent hover:text-accent font-extrabold rounded-full transition-all hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
          >
            <PickaxeIcon className="w-6 h-6 transition-transform group-hover:rotate-12" />
            Explore all tools
          </a>
        </div>


      </div>
    </section>
  );
};
