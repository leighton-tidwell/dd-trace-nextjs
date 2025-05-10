"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RefreshButtonProps {
  refreshInterval: number; // in milliseconds
  className?: string;
}

export default function RefreshButton({
  refreshInterval,
  className = "",
}: RefreshButtonProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(refreshInterval / 1000);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Handle manual refresh
  const handleRefresh = () => {
    router.refresh();
    setTimeLeft(refreshInterval / 1000);
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  // Set up auto-refresh timer
  useEffect(() => {
    if (!isAutoRefresh) return;

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Refresh the page when countdown reaches 0
          router.refresh();
          return refreshInterval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up
    return () => clearInterval(countdownInterval);
  }, [refreshInterval, router, isAutoRefresh]);

  return (
    <div className={`refresh-controls ${className}`}>
      <button onClick={handleRefresh} className="refresh-button">
        Refresh Now
      </button>
      <button
        onClick={toggleAutoRefresh}
        className={`auto-refresh-toggle ${isAutoRefresh ? "active" : ""}`}
      >
        {isAutoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
      </button>
      {isAutoRefresh && (
        <span className="refresh-countdown">
          Refreshing in {timeLeft} seconds
        </span>
      )}

      <style jsx>{`
        .refresh-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .refresh-button,
        .auto-refresh-toggle {
          padding: 6px 12px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .refresh-button {
          background-color: #1a3a4a;
          color: #dddddd;
        }

        .refresh-button:hover {
          background-color: #2a5a7a;
        }

        .auto-refresh-toggle {
          background-color: #333333;
          color: #dddddd;
        }

        .auto-refresh-toggle.active {
          background-color: #1a3a1a;
          color: #52c41a;
        }

        .auto-refresh-toggle:hover {
          background-color: ${isAutoRefresh ? "#2a5a2a" : "#444444"};
        }

        .refresh-countdown {
          font-size: 14px;
          color: #aaaaaa;
        }
      `}</style>
    </div>
  );
}
