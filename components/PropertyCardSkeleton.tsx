import type { ReactElement } from 'react';

export default function PropertyCardSkeleton(): ReactElement {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-16 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
