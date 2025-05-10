/**
 * Performance tracer utility for React Server Components and Server Actions
 *
 * This utility provides a developer-friendly way to measure the performance of
 * server components and server actions in a Next.js application.
 */

import tracer from "./tracer";
import { cache } from "react";

// Performance metrics storage
export interface ComponentMetric {
  name: string;
  renderTime: number;
  dataFetchTime?: number;
  timestamp: number;
  resourceUsage?: {
    cpuTime?: number;
    memoryUsage?: number;
  };
}

export interface ActionMetric {
  name: string;
  executionTime: number;
  timestamp: number;
  params?: Record<string, any>;
  result?: any;
  resourceUsage?: {
    cpuTime?: number;
    memoryUsage?: number;
  };
}

// In-memory storage for metrics (in a real app, you might want to use a database)
class MetricsStore {
  private static instance: MetricsStore;
  private componentMetrics: ComponentMetric[] = [];
  private actionMetrics: ActionMetric[] = [];
  private enabled: boolean = true;
  private samplingRate: number = 1.0; // 1.0 = 100% sampling

  private constructor() {}

  public static getInstance(): MetricsStore {
    if (!MetricsStore.instance) {
      MetricsStore.instance = new MetricsStore();
    }
    return MetricsStore.instance;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setSamplingRate(rate: number): void {
    this.samplingRate = Math.max(0, Math.min(1, rate));
  }

  public shouldSample(): boolean {
    return this.enabled && Math.random() < this.samplingRate;
  }

  public addComponentMetric(metric: ComponentMetric): void {
    if (!this.enabled) return;
    this.componentMetrics.push(metric);
    // Keep only the last 1000 metrics
    if (this.componentMetrics.length > 1000) {
      this.componentMetrics.shift();
    }
  }

  public addActionMetric(metric: ActionMetric): void {
    if (!this.enabled) return;
    this.actionMetrics.push(metric);
    // Keep only the last 1000 metrics
    if (this.actionMetrics.length > 1000) {
      this.actionMetrics.shift();
    }
  }

  public getComponentMetrics(): ComponentMetric[] {
    return [...this.componentMetrics];
  }

  public getActionMetrics(): ActionMetric[] {
    return [...this.actionMetrics];
  }

  public clearMetrics(): void {
    this.componentMetrics = [];
    this.actionMetrics = [];
  }
}

// Get the metrics store instance
const metricsStore = MetricsStore.getInstance();

/**
 * Wraps a server component function to measure its performance
 *
 * @param Component The server component to wrap
 * @param options Options for the performance measurement
 * @returns A wrapped component that measures performance
 */
export function withPerformanceTracking<P>(
  Component: React.ComponentType<P>,
  options: {
    name?: string;
    trackResourceUsage?: boolean;
  } = {}
): React.ComponentType<P> {
  const componentName =
    options.name ||
    Component.displayName ||
    Component.name ||
    "UnknownComponent";

  // Create a wrapped component
  const WrappedComponent = async (props: P) => {
    if (!metricsStore.shouldSample()) {
      // For class components and function components, we need to handle them differently
      if (typeof Component === "function") {
        return await (Component as any)(props);
      }
      return null;
    }

    const startTime = performance.now();
    const startMemory = options.trackResourceUsage
      ? process.memoryUsage().heapUsed
      : undefined;

    // Create a span for this component render
    const span = tracer.startSpan(`rsc.render.${componentName}`);
    span.setTag("component.name", componentName);

    try {
      // Render the component - handle both function and class components
      let result;
      if (typeof Component === "function") {
        result = await (Component as any)(props);
      } else {
        result = null;
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Calculate resource usage if enabled
      let resourceUsage;
      if (options.trackResourceUsage) {
        const endMemory = process.memoryUsage().heapUsed;
        resourceUsage = {
          memoryUsage: endMemory - (startMemory || 0),
        };
      }

      // Record the metric
      metricsStore.addComponentMetric({
        name: componentName,
        renderTime,
        timestamp: Date.now(),
        resourceUsage,
      });

      // Add tags to the span
      span.setTag("render.time_ms", renderTime);
      if (resourceUsage) {
        span.setTag("resource.memory_bytes", resourceUsage.memoryUsage);
      }

      return result;
    } catch (error) {
      // Record error in the span
      span.setTag("error", error);
      throw error;
    } finally {
      // Finish the span
      span.finish();
    }
  };

  // Set the display name for the wrapped component
  Object.defineProperty(WrappedComponent, "name", {
    value: `PerformanceTracked(${componentName})`,
  });

  // Add displayName property to the function
  const wrappedWithDisplayName = WrappedComponent as any;
  wrappedWithDisplayName.displayName = `PerformanceTracked(${componentName})`;

  return wrappedWithDisplayName as React.ComponentType<P>;
}

/**
 * Wraps a server action to measure its performance
 *
 * @param action The server action function to wrap
 * @param options Options for the performance measurement
 * @returns A wrapped action that measures performance
 */
export function trackServerAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  options: {
    name?: string;
    trackParams?: boolean;
    trackResult?: boolean;
    trackResourceUsage?: boolean;
  } = {}
): T {
  const actionName = options.name || action.name || "UnknownAction";

  const wrappedAction = async (
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> => {
    if (!metricsStore.shouldSample()) {
      return action(...args) as ReturnType<T>;
    }

    const startTime = performance.now();
    const startMemory = options.trackResourceUsage
      ? process.memoryUsage().heapUsed
      : undefined;

    // Create a span for this action execution
    const span = tracer.startSpan(`server.action.${actionName}`);
    span.setTag("action.name", actionName);

    try {
      // Execute the action
      const result = await action(...args);

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Calculate resource usage if enabled
      let resourceUsage;
      if (options.trackResourceUsage) {
        const endMemory = process.memoryUsage().heapUsed;
        resourceUsage = {
          memoryUsage: endMemory - (startMemory || 0),
        };
      }

      // Record the metric
      metricsStore.addActionMetric({
        name: actionName,
        executionTime,
        timestamp: Date.now(),
        params: options.trackParams ? args : undefined,
        result: options.trackResult ? result : undefined,
        resourceUsage,
      });

      // Add tags to the span
      span.setTag("execution.time_ms", executionTime);
      if (resourceUsage) {
        span.setTag("resource.memory_bytes", resourceUsage.memoryUsage);
      }

      return result;
    } catch (error) {
      // Record error in the span
      span.setTag("error", error);
      throw error;
    } finally {
      // Finish the span
      span.finish();
    }
  };

  return wrappedAction as T;
}

/**
 * Get the performance metrics for server components
 */
export const getComponentMetrics = cache(() => {
  return metricsStore.getComponentMetrics();
});

/**
 * Get the performance metrics for server actions
 */
export const getActionMetrics = cache(() => {
  return metricsStore.getActionMetrics();
});

/**
 * Configure the performance monitoring
 */
export function configurePerformanceMonitoring(options: {
  enabled?: boolean;
  samplingRate?: number;
}) {
  if (options.enabled !== undefined) {
    metricsStore.setEnabled(options.enabled);
  }

  if (options.samplingRate !== undefined) {
    metricsStore.setSamplingRate(options.samplingRate);
  }
}

/**
 * Clear all performance metrics
 */
export function clearPerformanceMetrics() {
  metricsStore.clearMetrics();
}

export default {
  withPerformanceTracking,
  trackServerAction,
  getComponentMetrics,
  getActionMetrics,
  configurePerformanceMonitoring,
  clearPerformanceMetrics,
};
