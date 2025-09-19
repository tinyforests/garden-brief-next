
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors https://www.notion.so https://notion.so https://*.notion.so https://*.notion.site" }
        ]
      }
    ]
  }
}
export default nextConfig;
