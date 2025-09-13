import staticNewsData from './static-news.json';

export interface NewsItem {
  title: string;
  link: string;
  isoDate: string;
  source: string;
  summary: string;
  author: string | null;
}

type Cache<T> = {
  data: T | null;
  ts: number;
  ttlMs: number;
};

// Simple in-memory cache with 30-minute TTL (increased for performance)
const cache: Cache<NewsItem[]> = {
  data: null,
  ts: 0,
  ttlMs: 30 * 60 * 1000
};

function getCached<T>(): T | null {
  return cache.data && Date.now() - cache.ts < cache.ttlMs ? cache.data as T : null;
}

function setCached<T>(data: T): void {
  cache.data = data;
  cache.ts = Date.now();
}

// ALL RSS feeds disabled to fix loading issues
const PRIORITY_FEEDS: string[] = [];

// Additional feeds (all disabled)
const SECONDARY_FEEDS: string[] = [];

// All RSS feeds removed due to performance issues causing app not to load
// Parser removed since we're using static data

/**
 * Extract source name from URL
 */
function getSourceFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    // No active feeds - all disabled
    return hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

/**
 * Truncate summary text to specified length
 */
function truncateSummary(text: string, maxLength: number = 200): string {
  if (!text) return '';
  const cleaned = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return cleaned.length > maxLength
    ? cleaned.substring(0, maxLength) + '...'
    : cleaned;
}

// fetchFeed function removed - using static data instead

/**
 * Initialize cache with sample data to prevent empty state
 */
function initializeCacheIfEmpty() {
  const cached = getCached<NewsItem[]>();
  if (!cached) {
    // Initialize with static news data
    const newsItems: NewsItem[] = staticNewsData.map(item => ({
      title: item.title,
      link: item.link,
      isoDate: item.isoDate,
      source: item.source,
      summary: item.summary,
      author: item.author
    }));
    setCached(newsItems);
  }
}

// Initialize on module load
initializeCacheIfEmpty();

/**
 * Fetch and aggregate all RSS feeds with caching
 */
export async function fetchAllFeeds(): Promise<NewsItem[]> {
  // Check cache first
  const cached = getCached<NewsItem[]>();
  if (cached && cached.length > 1) {
    return cached;
  }

  // Load static news data
  const newsItems: NewsItem[] = staticNewsData.map(item => ({
    title: item.title,
    link: item.link,
    isoDate: item.isoDate,
    source: item.source,
    summary: item.summary,
    author: item.author
  }));

  // Sort by date (newest first)
  const sortedItems = newsItems.sort((a, b) =>
    new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
  );

  // Cache the results
  setCached(sortedItems);

  return sortedItems;
}

/**
 * Get paginated news items
 */
export function paginateNews(
  items: NewsItem[],
  page: number = 1,
  itemsPerPage: number = 10
): { items: NewsItem[]; totalPages: number; currentPage: number } {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalPages: Math.ceil(items.length / itemsPerPage),
    currentPage: page
  };
}

// fetchSecondaryFeeds function removed - using static data instead