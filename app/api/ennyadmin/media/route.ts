import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { ensureCloudinaryConfigured, uploadBufferToCloudinary } from '@/lib/cloudinary-server';
import type { AdminMediaUrlPayload, ApiResponse } from '@/types';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const ALLOWED_IMAGE_MIME = new Set(['image/jpeg']);
const ALLOWED_VIDEO_MIME = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
]);

function json(body: ApiResponse<AdminMediaUrlPayload>, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequestAuthenticated(request)) {
      return json({ success: false, error: 'Unauthorized' }, 401);
    }

    if (!ensureCloudinaryConfigured()) {
      return json(
        {
          success: false,
          error:
            'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the server.',
        },
        500
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error('POST /api/ennyadmin/media: formData parse failed:', error);
      return json(
        {
          success: false,
          error:
            'Could not read the upload. If the file is large, try a smaller image or video (max 5 MB image, 50 MB video).',
        },
        400
      );
    }

    const kindRaw = formData.get('kind');
    const kind = kindRaw === 'video' ? 'video' : 'image';
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return json({ success: false, error: 'A non-empty file is required' }, 400);
    }

    const maxBytes = kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      return json(
        {
          success: false,
          error:
            kind === 'video'
              ? 'Video must be 50 MB or smaller'
              : 'Image must be 5 MB or smaller',
        },
        400
      );
    }

    const mime = file.type.toLowerCase();
    const nameLower = file.name.toLowerCase();
    if (kind === 'image') {
      const imageOk =
        ALLOWED_IMAGE_MIME.has(mime) ||
        (!mime &&
          (nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg')));
      if (!imageOk) {
        return json({ success: false, error: 'Only JPEG images are allowed' }, 400);
      }
    } else {
      const videoOk =
        ALLOWED_VIDEO_MIME.has(mime) ||
        (!mime &&
          ['.mp4', '.webm', '.mov', '.avi'].some((ext) => nameLower.endsWith(ext)));
      if (!videoOk) {
        return json(
          { success: false, error: 'Only MP4, WebM, MOV, or AVI videos are allowed' },
          400
        );
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resourceType: 'image' | 'video' = kind === 'video' ? 'video' : 'image';

    try {
      const uploaded = await uploadBufferToCloudinary(buffer, resourceType);

      const url = uploaded.secure_url;
      if (!url) {
        return json({ success: false, error: 'Upload failed' }, 500);
      }

      return json({ success: true, data: { url } }, 200);
    } catch (error) {
      console.error('POST /api/ennyadmin/media: Cloudinary upload error:', error);
      return json({ success: false, error: 'Upload failed' }, 500);
    }
  } catch (error) {
    console.error('POST /api/ennyadmin/media:', error);
    return json({ success: false, error: 'Upload failed' }, 500);
  }
}
