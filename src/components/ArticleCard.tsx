import React from 'react';
import { ScrapedArticle } from '../types/market';
import { ExternalLink, Bookmark, BookmarkCheck, Quote, Clock, Sparkles } from 'lucide-react';

interface ArticleCardProps {
  article: ScrapedArticle;
  isSaved: boolean;
  onToggleSave: (article: ScrapedArticle) => void;
  onOpenDetail: (article: ScrapedArticle) => void;
  onSelectTicker?: (ticker: string) => void;
  fontFamily: 'serif' | 'sans';
  fontSize: 'sm' | 'base' | 'lg';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isSaved,
  onToggleSave,
  onOpenDetail,
  onSelectTicker,
  fontFamily,
  fontSize
}) => {
  const timeFormatted = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const bodyFontSize = fontSize === 'lg' ? 'text-base' : fontSize === 'sm' ? 'text-xs' : 'text-sm';
  const titleFontSize = fontSize === 'lg' ? 'text-lg sm:text-xl' : fontSize === 'sm' ? 'text-sm sm:text-base' : 'text-base sm:text-lg';

  return (
    <article className="border border-stone-200 dark:border-stone-800 rounded bg-[#FBF9F5] dark:bg-[#141414] p-4 sm:p-5 hover:border-stone-400 dark:hover:border-stone-700 transition-colors flex flex-col justify-between group">
      <div>
        
        {/* Zero-Pill Clean Metadata Header */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-sans mb-2 flex-wrap gap-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[11px]">
              {article.source}
            </span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>{article.sourceDomain}</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {timeFormatted}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400 dark:text-stone-500 font-sans">
              {article.readTime}
            </span>
            <button
              onClick={() => onToggleSave(article)}
              title={isSaved ? 'Remove bookmark' : 'Bookmark story'}
              className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 p-0.5 rounded transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-stone-900 dark:text-stone-100 fill-stone-900 dark:fill-stone-100" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Article Headline */}
        <h3 className={`font-serif font-medium text-stone-900 dark:text-stone-100 mb-2 leading-snug group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors ${titleFontSize}`}>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline focus:outline-none focus:ring-1 focus:ring-stone-400 rounded inline"
          >
            {article.title}
          </a>
        </h3>

        {/* Summary */}
        <p className={`${fontFamily === 'serif' ? 'font-serif' : 'font-sans'} text-stone-600 dark:text-stone-300 leading-relaxed mb-3 ${bodyFontSize}`}>
          {article.summary}
        </p>

        {/* Key Quote Snippet if present */}
        {article.keyQuotes && article.keyQuotes.length > 0 && (
          <div className="border-t border-b border-stone-200/70 dark:border-stone-800/80 py-2.5 my-3 text-xs italic font-serif text-stone-700 dark:text-stone-300 flex items-start gap-2">
            <Quote className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>"{article.keyQuotes[0]}"</span>
          </div>
        )}

        {/* Tickers affected */}
        {article.tickers && article.tickers.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono text-stone-600 dark:text-stone-400 mt-2 mb-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-stone-400 dark:text-stone-500">Tickers:</span>
            {article.tickers.map((t) => (
              <button
                key={t}
                onClick={() => onSelectTicker && onSelectTicker(t)}
                className="hover:text-stone-900 dark:hover:text-stone-100 hover:underline cursor-pointer font-medium"
              >
                ${t}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Footer with Readily Available Source Linkout */}
      <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between text-xs font-sans mt-2">
        <button
          onClick={() => onOpenDetail(article)}
          className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium cursor-pointer transition-colors"
        >
          View Brief & Takeaways
        </button>

        {/* Primary Unambiguous Linkout */}
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group/link shrink-0"
        >
          <span>Open on {article.sourceDomain}</span>
          <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
      </div>

    </article>
  );
};
