import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@blinkit/types", "@blinkit/utils", "@blinkit/ui"],
};

export default nextConfig;
