/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/berlin',
        destination: '/search?q=Berlin',
        permanent: true,
      }, {
        source: '/berlin/lichtenberg',
        destination: '/search?q=Berlin-Lichtenberg',
        permanent: true,
      }, {
        source: '/berlin/mitte',
        destination: '/search?q=Berlin-Mitte',
        permanent: true,
      }, {
        source: '/berlin/spandau',
        destination: '/search?q=Berlin-Spandau',
        permanent: true,
      },

      {
        source: '/grundstueckboerse',
        destination: '/grundstueckboerse/suchen',
        permanent: false,
      },
      {
        source: '/grundstueckboerse/anbieten',
        destination: '/grundstueckboerse/suchen',
        permanent: false,
      },
    ]
  },
};

export default nextConfig