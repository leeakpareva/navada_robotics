import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchAllFeeds, paginateNews, type NewsItem } from '@/lib/rss';
import { NewsContent } from './NewsContent';

export const metadata: Metadata = {
  title: 'News • NAVADA',
  description: 'Latest news and updates in AI, Robotics, Raspberry Pi, and technology from leading sources.',
  canonical: '/news',
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
    const allItems = await fetchAllFeeds();
    return paginateNews(allItems, page, 10);
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
          <div className="mb-8">
            <div className="h-10 bg-gray-800 rounded mb-4 animate-pulse" />
            <div className="h-6 bg-gray-800 rounded w-1/2 animate-pulse" />
          </div>

          <div className="mb-6 flex gap-4">
            <div className="h-10 bg-gray-800 rounded flex-1 animate-pulse" />
            <div className="h-10 bg-gray-800 rounded w-32 animate-pulse" />
          </div>

          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border border-gray-800 rounded-lg p-6">
                <div className="h-6 bg-gray-800 rounded mb-3 animate-pulse" />
                <div className="h-4 bg-gray-800 rounded w-1/4 mb-3 animate-pulse" />
                <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
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
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Home</span>
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-2">News</h1>
            <p className="text-gray-400 text-lg">
              Latest in AI, Robotics & Pi
            </p>
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