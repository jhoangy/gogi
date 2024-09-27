/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    distDir: 'dist',
    images: {
        unoptimized: true,
    },
   
    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
  }
   
  module.exports = nextConfig