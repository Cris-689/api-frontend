export default function LoadingGaleria() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-pulse">
      <div className="h-12 bg-[#13131a] border border-purple-900/30 rounded-xl w-64 mb-12"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="aspect-square bg-[#13131a] border border-purple-900/30 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}