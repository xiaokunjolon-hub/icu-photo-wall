import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许上传最大 10MB 的照片
  serverActions: {
    bodySizeLimit: "10mb",
  },
};

export default nextConfig;
