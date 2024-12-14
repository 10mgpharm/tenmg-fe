/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'tenmg-sanbox-bucket.s3.eu-west-1.amazonaws.com',
          },
        ]
    }
};

export default nextConfig;
