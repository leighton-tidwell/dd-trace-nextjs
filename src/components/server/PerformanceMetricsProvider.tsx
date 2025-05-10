/**
 * Server component that fetches performance metrics and passes them to client components
 */

import {
  getComponentMetrics,
  getActionMetrics,
} from "@/utils/performance-tracer";
import type { ComponentMetric, ActionMetric } from "@/utils/performance-tracer";
import PerformanceDashboard from "@/components/client/PerformanceDashboard";
import RefreshButton from "@/components/client/RefreshButton";
import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";

interface PerformanceMetricsProviderProps {
  refreshInterval?: number;
  showComponents?: boolean;
  showActions?: boolean;
  maxItems?: number;
}

// This component will be re-rendered on the server at the specified interval
function MetricsLoader({
  showComponents,
  showActions,
  maxItems,
}: {
  showComponents: boolean;
  showActions: boolean;
  maxItems: number;
}) {
  // Opt out of caching for this component
  noStore();

  // Fetch fresh metrics on each render
  const componentMetrics = showComponents ? getComponentMetrics() : [];
  const actionMetrics = showActions ? getActionMetrics() : [];

  return (
    <PerformanceDashboard
      componentMetrics={componentMetrics}
      actionMetrics={actionMetrics}
      showComponents={showComponents}
      showActions={showActions}
      maxItems={maxItems}
    />
  );
}

export default function PerformanceMetricsProvider({
  refreshInterval = 5000,
  showComponents = true,
  showActions = true,
  maxItems = 20,
}: PerformanceMetricsProviderProps) {
  return (
    <div>
      <RefreshButton refreshInterval={refreshInterval} />
      <Suspense fallback={<div>Loading metrics...</div>}>
        <MetricsLoader
          showComponents={showComponents}
          showActions={showActions}
          maxItems={maxItems}
        />
      </Suspense>
    </div>
  );
}
