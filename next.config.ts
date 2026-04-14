import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Must exceed max admin video upload (50 MB) plus multipart encoding overhead.
    // Routes matched by middleware buffer the body; too low a limit truncates multipart
    // data and causes request.formData() to throw ("Invalid form data" in /api/admin/media).
    proxyClientMaxBodySize: "60mb",
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ui-avatars.com', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
