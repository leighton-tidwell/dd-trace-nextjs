import Link from "next/link";
import styles from "../page.module.css";
import PerformanceDashboard from "@/components/client/PerformanceDashboard";
import { configurePerformanceMonitoring } from "@/utils/performance-tracer";

// Configure performance monitoring
configurePerformanceMonitoring({
  enabled: true,
  samplingRate: 1.0, // 100% sampling
});

export default function PerformancePage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Performance Dashboard</h1>
        <p>
          This page shows the performance metrics for server components and
          server actions in the application.
        </p>

        <div style={{ marginTop: "2rem", width: "100%", maxWidth: "1000px" }}>
          <PerformanceDashboard 
            refreshInterval={3000}
            showComponents={true}
            showActions={true}
            maxItems={50}
          />
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Link href="/server-components" className={styles.primary}>
            Test Server Components
          </Link>
          <Link
            href="/server-actions"
            className={styles.secondary}
            style={{ marginLeft: "1rem" }}
          >
            Test Server Actions
          </Link>
          <Link
            href="/"
            className={styles.secondary}
            style={{ marginLeft: "1rem" }}
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
