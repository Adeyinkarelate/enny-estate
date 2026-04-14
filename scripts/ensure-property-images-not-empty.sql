-- Optional Neon migration: enforce at least one image per property after backfilling legacy rows.
-- Run manually in the Neon SQL editor when ready.

UPDATE properties
SET images = ARRAY[
  'https://placehold.co/600x400/e2e8f0/1e3c2c?text=Property+Image'
]::text[]
WHERE images IS NULL
   OR cardinality(images) < 1
   OR (images = '{}');

-- PostgreSQL: cardinality of empty array is 0
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_images_min_one;

ALTER TABLE properties
  ADD CONSTRAINT properties_images_min_one
  CHECK (cardinality(images) >= 1);
