import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'public-travel3.s3.ap-northeast-1.amazonaws.com'
            }
        ]
    }
};

export default nextConfig;
