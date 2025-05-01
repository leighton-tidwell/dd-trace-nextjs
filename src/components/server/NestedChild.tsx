// A nested child server component
import styles from './NestedChild.module.css';

interface NestedChildProps {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  conditions: string;
}

export default function NestedChild({ city, country, temperature, humidity, conditions }: NestedChildProps) {
  // This code runs on the server
  
  // Determine temperature class
  const getTempClass = (temp: number) => {
    if (temp < 10) return 'cold';
    if (temp < 20) return 'mild';
    if (temp < 30) return 'warm';
    return 'hot';
  };
  
  // Get weather icon
  const getWeatherIcon = (conditions: string) => {
    switch (conditions.toLowerCase()) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'windy': return '💨';
      default: return '🌤️';
    }
  };
  
  const tempClass = getTempClass(temperature);
  const weatherIcon = getWeatherIcon(conditions);
  
  return (
    <div className={`${styles.weather_card} ${styles[tempClass]}`}>
      <div className={styles.city_info}>
        <h5>{city}, {country}</h5>
        <div className={styles.weather_icon}>{weatherIcon}</div>
      </div>
      
      <div className={styles.weather_details}>
        <div className={styles.detail}>
          <span className={styles.label}>Temperature:</span>
          <span className={styles.value}>{temperature}°C</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Humidity:</span>
          <span className={styles.value}>{humidity}%</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Conditions:</span>
          <span className={styles.value}>{conditions}</span>
        </div>
      </div>
    </div>
  );
}
