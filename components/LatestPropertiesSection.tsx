import Link from 'next/link';
import PropertyGrid from '@/components/PropertyGrid';
import { getLatestProperties } from '@/lib/properties-queries';

export default async function LatestPropertiesSection() {
  let properties;
  try {
    properties = await getLatestProperties(6);
  } catch {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/80 px-6 py-12 text-center">
        <p className="mb-4 text-lg font-medium text-red-800">
          We couldn&apos;t load the latest listings right now.
        </p>
        <p className="mb-6 text-sm text-red-700/90">
          Please try again shortly or browse all properties.
        </p>
        <Link
          href="/properties"
          className="inline-flex rounded-full bg-[#1e3c2c] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#2d5a3f]"
        >
          View All Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PropertyGrid properties={properties} showFilters={false} />
      <div className="mt-12 flex justify-center">
        <Link
          href="/properties"
          className="inline-flex items-center justify-center rounded-full border-2 border-[#1e3c2c] bg-transparent px-8 py-3 font-semibold text-[#1e3c2c] transition-all duration-300 hover:bg-[#1e3c2c] hover:text-white hover:scale-[1.02]"
        >
          View All Properties
        </Link>
      </div>
    </div>
  );
}
