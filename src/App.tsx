import React, { useState, useEffect } from 'react';
import { DailyEdition, ScrapedArticle } from './types/market';
import { EditionHeader } from './components/EditionHeader';
import { CoreThemesGrid } from './components/CoreThemesGrid';
import { ThemeSection } from './components/ThemeSection';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { ScrapeUrlModal } from './components/ScrapeUrlModal';
import { SavedStoriesDrawer } from './components/SavedStoriesDrawer';
import { TickerIndexModal } from './components/TickerIndexModal';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function App() {
  const [edition, setEdition] = useState<DailyEdition | null>(null);
  const [availableDates, setAvailableDates] = useState<Array<{ date: string; formattedDate: string; editionNumber: number }>>([]);
  const [currentDate, setCurrentDate] = useState<string>('latest');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User reading preferences
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('axiom_dark_mode') === 'true';
  });
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTickerFilter, setActiveTickerFilter] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<'edition' | 'themes' | 'tickers' | 'saved'>('edition');

  // Selected Theme state - null means ONLY core theme grids are shown!
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  // Modals & drawers
  const [selectedArticleForDetail, setSelectedArticleForDetail] = useState<ScrapedArticle | null>(null);
  const [isScrapeModalOpen, setIsScrapeModalOpen] = useState<boolean>(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [isTickerIndexModalOpen, setIsTickerIndexModalOpen] = useState<boolean>(false);

  // Saved bookmarks
  const [savedArticles, setSavedArticles] = useState<ScrapedArticle[]>(() => {
    try {
      const stored = localStorage.getItem('axiom_saved_articles');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('axiom_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('axiom_dark_mode', 'false');
    }
  }, [darkMode]);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('axiom_saved_articles', JSON.stringify(savedArticles));
  }, [savedArticles]);

  // Fetch editions list on mount
  useEffect(() => {
    const loadEditionsList = async () => {
      try {
        const res = await fetch('/api/editions');
        const data = await res.json();
        if (data.success && data.editions) {
          setAvailableDates(data.editions.map((e: any) => ({
            date: e.date,
            formattedDate: e.formattedDate,
            editionNumber: e.editionNumber
          })));
        }
      } catch (err) {
        console.error('Failed to load editions list:', err);
      }
    };
    loadEditionsList();
  }, []);

  // Fetch edition data when date changes
  useEffect(() => {
    const fetchEdition = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setSelectedThemeId(null); // Reset selection on date change
      try {
        const res = await fetch(`/api/editions/${currentDate}`);
        const data = await res.json();
        if (data.success && data.edition) {
          setEdition(data.edition);
        } else {
          setErrorMessage(data.error || 'Failed to retrieve daily edition.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error connecting to market news server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEdition();
  }, [currentDate]);

  // Handle live wire scrape refresh
  const handleRefreshScraper = async () => {
    setIsRefreshing(true);
    setToastMessage('Scraping financial news wires and analyzing themes...');
    try {
      const res = await fetch('/api/news/refresh', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.edition) {
        setEdition(data.edition);
        setToastMessage(data.message || 'Market wires refreshed and synthesized.');
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        throw new Error(data.error || 'Scrape refresh failed.');
      }
    } catch (err: any) {
      setErrorMessage(`Refresh failed: ${err.message}`);
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle story bookmark
  const handleToggleSave = (article: ScrapedArticle) => {
    setSavedArticles(prev => {
      const exists = prev.some(a => a.id === article.id);
      if (exists) {
        return prev.filter(a => a.id !== article.id);
      } else {
        return [article, ...prev];
      }
    });
  };

  const handleArticleScraped = (article: ScrapedArticle, themeTitle: string) => {
    setToastMessage(`Article scraped & filed under: "${themeTitle}"`);
    setTimeout(() => setToastMessage(null), 4000);
    if (edition) {
      const updatedThemes = edition.themes.map(t => {
        if (t.title === themeTitle) {
          return {
            ...t,
            stories: [article, ...t.stories]
          };
        }
        return t;
      });
      setEdition({
        ...edition,
        themes: updatedThemes,
        totalArticlesScraped: edition.totalArticlesScraped + 1
      });
      // Automatically select this theme so the user sees the newly scraped article
      const targetTheme = edition.themes.find(t => t.title === themeTitle);
      if (targetTheme) {
        setSelectedThemeId(targetTheme.id);
      }
    }
  };

  const savedArticleIds = new Set(savedArticles.map(a => a.id));

  // Filter themes based on search query or active ticker
  const filteredThemes = edition?.themes.filter(theme => {
    if (activeTickerFilter) {
      const hasTickerInTheme = theme.affectedTickers.some(t => t.symbol === activeTickerFilter);
      const hasTickerInStories = theme.stories.some(s => s.tickers.includes(activeTickerFilter));
      if (!hasTickerInTheme && !hasTickerInStories) return false;
    }

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const inTitle = theme.title.toLowerCase().includes(query);
    const inSubtitle = theme.subtitle.toLowerCase().includes(query);
    const inSummary = theme.executiveSummary.toLowerCase().includes(query);
    const inCategory = theme.category.toLowerCase().includes(query);
    const inTickers = theme.affectedTickers.some(t => t.symbol.toLowerCase().includes(query) || t.name.toLowerCase().includes(query));
    const inStories = theme.stories.some(s => s.title.toLowerCase().includes(query) || s.summary.toLowerCase().includes(query));

    return inTitle || inSubtitle || inSummary || inCategory || inTickers || inStories;
  }) || [];

  // Toggle or select theme from the grid
  const handleToggleThemeSelect = (themeId: string) => {
    if (selectedThemeId === themeId) {
      setSelectedThemeId(null);
    } else {
      setSelectedThemeId(themeId);
      setTimeout(() => {
        const el = document.getElementById('theme-details-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  const handlePrevTheme = () => {
    if (!selectedThemeId || filteredThemes.length === 0) return;
    const currentIndex = filteredThemes.findIndex(t => t.id === selectedThemeId);
    const prevIndex = (currentIndex - 1 + filteredThemes.length) % filteredThemes.length;
    setSelectedThemeId(filteredThemes[prevIndex].id);
  };

  const handleNextTheme = () => {
    if (!selectedThemeId || filteredThemes.length === 0) return;
    const currentIndex = filteredThemes.findIndex(t => t.id === selectedThemeId);
    const nextIndex = (currentIndex + 1) % filteredThemes.length;
    setSelectedThemeId(filteredThemes[nextIndex].id);
  };

  const handleSelectNav = (nav: 'edition' | 'themes' | 'tickers' | 'saved') => {
    setActiveNav(nav);
    if (nav === 'edition') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (nav === 'themes') {
      const gridEl = document.getElementById('core-themes-grid');
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (nav === 'tickers') {
      setIsTickerIndexModalOpen(true);
    } else if (nav === 'saved') {
      setIsSavedDrawerOpen(true);
    }
  };

  // The active selected theme object (if any)
  const activeSelectedTheme = selectedThemeId
    ? filteredThemes.find(t => t.id === selectedThemeId) || edition?.themes.find(t => t.id === selectedThemeId)
    : null;

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#121212] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-150">

      {/* Global Toast / Notification Bar */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs font-sans rounded shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-red-900 text-red-100 text-xs font-sans rounded shadow-lg animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-300" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            <p className="font-serif italic text-stone-600 dark:text-stone-400 text-sm">
              Loading daily thematic market dispatch...
            </p>
          </div>
        ) : !edition ? (
          <div className="py-24 text-center space-y-4">
            <p className="text-stone-600 dark:text-stone-400 font-sans text-sm">
              Unable to locate the requested market edition.
            </p>
            <button
              onClick={() => setCurrentDate('latest')}
              className="px-4 py-2 text-xs font-sans font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded"
            >
              Load Latest Dispatch
            </button>
          </div>
        ) : (
          <>
            {/* Masthead Broadsheet Header */}
            <EditionHeader
              edition={edition}
              availableDates={availableDates}
              currentDate={currentDate}
              onSelectDate={(newDate) => setCurrentDate(newDate)}
              onRefreshScraper={handleRefreshScraper}
              isRefreshing={isRefreshing}
            />

            {/* Core Themes Grid Section */}
            <div id="core-themes-grid">
              {filteredThemes.length === 0 ? (
                <div className="py-16 text-center text-stone-500 dark:text-stone-400 font-sans text-xs space-y-2 border border-dashed border-stone-300 dark:border-stone-800 rounded">
                  <p>No themes available.</p>
                </div>
              ) : (
                <CoreThemesGrid
                  themes={filteredThemes}
                  selectedThemeId={selectedThemeId}
                  onSelectTheme={handleToggleThemeSelect}
                  activeTickerFilter={activeTickerFilter}
                />
              )}
            </div>

            {/* Additional Content of the Theme - ONLY shown upon clicking a core theme grid */}
            {activeSelectedTheme && (
              <div id="theme-details-container" className="border-t-2 border-stone-300 dark:border-stone-700 mt-2">
                <ThemeSection
                  theme={activeSelectedTheme}
                  savedArticleIds={savedArticleIds}
                  onToggleSave={handleToggleSave}
                  onOpenArticleDetail={(article) => setSelectedArticleForDetail(article)}
                  onSelectTicker={(ticker) => {
                    setActiveTickerFilter(ticker === activeTickerFilter ? null : ticker);
                  }}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  activeTickerFilter={activeTickerFilter}
                  onCloseTheme={() => setSelectedThemeId(null)}
                  onPrevTheme={filteredThemes.length > 1 ? handlePrevTheme : undefined}
                  onNextTheme={filteredThemes.length > 1 ? handleNextTheme : undefined}
                  themeIndex={filteredThemes.findIndex(t => t.id === activeSelectedTheme.id)}
                  totalThemes={filteredThemes.length}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals & Drawers */}
      <ArticleDetailModal
        article={selectedArticleForDetail}
        onClose={() => setSelectedArticleForDetail(null)}
        isSaved={selectedArticleForDetail ? savedArticleIds.has(selectedArticleForDetail.id) : false}
        onToggleSave={handleToggleSave}
        onSelectTicker={(ticker) => setActiveTickerFilter(ticker)}
        fontFamily={fontFamily}
      />

      <ScrapeUrlModal
        isOpen={isScrapeModalOpen}
        onClose={() => setIsScrapeModalOpen(false)}
        onArticleScraped={handleArticleScraped}
      />

      <SavedStoriesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedArticles={savedArticles}
        onRemoveSaved={(id) => setSavedArticles(prev => prev.filter(a => a.id !== id))}
        onOpenArticleDetail={(article) => {
          setSelectedArticleForDetail(article);
          setIsSavedDrawerOpen(false);
        }}
        onClearAll={() => setSavedArticles([])}
      />

      {edition && (
        <TickerIndexModal
          isOpen={isTickerIndexModalOpen}
          onClose={() => setIsTickerIndexModalOpen(false)}
          edition={edition}
          onSelectTicker={(ticker) => {
            setActiveTickerFilter(ticker);
            // If the filtered ticker belongs to a theme, automatically focus that theme
            const matchingTheme = edition.themes.find(t =>
              t.affectedTickers.some(at => at.symbol === ticker) ||
              t.stories.some(s => s.tickers.includes(ticker))
            );
            if (matchingTheme) {
              setSelectedThemeId(matchingTheme.id);
            }
          }}
        />
      )}

    </div>
  );
}
