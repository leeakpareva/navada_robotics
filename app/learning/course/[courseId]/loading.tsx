import { Skeleton } from "@/components/ui/skeleton"

export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Course header skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-96 mb-4 bg-gray-800" />
          <Skeleton className="h-6 w-full mb-2 bg-gray-800" />
          <Skeleton className="h-6 w-3/4 bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2">
            {/* Video/lesson content skeleton */}
            <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
              <Skeleton className="aspect-video w-full mb-4 bg-gray-800" />
              <Skeleton className="h-8 w-3/4 mb-4 bg-gray-800" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-5/6 mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-4/5 bg-gray-800" />
            </div>

            {/* Lesson navigation skeleton */}
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 bg-gray-800" />
              <Skeleton className="h-12 w-32 bg-gray-800" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {/* Progress skeleton */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <Skeleton className="h-6 w-24 mb-4 bg-gray-800" />
              <Skeleton className="h-2 w-full mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-16 bg-gray-800" />
            </div>

            {/* Lessons list skeleton */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <Skeleton className="h-6 w-32 mb-4 bg-gray-800" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 bg-gray-800" />
                    <Skeleton className="h-4 flex-1 bg-gray-800" />
                    <Skeleton className="h-4 w-8 bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>

            {/* Notes skeleton */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <Skeleton className="h-6 w-24 mb-4 bg-gray-800" />
              <Skeleton className="h-32 w-full bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}