'use client';

import PageHero from '@/components/ui/PageHero';
import type { PageHeroBannerProps } from '@/types';

export default function PageHeroBanner({
  eyebrow,
  title,
  subheading,
  titleId,
}: PageHeroBannerProps) {
  return (
    <PageHero badge={eyebrow} title={title} subtitle={subheading} titleId={titleId} />
  );
}
