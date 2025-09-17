import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-32 bg-gray-800" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-20 bg-gray-800" />
            <Skeleton className="h-10 w-20 bg-gray-800" />
          </div>
        </div>

        {/* Hero section skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4 bg-gray-800" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8 bg-gray-800" />
          <Skeleton className="h-12 w-40 mx-auto bg-gray-800" />
        </div>

        {/* Content cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900/50 rounded-lg p-6">
              <Skeleton className="h-6 w-3/4 mb-4 bg-gray-800" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-5/6 mb-4 bg-gray-800" />
              <Skeleton className="h-10 w-24 bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}