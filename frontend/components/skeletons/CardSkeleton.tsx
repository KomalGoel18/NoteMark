export default function CardSkeleton() {
  return (
    <div className="bg-[#1a2332] border border-[#2d3748] rounded-lg p-5 space-y-3 animate-pulse">
      <div className="h-4 w-2/3 bg-gray-700 rounded" />
      <div className="h-3 w-full bg-gray-700 rounded" />
      <div className="h-3 w-5/6 bg-gray-700 rounded" />

      <div className="flex gap-2 pt-2">
        <div className="h-5 w-12 bg-gray-700 rounded" />
        <div className="h-5 w-12 bg-gray-700 rounded" />
      </div>
    </div>
  );
}
