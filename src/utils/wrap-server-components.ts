/**
 * Utility to wrap server components with performance tracking
 */

"use server";

import { withPerformanceTracking } from "./performance-tracer";
import ServerComponentBasic from "@/components/server/ServerComponentBasic";
import ServerComponentWithData from "@/components/server/ServerComponentWithData";
import ServerComponentWithAsyncData from "@/components/server/ServerComponentWithAsyncData";
import ServerComponentNested from "@/components/server/ServerComponentNested";
import NestedChild from "@/components/server/NestedChild";
import NestedDataProvider from "@/components/server/NestedDataProvider";
import ServerComponentDisplay from "@/components/server/ServerComponentDisplay";

// Wrap server components with performance tracking
export const TrackedServerComponentBasic = withPerformanceTracking(
  ServerComponentBasic,
  {
    name: "ServerComponentBasic",
    trackResourceUsage: true,
  }
);

export const TrackedServerComponentWithData = withPerformanceTracking(
  ServerComponentWithData,
  {
    name: "ServerComponentWithData",
    trackResourceUsage: true,
  }
);

export const TrackedServerComponentWithAsyncData = withPerformanceTracking(
  ServerComponentWithAsyncData,
  {
    name: "ServerComponentWithAsyncData",
    trackResourceUsage: true,
  }
);

export const TrackedServerComponentNested = withPerformanceTracking(
  ServerComponentNested,
  {
    name: "ServerComponentNested",
    trackResourceUsage: true,
  }
);

export const TrackedNestedChild = withPerformanceTracking(NestedChild, {
  name: "NestedChild",
  trackResourceUsage: true,
});

export const TrackedNestedDataProvider = withPerformanceTracking(
  NestedDataProvider,
  {
    name: "NestedDataProvider",
    trackResourceUsage: true,
  }
);

export const TrackedServerComponentDisplay = withPerformanceTracking(
  ServerComponentDisplay,
  {
    name: "ServerComponentDisplay",
    trackResourceUsage: true,
  }
);
