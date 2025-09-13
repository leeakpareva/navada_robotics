import Parser from 'rss-parser';

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

// Simple in-memory cache with 15-minute TTL
const cache: Cache<NewsItem[]> = {
  data: null,
  ts: 0,
  ttlMs: 15 * 60 * 1000
};

function getCached<T>(): T | null {
  return cache.data && Date.now() - cache.ts < cache.ttlMs ? cache.data as T : null;
}

function setCached<T>(data: T): void {
  cache.data = data;
  cache.ts = Date.now();
}

// RSS feed sources
const FEEDS = [
  'https://www.raspberrypi.com/feed/',
  'https://spectrum.ieee.org/robotics/rss',
  'https://hackster.io/rss.xml',
  'https://openai.com/blog/rss/',
  'https://developer.nvidia.com/blog/category/ai/feed/',
  'https://export.arxiv.org/rss/cs.AI'
];

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'NAVADA Robotics News Aggregator/1.0'
  }
});

/**
 * Extract source name from URL
 */
function getSourceFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes('raspberrypi')) return 'Raspberry Pi';
    if (hostname.includes('spectrum.ieee')) return 'IEEE Spectrum';
    if (hostname.includes('hackster')) return 'Hackster.io';
    if (hostname.includes('openai')) return 'OpenAI';
    if (hostname.includes('nvidia')) return 'NVIDIA';
    if (hostname.includes('arxiv')) return 'arXiv';
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

/**
 * Fetch and parse a single RSS feed
 */
async function fetchFeed(feedUrl: string): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    const source = getSourceFromUrl(feedUrl);

    return feed.items.map(item => ({
      title: item.title || 'Untitled',
      link: item.link || '#',
      isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
      source,
      summary: truncateSummary(item.summary || item.contentSnippet || item.content || ''),
      author: item.creator || item['dc:creator'] || item.author || null
    }));
  } catch (error) {
    console.error(`Failed to fetch feed ${feedUrl}:`, error);
    return [];
  }
}

/**
 * Fetch and aggregate all RSS feeds with caching
 */
export async function fetchAllFeeds(): Promise<NewsItem[]> {
  // Check cache first
  const cached = getCached<NewsItem[]>();
  if (cached) {
    return cached;
  }

  try {
    // Fetch all feeds in parallel
    const feedPromises = FEEDS.map(feedUrl => fetchFeed(feedUrl));
    const feedResults = await Promise.allSettled(feedPromises);

    // Combine all successful feeds
    const allItems: NewsItem[] = [];
    feedResults.forEach(result => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    });

    // Remove duplicates by link and sort by date
    const uniqueItems = Array.from(
      new Map(allItems.map(item => [item.link, item])).values()
    );

    const sortedItems = uniqueItems
      .sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime())
      .slice(0, 50); // Keep latest 50 items

    // Cache the results
    setCached(sortedItems);

    return sortedItems;
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return [];
  }
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