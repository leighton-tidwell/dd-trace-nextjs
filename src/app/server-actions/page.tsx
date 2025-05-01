import Link from 'next/link';
import styles from '../page.module.css';
import FormWithServerAction from '@/components/server-actions/FormWithServerAction';
import DataMutationDemo from '@/components/server-actions/DataMutationDemo';
import AsyncActionDemo from '@/components/server-actions/AsyncActionDemo';

export default function ServerActionsPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Server Actions Test</h1>
        <p>This page demonstrates React Server Actions to test dd-trace integration.</p>
        
        <div style={{ marginTop: '2rem', width: '100%', maxWidth: '800px' }}>
          <h2>Form with Server Action</h2>
          <div className="component-container">
            <FormWithServerAction />
          </div>
          
          <h2>Data Mutation with Server Action</h2>
          <div className="component-container">
            <DataMutationDemo />
          </div>
          
          <h2>Async Server Action</h2>
          <div className="component-container">
            <AsyncActionDemo />
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <Link href="/server-components" className={styles.primary}>
            Test Server Components
          </Link>
          <Link href="/" className={styles.secondary} style={{ marginLeft: '1rem' }}>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
