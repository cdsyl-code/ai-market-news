import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  initializeSeedEditions,
  getAllEditionsSummary,
  getEditionByDate,
  fetchLiveRssArticles,
  processAndThematizeScrapedNews,
  scrapeArticleFromUrl,
  addScrapedArticleToActiveEdition,
  MONITORED_FEEDS
} from './server/marketNewsService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize mock and seed editions
initializeSeedEditions();

const app = express();
const port = 3000;

app.use(express.json());

// API: List of all editions
app.get('/api/editions', (req, res) => {
  try {
    const editions = getAllEditionsSummary();
    res.json({ success: true, editions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Specific edition by date (or 'latest')
app.get('/api/editions/:date', (req, res) => {
  try {
    const { date } = req.params;
    const edition = getEditionByDate(date);
    if (!edition) {
      return res.status(404).json({ success: false, error: `Edition for ${date} not found` });
    }
    res.json({ success: true, edition });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Trigger live scraping and thematic reorganization
app.post('/api/news/refresh', async (req, res) => {
  try {
    console.log('[Axiom Server] Initiating live web scraping across monitored feeds...');
    const liveArticles = await fetchLiveRssArticles();
    console.log(`[Axiom Server] Scraped ${liveArticles.length} live articles from financial wires.`);

    const updatedEdition = await processAndThematizeScrapedNews(liveArticles);
    res.json({
      success: true,
      message: `Successfully scraped ${liveArticles.length} articles across ${updatedEdition.sourcesScraped.length} sources and organized them into ${updatedEdition.themes.length} daily themes.`,
      edition: updatedEdition
    });
  } catch (error: any) {
    console.error('[Axiom Server] Scrape refresh error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Scrape arbitrary news article from URL and attach to active daily theme
app.post('/api/scrape/url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid URL is required.' });
    }

    const result = await addScrapedArticleToActiveEdition(url.trim());
    if (!result.success) {
      return res.status(422).json({ success: false, error: result.error });
    }

    res.json({
      success: true,
      article: result.article,
      themeTitle: result.themeTitle,
      message: `Article scraped and classified under theme: "${result.themeTitle}"`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Live feed status
app.get('/api/sources', (req, res) => {
  res.json({
    success: true,
    sources: MONITORED_FEEDS.map(f => ({
      name: f.name,
      domain: f.domain,
      category: f.category,
      status: 'Active'
    }))
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Axiom Market Themes] Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
