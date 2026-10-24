import React from 'react';
import { DailyEdition } from '../types/market';
import { Calendar, RefreshCw } from 'lucide-react';

interface EditionHeaderProps {
  edition: DailyEdition;
  onSelectTheme?: (themeId: string) => void;
  availableDates: Array<{ date: string; formattedDate: string; editionNumber: number }>;
  currentDate: string;
  onSelectDate: (date: string) => void;
  onRefreshScraper?: () => void;
  isRefreshing?: boolean;
}

export const EditionHeader: React.FC<EditionHeaderProps> = ({
  edition,
  availableDates,
  currentDate,
  onSelectDate,
  onRefreshScraper,
  isRefreshing
}) => {
  return (
    <div className="border-b border-stone-200 dark:border-stone-800 pb-6 pt-6">
      
      {/* Top Meta Line: Edition number, Date switcher, Scrape count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans text-stone-500 dark:text-stone-400 mb-4 pb-3 border-b border-stone-200/60 dark:border-stone-800/60">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono tracking-wider">EDITION NO. {edition.editionNumber}</span>
          <span aria-hidden="true">·</span>
          <span>{edition.formattedDate}</span>
          <span aria-hidden="true">·</span>
          <span>{edition.totalArticlesScraped} articles scraped across {edition.sourcesScraped.length} wire desks</span>
        </div>

        {/* Edition Date Selector & Refresh */}
        <div className="flex items-center gap-3 shrink-0">
          {onRefreshScraper && (
            <button
              onClick={onRefreshScraper}
              disabled={isRefreshing}
              title="Sync wire feeds"
              className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors p-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={currentDate}
              onChange={(e) => onSelectDate(e.target.value)}
              className="bg-transparent text-xs text-stone-700 dark:text-stone-300 font-sans border-0 focus:ring-0 cursor-pointer hover:text-stone-900 dark:hover:text-stone-100 pr-2"
            >
              {availableDates.map((item) => (
                <option key={item.date} value={item.date} className="bg-white dark:bg-stone-900">
                  {item.date === availableDates[0]?.date ? `Today (${item.date})` : item.formattedDate}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Masthead Title */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900 dark:text-stone-100 text-balance">
          Daily Thematic Market Intelligence
        </h1>
      </div>

    </div>
  );
};
