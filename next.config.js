/** @type {import('next').NextConfig} */
const nextConfig = {
  // Switch to server runtime to support API routes & SQLite
  // Remove 'output: "export"' because static export doesn't support API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig