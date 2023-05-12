/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

const nextConfig = {
  // i18n
  i18n,
  publicRuntimeConfig: {
    APP_API_URL: process.env.NEXT_PUBLIC_APP_API_URL,
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
  },
}

module.exports = nextConfig
