/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true, serverExternalPackages: ["@playwright/test", "playwright-core", "playwright"] };
export default nextConfig;
