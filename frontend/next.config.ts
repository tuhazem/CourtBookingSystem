import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Modern browsers only — reduces bundle size by ~14 KiB
  experimental: {
    // Remove legacy browser polyfills (IE11, old Safari, etc.)
    optimizePackageImports: ['framer-motion'],
    // Note: optimizeCss disabled due to Next.js 16.x bug causing excessive preload warnings
    // The warnings don't affect functionality but clutter console with false positives
    // Re-enable when Next.js fixes the preload strategy in future versions
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },

  // Production optimizations (swcMinify is enabled by default in Next.js 16)
  reactStrictMode: true,

  // Reduce initial bundle size
  modularizeImports: {
    '@fontsource/material-symbols-outlined': {
      transform: '@fontsource/material-symbols-outlined/{{member}}',
    },
  },

  // Optimize preload strategy to avoid unused preload warnings
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
      ],
    },
  ],

  // Enable production optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression
};

export default withBundleAnalyzer(nextConfig);
