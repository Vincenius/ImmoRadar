/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pictures.immobilienscout24.de', 'img.kleinanzeigen.de', 'ms.immowelt.org'],
  },
};

export default nextConfig;
