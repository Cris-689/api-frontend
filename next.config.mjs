// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // OBLIGATORIO: Para Docker / microK8s
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.uzbuzbiz.es',
        pathname: '/images/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;