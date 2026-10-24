export type MarketImpact = 'High' | 'Medium' | 'Low';
export type TickerDirection = 'bullish' | 'bearish' | 'volatile' | 'neutral';
export type StorySentiment = 'Bullish' | 'Bearish' | 'Neutral';

export interface TickerInfo {
  symbol: string;
  name: string;
  sector?: string;
  change?: string;
  direction: TickerDirection;
  impactReason: string;
}

export interface ScrapedArticle {
  id: string;
  title: string;
  source: string;
  sourceDomain: string;
  sourceUrl: string;
  publishedAt: string;
  author?: string;
  summary: string;
  keyQuotes?: string[];
  tickers: string[];
  sentiment: StorySentiment;
  readTime: string;
  scrapedAt: string;
}

export interface MarketTheme {
  id: string;
  themeNumber: string; // e.g. "01", "02"
  title: string;
  subtitle: string;
  marketImpact: MarketImpact;
  category: string;
  executiveSummary: string;
  keyTakeaways: string[];
  affectedTickers: TickerInfo[];
  stories: ScrapedArticle[];
}

export interface DailyEdition {
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "Tuesday, October 24, 2026"
  editionNumber: number;
  marketStatus: {
    nyse: 'OPEN' | 'CLOSED' | 'PRE-MARKET' | 'AFTER-HOURS';
    yield10Y: string;
    vix: string;
    sp500Change: string;
    nasdaqChange: string;
  };
  macroTakeaway: string;
  totalArticlesScraped: number;
  sourcesScraped: string[];
  themes: MarketTheme[];
  lastScrapedAt: string;
}

export interface ScrapeUrlResult {
  success: boolean;
  article?: ScrapedArticle;
  themeId?: string;
  themeTitle?: string;
  error?: string;
}
