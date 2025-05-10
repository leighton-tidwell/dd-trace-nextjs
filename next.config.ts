import "@/utils/tracer";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: [
    "dd-trace",
    "@datadog/native-metrics",
    "@datadog/pprof",
    "@datadog/native-appsec",
    "@datadog/native-iast-taint-tracking",
    "@datadog/native-iast-rewriter",
    "graphql/language/visitor",
    "graphql/language/printer",
    "graphql/utilities",
  ],
};

export default nextConfig;
