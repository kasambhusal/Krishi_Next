/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cms.krishisanjal.com"], // Add the domain hosting your GIF
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
