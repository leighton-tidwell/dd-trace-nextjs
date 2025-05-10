"use client";

import { useState, useEffect } from "react";
import {
  getComponentMetrics,
  getActionMetrics,
} from "@/utils/performance-tracer";
import type { ComponentMetric, ActionMetric } from "@/utils/performance-tracer";

interface PerformanceDashboardProps {
  refreshInterval?: number; // in milliseconds
  showComponents?: boolean;
  showActions?: boolean;
  maxItems?: number;
}

export default function PerformanceDashboard({
  refreshInterval = 5000,
  showComponents = true,
  showActions = true,
  maxItems = 20,
}: PerformanceDashboardProps) {
  const [componentMetrics, setComponentMetrics] = useState<ComponentMetric[]>(
    []
  );
  const [actionMetrics, setActionMetrics] = useState<ActionMetric[]>([]);
  const [sortField, setSortField] = useState<string>("time");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState<"components" | "actions">(
    showComponents ? "components" : "actions"
  );

  // Fetch metrics on mount and at the specified interval
  useEffect(() => {
    const fetchMetrics = () => {
      if (showComponents) {
        const metrics = getComponentMetrics();
        setComponentMetrics(metrics);
      }

      if (showActions) {
        const metrics = getActionMetrics();
        setActionMetrics(metrics);
      }
    };

    // Fetch immediately
    fetchMetrics();

    // Set up interval for refreshing
    const intervalId = setInterval(fetchMetrics, refreshInterval);

    // Clean up
    return () => clearInterval(intervalId);
  }, [refreshInterval, showComponents, showActions]);

  // Sort metrics based on the selected field and direction
  const sortedComponentMetrics = [...componentMetrics]
    .sort((a, b) => {
      let aValue, bValue;

      if (sortField === "time") {
        aValue = a.renderTime;
        bValue = b.renderTime;
      } else if (sortField === "name") {
        aValue = a.name;
        bValue = b.name;
      } else if (sortField === "memory") {
        aValue = a.resourceUsage?.memoryUsage || 0;
        bValue = b.resourceUsage?.memoryUsage || 0;
      } else {
        aValue = a.timestamp;
        bValue = b.timestamp;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    })
    .slice(0, maxItems);

  const sortedActionMetrics = [...actionMetrics]
    .sort((a, b) => {
      let aValue, bValue;

      if (sortField === "time") {
        aValue = a.executionTime;
        bValue = b.executionTime;
      } else if (sortField === "name") {
        aValue = a.name;
        bValue = b.name;
      } else if (sortField === "memory") {
        aValue = a.resourceUsage?.memoryUsage || 0;
        bValue = b.resourceUsage?.memoryUsage || 0;
      } else {
        aValue = a.timestamp;
        bValue = b.timestamp;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    })
    .slice(0, maxItems);

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Format time in ms to be more readable
  const formatTime = (timeMs: number) => {
    if (timeMs < 1) {
      return `${(timeMs * 1000).toFixed(2)}μs`;
    } else if (timeMs < 1000) {
      return `${timeMs.toFixed(2)}ms`;
    } else {
      return `${(timeMs / 1000).toFixed(2)}s`;
    }
  };

  // Format memory size to be more readable
  const formatMemory = (bytes?: number) => {
    if (bytes === undefined) return "N/A";

    if (bytes < 1024) {
      return `${bytes}B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)}KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
    }
  };

  return (
    <div className="performance-dashboard">
      <h2>Performance Dashboard</h2>

      {/* Tabs */}
      {showComponents && showActions && (
        <div className="tabs">
          <button
            className={activeTab === "components" ? "active" : ""}
            onClick={() => setActiveTab("components")}
          >
            Server Components
          </button>
          <button
            className={activeTab === "actions" ? "active" : ""}
            onClick={() => setActiveTab("actions")}
          >
            Server Actions
          </button>
        </div>
      )}

      {/* Component Metrics Table */}
      {activeTab === "components" && showComponents && (
        <div className="metrics-table">
          <h3>Server Component Performance</h3>
          {componentMetrics.length === 0 ? (
            <p>No component metrics collected yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSortChange("name")}>
                    Component{" "}
                    {sortField === "name" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSortChange("time")}>
                    Render Time{" "}
                    {sortField === "time" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSortChange("memory")}>
                    Memory Usage{" "}
                    {sortField === "memory" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSortChange("timestamp")}>
                    Timestamp{" "}
                    {sortField === "timestamp" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedComponentMetrics.map((metric, index) => (
                  <tr key={`${metric.name}-${metric.timestamp}-${index}`}>
                    <td>{metric.name}</td>
                    <td>{formatTime(metric.renderTime)}</td>
                    <td>{formatMemory(metric.resourceUsage?.memoryUsage)}</td>
                    <td>{new Date(metric.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Action Metrics Table */}
      {activeTab === "actions" && showActions && (
        <div className="metrics-table">
          <h3>Server Action Performance</h3>
          {actionMetrics.length === 0 ? (
            <p>No action metrics collected yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSortChange("name")}>
                    Action{" "}
                    {sortField === "name" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSortChange("time")}>
                    Execution Time{" "}
                    {sortField === "time" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSortChange("memory")}>
                    Memory Usage{" "}
                    {sortField === "memory" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSortChange("timestamp")}>
                    Timestamp{" "}
                    {sortField === "timestamp" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedActionMetrics.map((metric, index) => (
                  <tr key={`${metric.name}-${metric.timestamp}-${index}`}>
                    <td>{metric.name}</td>
                    <td>{formatTime(metric.executionTime)}</td>
                    <td>{formatMemory(metric.resourceUsage?.memoryUsage)}</td>
                    <td>{new Date(metric.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style jsx>{`
        .performance-dashboard {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
          margin-top: 0;
          color: #333;
        }

        .tabs {
          display: flex;
          margin-bottom: 20px;
        }

        .tabs button {
          padding: 8px 16px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 16px;
          color: #666;
        }

        .tabs button.active {
          border-bottom: 2px solid #0070f3;
          color: #0070f3;
        }

        .metrics-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background-color: #f0f0f0;
          padding: 12px;
          text-align: left;
          cursor: pointer;
          user-select: none;
        }

        th:hover {
          background-color: #e0e0e0;
        }

        td {
          padding: 12px;
          border-top: 1px solid #ddd;
        }

        tr:nth-child(even) {
          background-color: #fafafa;
        }

        tr:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
}
