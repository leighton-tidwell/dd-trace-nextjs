// A server component that provides data to its children
import styles from './NestedDataProvider.module.css';

interface WeatherData {
  name: string;
  country: string;
  temperature: number;
  humidity: number;
  conditions: string;
  updated: string;
}

interface NestedDataProviderProps {
  data: WeatherData[];
  children: React.ReactNode;
}

export default function NestedDataProvider({ data, children }: NestedDataProviderProps) {
  // This component processes data and provides context for its children
  // In a real app, this might connect to a database or external API
  
  // Process the data
  const processedData = data.map(item => ({
    ...item,
    temperatureF: (item.temperature * 9/5) + 32, // Convert to Fahrenheit
    heatIndex: calculateHeatIndex(item.temperature, item.humidity),
  }));
  
  // Calculate some global statistics
  const globalStats = {
    count: processedData.length,
    avgTemp: processedData.reduce((sum, item) => sum + item.temperature, 0) / processedData.length,
    avgHumidity: processedData.reduce((sum, item) => sum + item.humidity, 0) / processedData.length,
    lastUpdated: new Date().toLocaleTimeString(),
  };
  
  return (
    <div className={styles.data_provider}>
      <div className={styles.provider_info}>
        <div className={styles.provider_stats}>
          <span>Cities: {globalStats.count}</span>
          <span>Avg Temp: {globalStats.avgTemp.toFixed(1)}°C</span>
          <span>Avg Humidity: {globalStats.avgHumidity.toFixed(1)}%</span>
        </div>
        <div className={styles.provider_updated}>
          Last Updated: {globalStats.lastUpdated}
        </div>
      </div>
      
      <div className={styles.provider_children}>
        {children}
      </div>
    </div>
  );
}

// Helper function to calculate heat index
function calculateHeatIndex(temperature: number, humidity: number): number {
  // This is a simplified version of the heat index calculation
  if (temperature < 27) {
    return temperature; // Heat index is only meaningful at higher temperatures
  }
  
  // Simple heat index formula (simplified version)
  const heatIndex = temperature + (0.05 * humidity);
  return parseFloat(heatIndex.toFixed(1));
}
