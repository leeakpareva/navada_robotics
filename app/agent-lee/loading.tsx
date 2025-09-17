import { Skeleton } from "@/components/ui/skeleton"

export default function AgentLeeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32 bg-gray-800" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 bg-gray-800" />
            <Skeleton className="h-8 w-16 bg-gray-800" />
            <Skeleton className="h-8 w-16 bg-gray-800" />
            <Skeleton className="h-8 w-16 bg-gray-800" />
          </div>
        </div>

        {/* Chat container skeleton */}
        <div className="bg-gray-900/50 rounded-lg p-6 mb-4 h-[500px]">
          <div className="space-y-4">
            {/* Agent message skeleton */}
            <div className="flex items-start space-x-3">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-5/6 mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-1/2 bg-gray-800" />
              </div>
            </div>

            {/* User message skeleton */}
            <div className="flex justify-end">
              <div className="max-w-[80%]">
                <Skeleton className="h-4 w-48 mb-2 bg-blue-800" />
                <Skeleton className="h-4 w-32 bg-blue-800" />
              </div>
            </div>

            {/* Agent response skeleton */}
            <div className="flex items-start space-x-3">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
              <div className="flex-1">
                <Skeleton className="h-4 w-4/5 mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-3/4 mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-2/3 bg-gray-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Input area skeleton */}
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-12 bg-gray-800" />
          <Skeleton className="h-12 w-12 bg-gray-800" />
          <Skeleton className="h-12 w-12 bg-gray-800" />
        </div>
      </div>
    </div>
  )
}