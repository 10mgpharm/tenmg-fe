/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'tenmg-sanbox-bucket.s3.eu-west-1.amazonaws.com',
            pathname: '/uploads/files/**',
          },
          {
            protocol: 'https',
            hostname: 'tenmg-sanbox-bucket.s3.eu-west-1.amazonaws.com',
            pathname: '/1/2025-02-Feb/**',
          },
        ]
    }
};

export default nextConfig;
