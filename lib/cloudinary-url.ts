/**
 * Property media must be delivered from Cloudinary (HTTPS).
 * Neon stores only URL strings — never binary file data.
 */
export function isEmptyOrCloudinaryHttpsUrl(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed === '') {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return false;
    }
    if (parsed.hostname !== 'res.cloudinary.com') {
      return false;
    }
    return parsed.pathname.includes('/upload/');
  } catch {
    return false;
  }
}
