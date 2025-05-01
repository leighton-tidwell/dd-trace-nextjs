// Server component that processes data
import styles from "./ServerComponentWithData.module.css";

export default function ServerComponentWithData() {
  // This code runs on the server
  const generateData = () => {
    // Generate some sample data
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        id: i,
        name: `Item ${i}`,
        value: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString(),
      });
    }
    return data;
  };

  // Process the data on the server
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processData = (data: any[]) => {
    // Perform some CPU-intensive operations on the data
    return data.map((item) => ({
      ...item,
      processed: true,
      valueSquared: item.value * item.value,
      valueDouble: item.value * 2,
      category: item.value < 30 ? "low" : item.value < 70 ? "medium" : "high",
    }));
  };

  const rawData = generateData();
  const processedData = processData(rawData);

  // Calculate some statistics
  const totalValue = processedData.reduce((sum, item) => sum + item.value, 0);
  const averageValue = totalValue / processedData.length;
  const maxValue = Math.max(...processedData.map((item) => item.value));
  const minValue = Math.min(...processedData.map((item) => item.value));

  return (
    <div className={styles.server_component_data}>
      <h3>Server Component with Data Processing</h3>
      <p>This component generates and processes data entirely on the server.</p>

      <div className={styles.data_statistics}>
        <h4>Data Statistics:</h4>
        <ul>
          <li>Total Items: {processedData.length}</li>
          <li>Total Value: {totalValue}</li>
          <li>Average Value: {averageValue.toFixed(2)}</li>
          <li>Maximum Value: {maxValue}</li>
          <li>Minimum Value: {minValue}</li>
        </ul>
      </div>

      <div className={styles.data_table}>
        <h4>Processed Data:</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Value</th>
              <th className={styles.th}>Value²</th>
              <th className={styles.th}>Value×2</th>
              <th className={styles.th}>Category</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 1 ? styles.tr_even : ""}
              >
                <td className={styles.td}>{item.id}</td>
                <td className={styles.td}>{item.name}</td>
                <td className={styles.td}>{item.value}</td>
                <td className={styles.td}>{item.valueSquared}</td>
                <td className={styles.td}>{item.valueDouble}</td>
                <td className={styles.td}>{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
