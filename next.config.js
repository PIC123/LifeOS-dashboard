/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript type checking errors.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig