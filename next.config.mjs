import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
            pathname: '/**',
          },
        ]
    },
    experimental: {
        // Reduce memory usage during build
        workerThreads: false,
        cpus: 1,
    },
    webpack: (config, { isServer }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, 'src'),
            '@public': path.resolve(__dirname, 'public'),
        }
        
        // Optimize for memory usage
        if (!isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        maxSize: 244000,
                    },
                },
            }
        }
        
        return config
    },
};

export default nextConfig;
