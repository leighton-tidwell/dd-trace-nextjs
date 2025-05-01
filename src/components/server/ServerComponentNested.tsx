// Parent server component that contains nested server components
import styles from './ServerComponentNested.module.css';
import NestedChild from './NestedChild';
import NestedDataProvider from './NestedDataProvider';

// Generate some data for the nested components
function generateWeatherData() {
  const cities = [
    { name: 'New York', country: 'USA' },
    { name: 'London', country: 'UK' },
    { name: 'Tokyo', country: 'Japan' },
    { name: 'Sydney', country: 'Australia' },
    { name: 'Paris', country: 'France' },
  ];
  
  return cities.map(city => ({
    ...city,
    temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
    humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
    conditions: ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy'][Math.floor(Math.random() * 5)],
    updated: new Date().toISOString(),
  }));
}

export default function ServerComponentNested() {
  // Generate data on the server
  const weatherData = generateWeatherData();
  
  // Perform some calculations
  const averageTemp = weatherData.reduce((sum, city) => sum + city.temperature, 0) / weatherData.length;
  const highestTemp = Math.max(...weatherData.map(city => city.temperature));
  const lowestTemp = Math.min(...weatherData.map(city => city.temperature));
  
  return (
    <div className={styles.server_component_nested}>
      <h3>Nested Server Components</h3>
      <p>This demonstrates server components that contain other server components.</p>
      
      <div className={styles.weather_summary}>
        <h4>Weather Summary:</h4>
        <ul>
          <li>Average Temperature: {averageTemp.toFixed(1)}°C</li>
          <li>Highest Temperature: {highestTemp}°C</li>
          <li>Lowest Temperature: {lowestTemp}°C</li>
        </ul>
      </div>
      
      <div className={styles.nested_components}>
        <h4>City Weather Reports:</h4>
        
        {/* Pass data to a nested data provider component */}
        <NestedDataProvider data={weatherData}>
          {/* This will render individual nested child components */}
          {weatherData.map((city, index) => (
            <NestedChild 
              key={index}
              city={city.name}
              country={city.country}
              temperature={city.temperature}
              humidity={city.humidity}
              conditions={city.conditions}
            />
          ))}
        </NestedDataProvider>
      </div>
    </div>
  );
}
