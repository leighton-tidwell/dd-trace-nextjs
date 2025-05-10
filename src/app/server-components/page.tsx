import Link from "next/link";
import styles from "../page.module.css";
import ClientComponentWrapper from "@/components/client/ClientComponentWrapper";
import {
  TrackedServerComponentBasic as ServerComponentBasic,
  TrackedServerComponentWithData as ServerComponentWithData,
  TrackedServerComponentNested as ServerComponentNested,
  TrackedServerComponentWithAsyncData as ServerComponentWithAsyncData,
} from "@/utils/wrap-server-components";

export default function ServerComponentsPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>React Server Components Test</h1>
        <p>
          This page demonstrates various React Server Components to test
          dd-trace integration.
        </p>

        <div style={{ marginTop: "2rem", width: "100%", maxWidth: "800px" }}>
          <h2>Basic Server Component</h2>
          <div className="component-container">
            <ServerComponentBasic />
          </div>

          <h2>Server Component with Data</h2>
          <div className="component-container">
            <ServerComponentWithData />
          </div>

          <h2>Server Component with Async Data</h2>
          <div className="component-container">
            <ServerComponentWithAsyncData />
          </div>

          <h2>Nested Server Components</h2>
          <div className="component-container">
            <ServerComponentNested />
          </div>

          <h2>Client Component Interacting with Server Components</h2>
          <div className="component-container">
            <ClientComponentWrapper />
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Link href="/server-actions" className={styles.primary}>
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
