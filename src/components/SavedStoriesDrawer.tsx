import React from 'react';
import { ScrapedArticle } from '../types/market';
import { X, ExternalLink, Trash2, Download, Bookmark } from 'lucide-react';

interface SavedStoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: ScrapedArticle[];
  onRemoveSaved: (id: string) => void;
  onOpenArticleDetail: (article: ScrapedArticle) => void;
  onClearAll: () => void;
}

export const SavedStoriesDrawer: React.FC<SavedStoriesDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onRemoveSaved,
  onOpenArticleDetail,
  onClearAll
}) => {
  if (!isOpen) return null;

  const handleExport = () => {
    const content = `# Axiom Market Themes - Saved Reading List\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
      savedArticles.map((a, i) => (
        `### ${i + 1}. ${a.title}\n` +
        `Source: ${a.source} (${a.sourceDomain})\n` +
        `Link: ${a.sourceUrl}\n` +
        `Tickers: ${a.tickers.join(', ')}\n\n` +
        `${a.summary}\n\n` +
        (a.keyQuotes && a.keyQuotes.length > 0 ? `> "${a.keyQuotes[0]}"\n\n` : '') +
        `---\n`
      )).join('\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axiom-saved-market-stories-${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full max-w-md h-full bg-[#FBF9F5] dark:bg-[#151515] border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span className="font-serif font-medium text-base text-stone-900 dark:text-stone-100">
              Saved Market Stories ({savedArticles.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="text-center py-16 text-stone-500 dark:text-stone-400 text-xs font-sans space-y-2">
              <Bookmark className="w-6 h-6 mx-auto text-stone-300 dark:text-stone-700 stroke-1" />
              <p>No saved stories yet.</p>
              <p className="text-stone-400">Click the bookmark icon on any scraped wire story to save it here for offline reading or export.</p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="p-4 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-900/50 space-y-2 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] font-sans text-stone-500 dark:text-stone-400">
                  <span>{article.source} · {article.sourceDomain}</span>
                  <button
                    onClick={() => onRemoveSaved(article.id)}
                    title="Remove from saved"
                    className="text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 
                  onClick={() => onOpenArticleDetail(article)}
                  className="font-serif text-sm font-medium text-stone-900 dark:text-stone-100 cursor-pointer hover:underline"
                >
                  {article.title}
                </h4>

                <p className="text-xs font-sans text-stone-600 dark:text-stone-300 line-clamp-2">
                  {article.summary}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-sans border-t border-stone-100 dark:border-stone-800/60">
                  <span className="font-mono text-[11px] text-stone-500">
                    ${article.tickers.join(', $')}
                  </span>
                  
                  {/* Readily Available Linkout */}
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-800 dark:text-stone-200 hover:underline"
                  >
                    <span>Source ↗</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {savedArticles.length > 0 && (
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between text-xs font-sans">
            <button
              onClick={onClearAll}
              className="text-stone-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white dark:text-stone-900 bg-stone-900 dark:bg-stone-100 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
