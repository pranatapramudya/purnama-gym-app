export default function AdminLoading() {
  return (
    <div className="w-full h-full p-6 flex flex-col gap-4 animate-pulse">
      {/* Skeleton Header */}
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      
      {/* Skeleton Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Skeleton Table/Content */}
      <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
    </div>
  );
}
