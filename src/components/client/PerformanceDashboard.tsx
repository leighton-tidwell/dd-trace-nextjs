"use client";

import { useState } from "react";

// Import only the types from performance-tracer
interface ComponentMetric {
  name: string;
  renderTime: number;
  dataFetchTime?: number;
  timestamp: number;
  resourceUsage?: {
    cpuTime?: number;
    memoryUsage?: number;
  };
}

interface ActionMetric {
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

interface PerformanceDashboardProps {
  componentMetrics: ComponentMetric[]; // Receive metrics as props instead of fetching
  actionMetrics: ActionMetric[]; // Receive metrics as props instead of fetching
  showComponents?: boolean;
  showActions?: boolean;
  maxItems?: number;
}

export default function PerformanceDashboard({
  componentMetrics,
  actionMetrics,
  showComponents = true,
  showActions = true,
  maxItems = 20,
}: PerformanceDashboardProps) {
  const [sortField, setSortField] = useState<string>("time");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState<"components" | "actions">(
    showComponents ? "components" : "actions"
  );

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
          background-color: #1a1a1a;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          color: #dddddd;
        }

        h2,
        h3 {
          margin-top: 0;
          color: #dddddd;
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
          color: #aaaaaa;
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
          color: #dddddd;
        }

        th {
          background-color: #2a2a2a;
          padding: 12px;
          text-align: left;
          cursor: pointer;
          user-select: none;
        }

        th:hover {
          background-color: #333333;
        }

        td {
          padding: 12px;
          border-top: 1px solid #333333;
        }

        tr:nth-child(even) {
          background-color: #222222;
        }

        tr:hover {
          background-color: #2a2a2a;
        }
      `}</style>
    </div>
  );
}
