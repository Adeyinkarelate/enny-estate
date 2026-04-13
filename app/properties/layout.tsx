import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Properties | Enny Estate',
  description:
    'Browse every listing—houses, apartments, and land—with search, sort, and category filters.',
};

export default function PropertiesLayout({ children }: { children: ReactNode }) {
  return children;
}
