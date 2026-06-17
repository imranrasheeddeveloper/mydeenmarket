import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mydeenmarket.com" }],
        destination: "https://mydeenmarket.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
