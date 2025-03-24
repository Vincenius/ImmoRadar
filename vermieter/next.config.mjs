/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.STAGE !== 'local',
};

export default nextConfig;
