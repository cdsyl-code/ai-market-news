import React, { useState } from 'react';
import { X, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DailyEdition, TickerInfo } from '../types/market';

interface TickerIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition: DailyEdition;
  onSelectTicker: (ticker: string) => void;
}

export const TickerIndexModal: React.FC<TickerIndexModalProps> = ({
  isOpen,
  onClose,
  edition,
  onSelectTicker
}) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  // Aggregate all unique tickers across themes
  const tickerMap = new Map<string, { info: TickerInfo; themeTitle: string; count: number }>();

  edition.themes.forEach(theme => {
    theme.affectedTickers.forEach(t => {
      const existing = tickerMap.get(t.symbol);
      if (!existing) {
        // Count how many stories mention this ticker
        const storyCount = theme.stories.filter(s => s.tickers.includes(t.symbol)).length;
        tickerMap.set(t.symbol, {
          info: t,
          themeTitle: theme.title,
          count: Math.max(1, storyCount)
        });
      }
    });
  });

  const allTickers = Array.from(tickerMap.values());
  const filtered = allTickers.filter(item =>
    item.info.symbol.toLowerCase().includes(filter.toLowerCase()) ||
    item.info.name.toLowerCase().includes(filter.toLowerCase()) ||
    (item.info.sector && item.info.sector.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#FBF9F5] dark:bg-[#151515] border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-medium text-base text-stone-900 dark:text-stone-100">
              Daily Equities & Ticker Index
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              All stocks and indices impacted by today's macroeconomic themes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-stone-200/60 dark:border-stone-800/60 bg-stone-50/50 dark:bg-stone-900/30">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by ticker symbol, company, or sector..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 text-xs font-sans bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Ticker Table List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-200/60 dark:divide-stone-800/60">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-stone-400 font-sans">
              No matching tickers found.
            </div>
          ) : (
            filtered.map(({ info, themeTitle, count }) => (
              <div
                key={info.symbol}
                onClick={() => {
                  onSelectTicker(info.symbol);
                  onClose();
                }}
                className="py-3 flex items-center justify-between gap-4 hover:bg-stone-100/60 dark:hover:bg-stone-800/40 px-2 rounded cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                    ${info.symbol}
                  </div>
                  <div>
                    <div className="font-sans text-xs font-medium text-stone-800 dark:text-stone-200">
                      {info.name}
                    </div>
                    <div className="text-[11px] text-stone-500 font-sans">
                      {info.sector} · Theme: <span className="italic">{themeTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4 shrink-0 font-sans">
                  {info.change && (
                    <span className={`font-mono text-xs font-medium tabular-nums ${
                      info.direction === 'bullish' ? 'text-emerald-700 dark:text-emerald-400' :
                      info.direction === 'bearish' ? 'text-red-700 dark:text-red-400' : 'text-stone-500'
                    }`}>
                      {info.change}
                    </span>
                  )}
                  <span className="text-[11px] text-stone-400 font-sans hidden sm:inline">
                    {count} stories
                  </span>
                  <span className="text-stone-400 font-mono text-xs">→</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-400 font-sans text-right">
          Click any row to filter today's briefing by ticker
        </div>
      </div>
    </div>
  );
};
