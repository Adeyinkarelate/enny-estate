import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { ensureCloudinaryConfigured } from '@/lib/cloudinary-server';

function json(
  body: { success: true; secure_url: string; public_id: string } | { success: false; error: string },
  status: number
) {
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
      console.error('POST /api/admin/upload: formData parse failed:', error);
      return json(
        {
          success: false,
          error:
            'Could not read the upload. If the file is large, try a smaller image or video (max 5 MB image, 50 MB video).',
        },
        400
      );
    }

    const file = formData.get('file');
    const typeRaw = formData.get('type');
    const type = typeRaw === 'video' ? 'video' : 'image';

    if (!(file instanceof File) || file.size === 0) {
      return json({ success: false, error: 'No file provided' }, 400);
    }

    const maxSizeMB = type === 'video' ? 50 : 5;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return json({ success: false, error: `File too large. Max size: ${maxSizeMB}MB` }, 400);
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const allowedTypes = type === 'video' ? allowedVideoTypes : allowedImageTypes;

    if (!allowedTypes.includes(file.type)) {
      return json(
        { success: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        400
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resourceType = type === 'video' ? 'video' : 'image';

    const uploadOptions: UploadApiOptions = {
      folder: `enny_estate/${type}s`,
      resource_type: resourceType,
      transformation:
        type === 'image'
          ? [{ width: 1200, height: 800, crop: 'limit' }, { quality: 'auto' }]
          : [{ quality: 'auto', bit_rate: '1000k' }],
    };

    let result: UploadApiResponse;
    try {
      result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, uploadResult) => {
            if (error) {
              reject(error);
              return;
            }
            if (!uploadResult) {
              reject(new Error('Empty upload result'));
              return;
            }
            resolve(uploadResult);
          }
        );
        uploadStream.on('error', reject);
        Readable.from(buffer).pipe(uploadStream);
      });
    } catch (error) {
      console.error('POST /api/admin/upload: Cloudinary upload error:', error);
      return json({ success: false, error: 'Failed to upload file' }, 500);
    }

    const secureUrl = result.secure_url;
    const publicId = result.public_id;
    if (!secureUrl || !publicId) {
      return json({ success: false, error: 'Failed to upload file' }, 500);
    }

    return json({ success: true, secure_url: secureUrl, public_id: publicId }, 200);
  } catch (error) {
    console.error('POST /api/admin/upload:', error);
    return json({ success: false, error: 'Failed to upload file' }, 500);
  }
}
