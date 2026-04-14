import { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';

export function ensureCloudinaryConfigured(): boolean {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloud_name || !api_key || !api_secret) {
    return false;
  }
  cloudinary.config({ cloud_name, api_key, api_secret });
  return true;
}

/**
 * Upload binary via multipart stream. Avoids base64 data URIs, which inflate size
 * and often fail for larger images/videos against Cloudinary or request limits.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  resourceType: 'image' | 'video'
): Promise<{ secure_url?: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'enny-estate',
        resource_type: resourceType,
        unique_filename: true,
        use_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result as { secure_url?: string });
      }
    );
    uploadStream.on('error', reject);
    Readable.from(buffer).pipe(uploadStream);
  });
}

export { cloudinary };
