import React, { useState } from 'react';
import { X, Globe, ArrowRight, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { ScrapedArticle } from '../types/market';

interface ScrapeUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleScraped: (article: ScrapedArticle, themeTitle: string) => void;
}

export const ScrapeUrlModal: React.FC<ScrapeUrlModalProps> = ({
  isOpen,
  onClose,
  onArticleScraped
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapedResult, setScrapedResult] = useState<{ article: ScrapedArticle; themeTitle: string } | null>(null);

  if (!isOpen) return null;

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setScrapedResult(null);

    try {
      const res = await fetch('/api/scrape/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to scrape article');
      }

      setScrapedResult({
        article: data.article,
        themeTitle: data.themeTitle
      });
      onArticleScraped(data.article, data.themeTitle);
    } catch (err: any) {
      setError(err.message || 'Error communicating with web scraper.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setError(null);
    setScrapedResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full max-w-xl bg-[#FBF9F5] dark:bg-[#151515] border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <span className="font-serif font-medium text-base text-stone-900 dark:text-stone-100">
              Scrape Market News URL
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
            Paste any live stock or financial news article URL (e.g. from CNBC, Bloomberg, Financial Times, MarketWatch, or Reuters). Axiom will fetch the HTML, extract key thesis statements, ticker symbols, and categorize it into today's daily themes with a verified linkout.
          </p>

          {!scrapedResult ? (
            <form onSubmit={handleScrape} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans mb-1.5">
                  Article URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.cnbc.com/... or https://finance.yahoo.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                />
              </div>

              {/* Quick sample URLs for convenience */}
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-sans flex items-center gap-2 flex-wrap">
                <span>Try sample:</span>
                <button
                  type="button"
                  onClick={() => setUrl('https://www.cnbc.com/2024/03/18/nvidia-gtc-2024-live-updates-blackwell-chip-ai.html')}
                  className="text-stone-700 dark:text-stone-300 hover:underline"
                >
                  CNBC Semiconductor
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setUrl('https://finance.yahoo.com/news/stock-market-news-today-sp500-nasdaq-earnings-oct-2026.html')}
                  className="text-stone-700 dark:text-stone-300 hover:underline"
                >
                  Yahoo Finance Wire
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded text-xs text-red-700 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-sans text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium font-sans text-white dark:text-stone-900 bg-stone-900 dark:bg-stone-100 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Scraping Article DOM...</span>
                    </>
                  ) : (
                    <>
                      <span>Scrape & Thematize</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-sans font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Successfully scraped and attached to "{scrapedResult.themeTitle}"</span>
              </div>

              <div className="p-4 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-900/60 space-y-2">
                <div className="text-[11px] font-sans text-stone-500 dark:text-stone-400">
                  {scrapedResult.article.source} · {scrapedResult.article.sourceDomain}
                </div>
                <h4 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100">
                  {scrapedResult.article.title}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3">
                  {scrapedResult.article.summary}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-500">
                    Tickers: {scrapedResult.article.tickers.join(', ')}
                  </span>
                  <a
                    href={scrapedResult.article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-stone-800 dark:text-stone-200 hover:underline"
                  >
                    <span>View original</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-1.5 text-xs font-sans text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-300 dark:border-stone-700 rounded"
                >
                  Scrape Another
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-medium font-sans text-white dark:text-stone-900 bg-stone-900 dark:bg-stone-100 rounded hover:bg-stone-800 dark:hover:bg-white"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
