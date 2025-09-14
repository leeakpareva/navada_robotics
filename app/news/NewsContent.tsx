'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ExternalLink, Calendar, User, Filter } from 'lucide-react';
import { formatRelativeDate } from '@/lib/date';
import type { NewsItem } from '@/lib/rss';

interface NewsContentProps {
  initialData: {
    items: NewsItem[];
    totalPages: number;
    currentPage: number;
  };
  currentPage: number;
}

interface SourceBadgeProps {
  source: string;
}

function SourceBadge({ source }: SourceBadgeProps) {
  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'raspberry pi':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'ieee spectrum':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'hackster.io':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'openai':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'nvidia':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'arxiv':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getSourceColor(source)}`}>
      {source}
    </span>
  );
}

export function NewsContent({ initialData, currentPage }: NewsContentProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Get unique sources for filter dropdown
  const sources = useMemo(() => {
    const uniqueSources = Array.from(new Set(initialData.items.map(item => item.source)));
    return ['all', ...uniqueSources.sort()];
  }, [initialData.items]);

  // Client-side filtering for search and source
  const filteredItems = useMemo(() => {
    let filtered = initialData.items;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by source
    if (selectedSource !== 'all') {
      filtered = filtered.filter(item => item.source === selectedSource);
    }

    return filtered;
  }, [initialData.items, searchQuery, selectedSource]);

  // Paginate filtered results (client-side)
  const itemsPerPage = 10;
  const displayedItems = filteredItems.slice(0, itemsPerPage * currentPage);
  const hasMore = filteredItems.length > displayedItems.length;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      const nextPage = Math.floor(displayedItems.length / itemsPerPage) + 1;
      router.push(`/news?page=${nextPage}`, { scroll: false });
      setIsLoading(false);
    }, 300);
  }, [displayedItems.length, router]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSourceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSource(e.target.value);
  }, []);

  if (initialData.items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-6">
          <div className="relative">
            <Search className="w-20 h-20 mx-auto mb-6 opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-200">News Feed Unavailable</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          We&apos;re having trouble fetching the latest news from our sources. Our team is working to resolve this issue.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            aria-label="Search news articles"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={selectedSource}
            onChange={handleSourceChange}
            className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none cursor-pointer min-w-[120px]"
            aria-label="Filter by news source"
          >
            {sources.map(source => (
              <option key={source} value={source}>
                {source === 'all' ? 'All Sources' : source}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          {searchQuery || selectedSource !== 'all'
            ? `${filteredItems.length} results found`
            : `Showing ${displayedItems.length} of ${initialData.items.length} articles`
          }
        </p>
        {currentPage > 1 && (
          <p className="text-gray-400 text-sm">
            Page {currentPage} of {initialData.totalPages}
          </p>
        )}
      </div>

      {/* News Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-gray-400">
            Try adjusting your search terms or filter settings.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedItems.map((item, index) => (
            <article
              key={`${item.link}-${index}`}
              className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors group"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold leading-tight group-hover:text-blue-400 transition-colors">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                  >
                    {item.title}
                  </a>
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <SourceBadge source={item.source} />

                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={item.isoDate}>
                      {formatRelativeDate(item.isoDate)}
                    </time>
                  </div>

                  {item.author && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{item.author}</span>
                    </div>
                  )}
                </div>

                {item.summary && (
                  <p className="text-gray-300 leading-relaxed">
                    {item.summary}
                  </p>
                )}

                <div className="flex justify-end">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                    aria-label={`Read full article: ${item.title}`}
                  >
                    Read more
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Load More / Pagination */}
      {hasMore && (searchQuery === '' && selectedSource === 'all') && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            {isLoading ? 'Loading...' : 'Load More Articles'}
          </button>
        </div>
      )}
    </>
  );
}