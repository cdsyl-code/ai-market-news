import React, { useState } from 'react';
import { MarketTheme, ScrapedArticle, TickerInfo } from '../types/market';
import { ArticleCard } from './ArticleCard';
import { TrendingUp, TrendingDown, Minus, Copy, Check, ExternalLink, ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';

interface ThemeSectionProps {
  theme: MarketTheme;
  savedArticleIds: Set<string>;
  onToggleSave: (article: ScrapedArticle) => void;
  onOpenArticleDetail: (article: ScrapedArticle) => void;
  onSelectTicker: (ticker: string) => void;
  fontFamily: 'serif' | 'sans';
  fontSize: 'sm' | 'base' | 'lg';
  activeTickerFilter: string | null;
  onCloseTheme?: () => void;
  onPrevTheme?: () => void;
  onNextTheme?: () => void;
  themeIndex?: number;
  totalThemes?: number;
}

export const ThemeSection: React.FC<ThemeSectionProps> = ({
  theme,
  savedArticleIds,
  onToggleSave,
  onOpenArticleDetail,
  onSelectTicker,
  fontFamily,
  fontSize,
  activeTickerFilter,
  onCloseTheme,
  onPrevTheme,
  onNextTheme,
  themeIndex,
  totalThemes
}) => {
  const [copied, setCopied] = useState(false);

  // Filter stories if activeTickerFilter is set
  const displayedStories = activeTickerFilter
    ? theme.stories.filter(s => s.tickers.includes(activeTickerFilter))
    : theme.stories;

  const handleCopyBrief = () => {
    const briefText = `THEME ${theme.themeNumber}: ${theme.title}\n${theme.subtitle}\n\nOVERVIEW:\n${theme.executiveSummary}\n\nKEY TAKEAWAYS:\n${theme.keyTakeaways.map(t => `• ${t}`).join('\n')}\n\nAFFECTED TICKERS:\n${theme.affectedTickers.map(t => `${t.symbol}: ${t.direction.toUpperCase()} - ${t.impactReason}`).join('\n')}\n\nSOURCES:\n${theme.stories.map(s => `• ${s.title} (${s.sourceDomain}): ${s.sourceUrl}`).join('\n')}`;

    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id={theme.id} className="pt-6 pb-12 scroll-mt-20 animate-fade-in">
      
      {/* Top Reading Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          {onCloseTheme && (
            <button
              onClick={onCloseTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-sans border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Themes Grid</span>
            </button>
          )}

          {themeIndex !== undefined && totalThemes !== undefined && (
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
              Theme {themeIndex + 1} of {totalThemes}
            </span>
          )}
        </div>

        {/* Theme Pagination & Action Controls */}
        <div className="flex items-center gap-2">
          {onPrevTheme && (
            <button
              onClick={onPrevTheme}
              title="Previous Theme"
              className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {onNextTheme && (
            <button
              onClick={onNextTheme}
              title="Next Theme"
              className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopyBrief}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-sans text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Copy theme summary and source links"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Brief'}</span>
          </button>

          {onCloseTheme && (
            <button
              onClick={onCloseTheme}
              title="Close theme details"
              className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Theme Header Meta */}
      <div className="flex items-baseline gap-3 flex-wrap mb-2">
        <span className="font-mono text-xs text-stone-500 dark:text-stone-400 font-semibold tracking-wider">
          THEME {theme.themeNumber}
        </span>
        <span aria-hidden="true" className="text-stone-300 dark:text-stone-700 font-light">/</span>
        <span className="text-xs uppercase tracking-wider font-sans text-stone-500 dark:text-stone-400">
          {theme.category}
        </span>
        <span aria-hidden="true" className="text-stone-300 dark:text-stone-700 font-light">·</span>
        <span className="text-xs font-sans text-stone-500 dark:text-stone-400">
          {theme.marketImpact} Market Impact
        </span>
      </div>

      {/* Main Theme Headline */}
      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-stone-900 dark:text-stone-100 mb-2 text-balance">
        {theme.title}
      </h2>

      {/* Subtitle Framing */}
      <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-3xl mb-8 leading-relaxed">
        {theme.subtitle}
      </p>

      {/* Executive Synthesis & Key Takeaways Card */}
      <div className="bg-stone-50/80 dark:bg-stone-900/40 border border-stone-200/90 dark:border-stone-800 rounded-lg p-5 sm:p-7 mb-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Executive Overview */}
          <div className="lg:col-span-7">
            <span className="text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-sans block mb-2 font-semibold">
              Institutional Synthesis
            </span>
            <p className={`${fontFamily === 'serif' ? 'font-serif' : 'font-sans'} text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed`}>
              {theme.executiveSummary}
            </p>
          </div>

          {/* Key Bullet Takeaways */}
          <div className="lg:col-span-5 lg:border-l lg:border-stone-200 dark:lg:border-stone-800 lg:pl-8">
            <span className="text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-sans block mb-2 font-semibold">
              Key Macro Takeaways
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans text-stone-600 dark:text-stone-300">
              {theme.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-stone-400 font-mono text-xs select-none mt-0.5">•</span>
                  <span className="leading-snug">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Affected Tickers Horizontal Bar */}
        {theme.affectedTickers && theme.affectedTickers.length > 0 && (
          <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800">
            <div className="text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-sans mb-3 font-semibold">
              Affected Equities & Impact Dynamics
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {theme.affectedTickers.map((ticker) => {
                const isSelected = activeTickerFilter === ticker.symbol;
                return (
                  <button
                    key={ticker.symbol}
                    onClick={() => onSelectTicker(ticker.symbol)}
                    className={`text-left p-3 rounded border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                        : 'bg-white dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700/80 hover:border-stone-400 dark:hover:border-stone-500'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-semibold">${ticker.symbol}</span>
                      {ticker.change && (
                        <span className={`tabular-nums ${
                          isSelected
                            ? 'text-stone-300 dark:text-stone-600'
                            : ticker.direction === 'bullish'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : ticker.direction === 'bearish'
                            ? 'text-red-700 dark:text-red-400'
                            : 'text-stone-600 dark:text-stone-400'
                        }`}>
                          {ticker.change}
                        </span>
                      )}
                    </div>
                    <div className={`text-[11px] truncate font-sans ${isSelected ? 'text-stone-300 dark:text-stone-700' : 'text-stone-500 dark:text-stone-400'}`}>
                      {ticker.name}
                    </div>
                    <p className={`text-[11px] mt-1.5 line-clamp-2 leading-tight ${isSelected ? 'text-stone-200 dark:text-stone-800' : 'text-stone-600 dark:text-stone-300'}`}>
                      {ticker.impactReason}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Scraped Stories Heading & Grid with Readily Available Source Linkouts */}
      <div>
        <div className="flex items-center justify-between mb-4 text-xs font-sans text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-widest text-[11px] font-semibold">
              Scraped Wire Sources ({displayedStories.length})
            </span>
            <span aria-hidden="true">·</span>
            <span>All stories provide direct source linkout</span>
          </div>

          {activeTickerFilter && (
            <button
              onClick={() => onSelectTicker('')}
              className="text-stone-800 dark:text-stone-200 underline cursor-pointer"
            >
              Clear filter (${activeTickerFilter})
            </button>
          )}
        </div>

        {displayedStories.length === 0 ? (
          <div className="text-center py-8 text-stone-500 dark:text-stone-400 text-xs font-sans border border-dashed border-stone-300 dark:border-stone-800 rounded">
            No scraped wire stories specifically tagged with ${activeTickerFilter} under this theme.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedStories.map((story) => (
              <ArticleCard
                key={story.id}
                article={story}
                isSaved={savedArticleIds.has(story.id)}
                onToggleSave={onToggleSave}
                onOpenDetail={onOpenArticleDetail}
                onSelectTicker={onSelectTicker}
                fontFamily={fontFamily}
                fontSize={fontSize}
              />
            ))}
          </div>
        )}
      </div>

      {/* Back to top of theme or close affordance */}
      <div className="mt-8 pt-4 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between text-xs font-sans text-stone-500">
        {onCloseTheme && (
          <button
            onClick={onCloseTheme}
            className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Themes Grid</span>
          </button>
        )}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors ml-auto"
        >
          Back to Top ↑
        </button>
      </div>

    </section>
  );
};
