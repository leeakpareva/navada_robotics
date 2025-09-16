import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchAllFeeds, paginateNews, type NewsItem } from '@/lib/rss';
import { NewsContent } from './NewsContent';

export const metadata: Metadata = {
  title: 'News • NAVADA',
  description: 'Latest news and updates in AI, Robotics, Raspberry Pi, and technology from leading sources.',
  openGraph: {
    title: 'News • NAVADA',
    description: 'Latest news and updates in AI, Robotics, Raspberry Pi, and technology from leading sources.',
    url: '/news',
    type: 'website'
  }
};

interface NewsPageProps {
  searchParams: {
    page?: string;
  };
}

async function getNewsData(page: number = 1) {
  try {
    // Try to get cached data first for fast response
    const cachedItems = await Promise.race([
      fetchAllFeeds(),
      new Promise<NewsItem[]>((resolve) => {
        // Return empty array after 2 seconds to prevent hanging
        setTimeout(() => resolve([]), 2000);
      })
    ]);

    return paginateNews(cachedItems, page, 10);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return {
      items: [] as NewsItem[],
      totalPages: 0,
      currentPage: 1
    };
  }
}

function NewsLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-12 text-center">
            <div className="h-14 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg mb-6" />
            <div className="h-6 bg-gray-800 rounded w-3/4 mx-auto mb-6" />
            <div className="flex justify-center gap-3 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-24 bg-gray-800 rounded-full" />
              ))}
            </div>
          </div>

          {/* Controls Skeleton */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <div className="h-12 bg-gray-800/50 rounded-xl flex-1" />
              <div className="h-12 w-40 bg-gray-800/50 rounded-xl" />
            </div>
            <div className="h-16 bg-gray-900/40 rounded-lg" />
          </div>

          {/* Articles Skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
                <div className="flex gap-3 mb-4">
                  <div className="h-6 w-24 bg-gray-800 rounded-full" />
                  <div className="h-6 w-20 bg-gray-800 rounded" />
                </div>
                <div className="h-8 bg-gray-800 rounded mb-3" />
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-800 rounded" />
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-800/50">
                  <div className="h-4 w-24 bg-gray-800 rounded" />
                  <div className="h-10 w-32 bg-gray-800 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const page = Number(searchParams.page) || 1;
  const newsData = await getNewsData(page);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tech News Hub
              </h1>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-6">
                Stay updated with the latest breakthroughs in AI, Robotics, Machine Learning, and cutting-edge technology from leading sources worldwide
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">🤖 AI Research</span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">🔬 Robotics</span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">⚡ Tech News</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">📊 Data Science</span>
              </div>
            </div>
          </header>

          <Suspense fallback={<NewsLoading />}>
            <NewsContent
              initialData={newsData}
              currentPage={page}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}