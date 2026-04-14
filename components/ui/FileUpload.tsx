'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { X, Video, Image as ImageIcon, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  accept: string;
  maxSize: number;
  label: string;
  currentUrl?: string;
  type: 'image' | 'video';
  disabled?: boolean;
  /** Shows a required asterisk next to the label */
  required?: boolean;
}

export default function FileUpload({
  onUpload,
  onRemove,
  accept,
  maxSize,
  label,
  currentUrl,
  type,
  disabled = false,
  required = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentUrl || null);
  }, [currentUrl]);

  const validateFile = (file: File): boolean => {
    setError(null);

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File too large. Max size: ${maxSize}MB`);
      return false;
    }

    const allowedPatterns = accept.split(',').map((s) => s.trim());
    const matches = allowedPatterns.some((pattern) => {
      if (pattern.endsWith('/*')) {
        const base = pattern.slice(0, -2);
        return file.type.startsWith(`${base}/`);
      }
      return file.type === pattern;
    });
    if (!matches) {
      setError(`Invalid file type. Allowed: ${accept}`);
      return false;
    }

    return true;
  };

  const uploadToBackend = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/ennyadmin/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const payload = (await response.json()) as { success?: boolean; secure_url?: string; error?: string };

    if (!response.ok || !payload.success || !payload.secure_url) {
      throw new Error(payload.error ?? 'Upload failed');
    }

    return payload.secure_url;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    setError(null);

    let localPreview: string | null = null;
    try {
      localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      const uploadedUrl = await uploadToBackend(file);
      setPreviewUrl(uploadedUrl);
      onUpload(uploadedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreviewUrl(currentUrl || null);
    } finally {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onRemove?.();
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-500 ml-1">*</span> : null}
      </label>

      {previewUrl && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          {type === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview / Cloudinary URL
            <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain" />
          ) : (
            <video src={previewUrl} controls className="w-full max-h-64" />
          )}
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!previewUrl && (
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition group ${
            disabled || isUploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-green-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading || disabled}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 text-green-900 animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-900/10 transition">
                {type === 'image' ? (
                  <ImageIcon className="w-6 h-6 text-gray-500 group-hover:text-green-900" />
                ) : (
                  <Video className="w-6 h-6 text-gray-500 group-hover:text-green-900" />
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Click to upload {type === 'image' ? 'image' : 'video'}
              </p>
              <p className="text-xs text-gray-400">
                {accept} • Max {maxSize}MB
              </p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
