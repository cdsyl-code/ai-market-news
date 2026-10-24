import React, { useEffect, useState } from 'react';
import { ScrapedArticle } from '../types/market';
import { X, ExternalLink, Bookmark, BookmarkCheck, Copy, Check, Quote, Clock, Share2 } from 'lucide-react';

interface ArticleDetailModalProps {
  article: ScrapedArticle | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (article: ScrapedArticle) => void;
  onSelectTicker: (ticker: string) => void;
  fontFamily: 'serif' | 'sans';
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  isSaved,
  onToggleSave,
  onSelectTicker,
  fontFamily
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.sourceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#FBF9F5] dark:bg-[#151515] border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Actions */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-sans text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[11px]">
              {article.source}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.sourceDomain}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy source linkout"
              className="p-1.5 hover:text-stone-900 dark:hover:text-stone-100 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onToggleSave(article)}
              title={isSaved ? 'Remove bookmark' : 'Bookmark story'}
              className="p-1.5 hover:text-stone-900 dark:hover:text-stone-100 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-stone-900 dark:text-stone-100 fill-stone-900 dark:fill-stone-100" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              title="Close modal (Esc)"
              className="p-1.5 hover:text-stone-900 dark:hover:text-stone-100 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-6 overflow-y-auto space-y-6">
          
          {/* Metadata row */}
          <div className="text-xs text-stone-500 dark:text-stone-400 font-sans flex items-center gap-2 flex-wrap">
            {article.author && (
              <>
                <span>By {article.author}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {article.title}
            </a>
          </h2>

          {/* Summary / Body */}
          <div className={`${fontFamily === 'serif' ? 'font-serif' : 'font-sans'} text-stone-700 dark:text-stone-300 text-base leading-relaxed space-y-4`}>
            <p>{article.summary}</p>
          </div>

          {/* Direct Quotations */}
          {article.keyQuotes && article.keyQuotes.length > 0 && (
            <div className="bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800/80 p-4 rounded text-sm font-serif italic text-stone-800 dark:text-stone-200 space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-sans block not-italic">
                Reported Excerpt
              </span>
              {article.keyQuotes.map((q, idx) => (
                <p key={idx}>"{q}"</p>
              ))}
            </div>
          )}

          {/* Affected Tickers */}
          {article.tickers && article.tickers.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-sans block mb-2">
                Equities Referenced
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {article.tickers.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      onSelectTicker(t);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                  >
                    ${t}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Direct Source Linkout CTA */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-sans hidden sm:inline">
            Direct canonical web source available
          </span>

          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white dark:text-stone-900 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white rounded transition-colors shadow-sm ml-auto"
          >
            <span>Read Original on {article.sourceDomain}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
