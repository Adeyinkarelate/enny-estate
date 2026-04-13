export default function PropertiesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-96 animate-pulse rounded-2xl bg-gray-200"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
