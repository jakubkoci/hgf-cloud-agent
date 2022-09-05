/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CLOUD_AGENT_API_URL: process.env.CLOUD_AGENT_API_URL,
  },
}

module.exports = {
  ...nextConfig,
}
