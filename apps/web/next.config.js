/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
