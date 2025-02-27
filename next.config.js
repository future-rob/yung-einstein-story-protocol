/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // For static site generation
  images: {
    unoptimized: true, // Disable image optimization for static export
    domains: [], // Add any external image domains if needed
  },
}

module.exports = nextConfig 