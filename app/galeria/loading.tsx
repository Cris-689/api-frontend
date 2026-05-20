export default function LoadingGaleria() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-48 mb-8"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}