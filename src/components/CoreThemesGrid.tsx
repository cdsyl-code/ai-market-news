import React from 'react';
import { MarketTheme } from '../types/market';
import { ArrowRight, ChevronUp, Layers, Newspaper } from 'lucide-react';

interface CoreThemesGridProps {
  themes: MarketTheme[];
  selectedThemeId: string | null;
  onSelectTheme: (themeId: string) => void;
  activeTickerFilter: string | null;
}

export const CoreThemesGrid: React.FC<CoreThemesGridProps> = ({
  themes,
  selectedThemeId,
  onSelectTheme,
  activeTickerFilter
}) => {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-stone-500 dark:text-stone-400" />
          <h2 className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-sans font-semibold">
            Today's Core Themes ({themes.length})
          </h2>
        </div>
        <span className="text-xs text-stone-400 dark:text-stone-500 font-sans">
          {selectedThemeId ? 'Click a theme card to toggle or change focus' : 'Select any theme grid to explore full synthesis & wire stories'}
        </span>
      </div>

      {/* Responsive Grid of Core Theme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {themes.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          
          // Get unique sources in this theme
          const uniqueSources = Array.from(new Set(theme.stories.map(s => s.source))).slice(0, 3).join(', ');

          return (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTheme(theme.id);
                }
              }}
              className={`text-left p-5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 ${
                isSelected
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-100/90 dark:bg-stone-900/90 shadow-md ring-1 ring-stone-900/10 dark:ring-stone-100/20'
                  : 'border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-[#141414] hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Meta line: Theme number & Impact */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className={`font-semibold ${isSelected ? 'text-stone-900 dark:text-stone-100' : 'text-stone-500 dark:text-stone-400'}`}>
                    THEME {theme.themeNumber}
                  </span>
                  <span className={`text-[11px] font-sans uppercase tracking-wider ${
                    theme.marketImpact === 'High' ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-stone-500 dark:text-stone-400'
                  }`}>
                    {theme.marketImpact} Impact
                  </span>
                </div>

                {/* Category kicker */}
                <div className="text-[11px] uppercase tracking-wider font-sans text-stone-400 dark:text-stone-500 mb-1.5">
                  {theme.category}
                </div>

                {/* Main Theme Headline */}
                <h3 className={`font-serif text-base sm:text-lg font-medium leading-snug mb-2 transition-colors ${
                  isSelected
                    ? 'text-stone-950 dark:text-white'
                    : 'text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300'
                }`}>
                  {theme.title}
                </h3>

                {/* Subtitle / Thesis summary */}
                <p className="font-sans text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mb-4">
                  {theme.subtitle}
                </p>

                {/* Ticker Preview */}
                {theme.affectedTickers && theme.affectedTickers.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono mb-4 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                    <span className="text-[10px] font-sans uppercase text-stone-400">Tickers:</span>
                    {theme.affectedTickers.slice(0, 4).map((t) => (
                      <span
                        key={t.symbol}
                        className={`text-[11px] ${
                          activeTickerFilter === t.symbol
                            ? 'font-bold text-stone-900 dark:text-stone-100 underline'
                            : 'text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        ${t.symbol}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Status & Trigger */}
              <div className="pt-3 border-t border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between text-xs font-sans">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <Newspaper className="w-3 h-3 text-stone-400" />
                  <span>{theme.stories.length} wire stories</span>
                </span>

                <div className={`flex items-center gap-1 font-medium text-xs transition-colors ${
                  isSelected
                    ? 'text-stone-950 dark:text-white font-semibold'
                    : 'text-stone-700 dark:text-stone-300 group-hover:text-stone-950 dark:group-hover:text-white'
                }`}>
                  <span>{isSelected ? 'Collapse' : 'Explore'}</span>
                  {isSelected ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
