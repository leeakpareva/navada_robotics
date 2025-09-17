import { Skeleton } from "@/components/ui/skeleton"

export default function LearningLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-4 bg-gray-800" />
          <Skeleton className="h-6 w-96 bg-gray-800" />
        </div>

        {/* Filter tabs skeleton */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 bg-gray-800" />
          ))}
        </div>

        {/* Course grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-900/50 rounded-lg p-6">
              <Skeleton className="h-6 w-3/4 mb-4 bg-gray-800" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-5/6 mb-4 bg-gray-800" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16 bg-gray-800" />
                <Skeleton className="h-8 w-20 bg-gray-800" />
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA skeleton */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8">
          <Skeleton className="h-8 w-48 mb-4 bg-gray-800" />
          <Skeleton className="h-6 w-96 mb-6 bg-gray-800" />
          <Skeleton className="h-12 w-32 bg-gray-800" />
        </div>
      </div>
    </div>
  )
}