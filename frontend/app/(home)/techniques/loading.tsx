import { Skeleton } from "@/components/ui/skeleton";

export default function TechniquesLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-8 w-96 mb-2" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="flex flex-wrap gap-2 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-16 rounded-full" />
                  ))}
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-5 w-5 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-full mb-2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <Skeleton className="h-12 w-12 rounded mx-auto mb-4" />
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
