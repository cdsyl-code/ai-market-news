import React from 'react';
import { Search, X, Type, Sliders, BookOpen } from 'lucide-react';

interface ReaderToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  fontFamily: 'serif' | 'sans';
  onToggleFontFamily: () => void;
  fontSize: 'sm' | 'base' | 'lg';
  onChangeFontSize: (size: 'sm' | 'base' | 'lg') => void;
  activeTickerFilter: string | null;
  onClearTickerFilter: () => void;
  totalStoriesCount: number;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  searchQuery,
  onSearchChange,
  fontFamily,
  onToggleFontFamily,
  fontSize,
  onChangeFontSize,
  activeTickerFilter,
  onClearTickerFilter,
  totalStoriesCount
}) => {
  return (
    <div className="py-3 border-b border-stone-200/80 dark:border-stone-800/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-stone-500 dark:text-stone-400">
      
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Filter stories by keyword, theme, or company..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-stone-400"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Ticker Filter active notice & Typography preferences */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        
        {/* Active ticker badge if filtered */}
        {activeTickerFilter && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded font-mono text-[11px]">
            <span>Filter: ${activeTickerFilter}</span>
            <button onClick={onClearTickerFilter} className="hover:opacity-75">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Font Family Toggle */}
        <button
          onClick={onToggleFontFamily}
          title={`Switch reading font to ${fontFamily === 'serif' ? 'Sans-Serif' : 'Serif'}`}
          className="flex items-center gap-1 px-2.5 py-1 border border-stone-200 dark:border-stone-800 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-stone-700 dark:text-stone-300"
        >
          <Type className="w-3 h-3" />
          <span>{fontFamily === 'serif' ? 'Serif' : 'Sans'}</span>
        </button>

        {/* Font Size Adjuster */}
        <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded overflow-hidden">
          <button
            onClick={() => onChangeFontSize('sm')}
            className={`px-2 py-1 transition-colors ${fontSize === 'sm' ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-semibold' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'}`}
            title="Small text"
          >
            A-
          </button>
          <button
            onClick={() => onChangeFontSize('base')}
            className={`px-2 py-1 border-x border-stone-200 dark:border-stone-800 transition-colors ${fontSize === 'base' ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-semibold' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'}`}
            title="Standard text"
          >
            A
          </button>
          <button
            onClick={() => onChangeFontSize('lg')}
            className={`px-2 py-1 transition-colors ${fontSize === 'lg' ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-semibold' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'}`}
            title="Large text"
          >
            A+
          </button>
        </div>

      </div>

    </div>
  );
};
