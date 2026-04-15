/**
 * Derive listing image and video URLs from DB arrays.
 * Cloudinary video URLs use `/{cloud_name}/video/upload/...` (resource type segment).
 * If a video was saved under `images`, we still surface it as `video_url` and pick a real image or poster.
 *
 * Do not use a plain substring match for `/video/upload/` — image public_ids or folders can contain
 * that sequence (e.g. .../land/video/upload/photo.jpg under `/image/upload/`), which would wrongly
 * skip the real listing image.
 */

function getCloudinaryResourceType(url: string): 'image' | 'video' | null {
  try {
    const u = new URL(url.trim());
    if (u.hostname.toLowerCase() !== 'res.cloudinary.com') {
      return null;
    }
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length < 3) {
      return null;
    }
    const resource = parts[1]?.toLowerCase() ?? '';
    if (resource !== 'image' && resource !== 'video') {
      return null;
    }
    if (parts[2]?.toLowerCase() !== 'upload') {
      return null;
    }
    return resource;
  } catch {
    return null;
  }
}

export function isCloudinaryVideoUrl(url: string): boolean {
  return getCloudinaryResourceType(url) === 'video';
}

/**
 * Prefer MP4 delivery in the browser (MOV/AVI may not play in HTML5 video everywhere).
 */
export function cloudinaryHtml5VideoUrl(videoUrl: string): string {
  const trimmed = videoUrl.trim();
  if (!trimmed || !isCloudinaryVideoUrl(trimmed)) {
    return trimmed;
  }
  if (trimmed.includes('f_mp4')) {
    return trimmed;
  }
  return trimmed.replace('/video/upload/', '/video/upload/f_mp4,q_auto/');
}

/**
 * Single-frame poster JPG from a Cloudinary video URL (seek to 0s).
 */
export function cloudinaryVideoPosterFromUrl(videoUrl: string): string | null {
  const trimmed = videoUrl.trim();
  if (!trimmed || !isCloudinaryVideoUrl(trimmed)) {
    return null;
  }
  const withSeek = trimmed.replace('/video/upload/', '/video/upload/so_0/');
  const withoutQuery = withSeek.split('?')[0] ?? withSeek;
  const asJpg = withoutQuery.replace(/\.(mp4|webm|mov|avi)$/i, '.jpg');
  return asJpg === withoutQuery ? null : asJpg;
}

export function derivePropertyMediaUrls(row: {
  images: string[] | null | undefined;
  videos: string[] | null | undefined;
}): { image_url: string; video_url: string } {
  const images = Array.isArray(row.images) ? row.images : [];
  const videos = Array.isArray(row.videos) ? row.videos : [];

  const firstNonEmpty = (arr: string[]): string => {
    for (const item of arr) {
      if (typeof item !== 'string') continue;
      const t = item.trim();
      if (t.length > 0) return t;
    }
    return '';
  };

  const videoFromVideos = firstNonEmpty(videos);

  let videoFromImages = '';
  for (const item of images) {
    if (typeof item !== 'string') continue;
    const t = item.trim();
    if (t && isCloudinaryVideoUrl(t)) {
      videoFromImages = t;
      break;
    }
  }

  const video_url = videoFromVideos || videoFromImages;

  let image_url = '';
  for (const item of images) {
    if (typeof item !== 'string') continue;
    const t = item.trim();
    if (t && !isCloudinaryVideoUrl(t)) {
      image_url = t;
      break;
    }
  }

  if (!image_url && video_url) {
    image_url = cloudinaryVideoPosterFromUrl(video_url) ?? '';
  }

  return { image_url, video_url };
}
