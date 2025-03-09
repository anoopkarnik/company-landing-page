/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images:{
    remotePatterns: [
        {hostname: '0mckiahhlguhefmi.public.blob.vercel-storage.com', protocol:'https'},
        {hostname: 'strapi.bayesian-labs.com', protocol:'https'},
        {hostname: 'localhost', protocol:'http'},
    ]
} // Disable Strict Mode
};

module.exports = nextConfig;
