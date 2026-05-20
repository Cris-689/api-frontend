export default function GaleriaLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded-md" />
          <div className="h-4 w-64 bg-gray-200 rounded-md" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 shadow-sm animate-pulse">
            <div className="aspect-square w-full bg-gray-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-3 bg-gray-100 rounded w-full pt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}