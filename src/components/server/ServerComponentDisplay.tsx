// Server component that receives props from a client component
import styles from './ServerComponentDisplay.module.css';

interface ServerComponentDisplayProps {
  count: number;
  option: string;
}

export default function ServerComponentDisplay({ count, option }: ServerComponentDisplayProps) {
  // This code runs on the server
  const serverTime = new Date().toISOString();
  
  // Process the data based on the client component's state
  const processedCount = count * count; // Square the count
  
  // Generate different content based on the selected option
  let optionContent;
  switch (option) {
    case 'option1':
      optionContent = (
        <div className={`${styles.option_content} ${styles.option1}`}>
          <h5>Option 1 Selected</h5>
          <p>This is the content for Option 1.</p>
          <ul>
            {Array.from({ length: count > 0 ? count : 0 }).map((_, i) => (
              <li key={i}>Item {i + 1}</li>
            ))}
          </ul>
        </div>
      );
      break;
    case 'option2':
      optionContent = (
        <div className={`${styles.option_content} ${styles.option2}`}>
          <h5>Option 2 Selected</h5>
          <p>This is the content for Option 2.</p>
          <div className={styles.grid}>
            {Array.from({ length: count > 0 ? count : 0 }).map((_, i) => (
              <div key={i} className={styles.grid_item}>Box {i + 1}</div>
            ))}
          </div>
        </div>
      );
      break;
    case 'option3':
      optionContent = (
        <div className={`${styles.option_content} ${styles.option3}`}>
          <h5>Option 3 Selected</h5>
          <p>This is the content for Option 3.</p>
          <div className={styles.progress_container}>
            <div 
              className={styles.progress_bar} 
              style={{ width: `${Math.min(count * 10, 100)}%` }}
            >
              {Math.min(count * 10, 100)}%
            </div>
          </div>
        </div>
      );
      break;
    default:
      optionContent = <p>No option selected</p>;
  }
  
  return (
    <div className={styles.server_display}>
      <h4>Server Component Display</h4>
      <p>This server component receives props from a client component.</p>
      
      <div className={styles.server_info}>
        <div className={styles.info_item}>
          <span className={styles.label}>Count from Client:</span>
          <span className={styles.value}>{count}</span>
        </div>
        <div className={styles.info_item}>
          <span className={styles.label}>Processed Count (squared):</span>
          <span className={styles.value}>{processedCount}</span>
        </div>
        <div className={styles.info_item}>
          <span className={styles.label}>Selected Option:</span>
          <span className={styles.value}>{option}</span>
        </div>
        <div className={styles.info_item}>
          <span className={styles.label}>Server Time:</span>
          <span className={styles.value}>{serverTime}</span>
        </div>
      </div>
      
      <div className={styles.option_display}>
        {optionContent}
      </div>
    </div>
  );
}
