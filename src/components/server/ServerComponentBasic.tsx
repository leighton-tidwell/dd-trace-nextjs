// This is a basic server component
// Server components are the default in Next.js App Router
import styles from './ServerComponentBasic.module.css';

export default function ServerComponentBasic() {
  // This code runs on the server
  const serverTime = new Date().toISOString();
  const serverInfo = {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
  };

  // CPU-intensive operation to test profiling
  const calculatePrimes = (max: number) => {
    const sieve = Array(max).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i < Math.sqrt(max); i++) {
      if (sieve[i]) {
        for (let j = i * i; j < max; j += i) {
          sieve[j] = false;
        }
      }
    }
    
    return sieve
      .map((isPrime, index) => isPrime ? index : null)
      .filter(Boolean)
      .slice(0, 10); // Return only first 10 primes
  };

  const primes = calculatePrimes(1000);

  return (
    <div className={styles.server_component}>
      <h3>Basic Server Component</h3>
      <p>This component is rendered entirely on the server.</p>
      
      <div className={styles.server_info}>
        <h4>Server Information:</h4>
        <ul>
          <li>Server Time: {serverTime}</li>
          <li>Node Version: {serverInfo.node}</li>
          <li>Platform: {serverInfo.platform}</li>
          <li>Architecture: {serverInfo.arch}</li>
        </ul>
      </div>
      
      <div className={styles.calculation_result}>
        <h4>First 10 Prime Numbers (calculated on server):</h4>
        <p>{primes.join(', ')}</p>
      </div>
    </div>
  );
}
