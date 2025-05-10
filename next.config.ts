import "@/utils/tracer";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // serverExternalPackages: [
  //   "dd-trace",
  //   "@datadog/native-metrics",
  //   "@datadog/pprof",
  //   "@datadog/native-appsec",
  //   "@datadog/native-iast-taint-tracking",
  //   "@datadog/native-iast-rewriter",
  //   "graphql/language/visitor",
  //   "graphql/language/printer",
  //   "graphql/utilities",
  // ],
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    const externals = [
      // required if you use native metrics
      "@datadog/native-metrics",

      // required if you use profiling
      "@datadog/pprof",

      // required if you use Datadog security features
      "@datadog/native-appsec",
      "@datadog/native-iast-taint-tracking",
      "@datadog/native-iast-rewriter",

      // required if you encounter graphql errors during the build step
      "graphql/language/visitor",
      "graphql/language/printer",
      "graphql/utilities",

      "dd-trace",
    ];
    config.externals.push(...externals);
    return config;
  },
};

export default nextConfig;
