import React from 'react';
import { ExternalLink, RefreshCw, Plus, Bookmark, Sun, Moon, Search } from 'lucide-react';

interface HeaderProps {
  onRefreshScraper: () => void;
  isRefreshing: boolean;
  onOpenScrapeModal: () => void;
  onOpenSavedModal: () => void;
  savedCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSelectNav: (nav: 'edition' | 'themes' | 'tickers' | 'saved') => void;
  activeNav: string;
}

export const Header: React.FC<HeaderProps> = ({
  onRefreshScraper,
  isRefreshing,
  onOpenScrapeModal,
  onOpenSavedModal,
  savedCount,
  darkMode,
  onToggleDarkMode,
  onSelectNav,
  activeNav
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-[#FBF9F5]/95 dark:bg-[#121212]/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Wordmark Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onSelectNav('edition')}
            className="text-left group cursor-pointer focus-visible:outline-none"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
              AXIOM
            </span>
          </button>
          <span className="text-stone-300 dark:text-stone-700 font-light hidden sm:inline" aria-hidden="true">|</span>
          <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest hidden sm:inline font-sans">
            Market Themes
          </span>
        </div>

        {/* Zone 2: Clean 4–5 Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-sans font-medium text-stone-600 dark:text-stone-400">
          <button
            onClick={() => onSelectNav('edition')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-stone-100 pb-0.5 ${
              activeNav === 'edition' ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100' : ''
            }`}
          >
            Today's Edition
          </button>
          <button
            onClick={() => onSelectNav('themes')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-stone-100 pb-0.5 ${
              activeNav === 'themes' ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100' : ''
            }`}
          >
            Daily Themes
          </button>
          <button
            onClick={() => onSelectNav('tickers')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-stone-100 pb-0.5 ${
              activeNav === 'tickers' ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100' : ''
            }`}
          >
            Ticker Index
          </button>
          <button
            onClick={onOpenSavedModal}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1.5"
          >
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="font-mono text-xs tabular-nums text-stone-500 dark:text-stone-400">
                ({savedCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Paper Light' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors rounded hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onRefreshScraper}
            disabled={isRefreshing}
            title="Scrape and synthesize latest market wires"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-sans border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Scraping...' : 'Sync Wires'}</span>
          </button>

          <button
            onClick={onOpenScrapeModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium font-sans bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Scrape URL</span>
          </button>
        </div>

      </div>
    </header>
  );
};
