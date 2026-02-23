/** @type {import('next').NextConfig} */
const nextConfig = {
  // IMPORTANT: do NOT use `output: 'export'` on Vercel for this project.
  // It causes prerender/export errors with dynamic data (VLR APIs).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ],
  },
};

module.exports = nextConfig;
