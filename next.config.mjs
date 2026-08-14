/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental:{
    serverActions:{
      bodySizeLimit:'10mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'optima.trio-verse.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

};

export default nextConfig;
