import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {import('next').NextConfig} */
const baseConfig = {
  transpilePackages: ['next-mdx-remote'],
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      'framer-motion',
      '@radix-ui/react-icons',
      'embla-carousel-react',
      'recharts',
      'date-fns',
    ],
  },
  images: {
    remotePatterns: [
      { hostname: '0mckiahhlguhefmi.public.blob.vercel-storage.com', protocol: 'https' },
      { hostname: 'strapi.bayesian-labs.com', protocol: 'https' },
      { hostname: 'localhost', protocol: 'http' },
      { hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com', protocol: 'https' },
    ]
  } // Disable Strict Mode
};

/** @type {import('next').NextConfig} */
export default function nextConfig(phase) {
  return {
    ...baseConfig,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  };
}
