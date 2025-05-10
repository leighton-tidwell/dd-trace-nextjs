import "@/utils/tracer";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    const externals = [
      // required if you use native metrics
      "@datadog/native-metrics",

      // required if you use profiling
      "@datadog/pprof",
    ];
    config.externals.push(...externals);
    return config;
  },
};

export default nextConfig;
