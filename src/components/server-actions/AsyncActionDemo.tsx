"use client";

import { useState } from "react";
import { getWeather as fetchWeatherData } from "@/utils/wrap-server-actions";

interface WeatherData {
  location: string;
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
  timestamp: string;
}

export default function AsyncActionDemo() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h3>Weather Lookup with Async Server Action</h3>
      <p>This component uses an async server action to fetch external data.</p>

      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !city.trim()}>
          {isLoading ? "Loading..." : "Get Weather"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {weatherData && (
        <div className="weather-result">
          <h4>{weatherData.location}</h4>

          <div className="weather-details">
            <div className="weather-detail">
              <span className="label">Temperature</span>
              <span className="value">{weatherData.temperature}°C</span>
            </div>

            <div className="weather-detail">
              <span className="label">Conditions</span>
              <span className="value">{weatherData.conditions}</span>
            </div>

            <div className="weather-detail">
              <span className="label">Humidity</span>
              <span className="value">{weatherData.humidity}%</span>
            </div>

            <div className="weather-detail">
              <span className="label">Wind Speed</span>
              <span className="value">{weatherData.windSpeed} km/h</span>
            </div>
          </div>

          <div className="weather-timestamp">
            Last updated: {new Date(weatherData.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      <style jsx>{`
        .weather-container {
          padding: 1.5rem;
          border: 1px solid #333;
          border-radius: 8px;
          background-color: #1a1a1a;
          margin-bottom: 2rem;
          color: #dddddd;
        }

        .weather-form {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #444;
          border-radius: 4px;
          font-size: 1rem;
          background-color: #333333;
          color: #dddddd;
        }

        button {
          padding: 0.5rem 1rem;
          background-color: #1a3a4a;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s;
          min-width: 120px;
        }

        button:hover:not(:disabled) {
          background-color: #2a5a7a;
        }

        button:disabled {
          background-color: #333333;
          cursor: not-allowed;
        }

        .error-message {
          padding: 0.5rem 1rem;
          background-color: #3a1a1a;
          border: 1px solid #5a2a2a;
          color: #ff7875;
          border-radius: 4px;
          margin: 1rem 0;
        }

        .weather-result {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background-color: #2a2a2a;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          color: #dddddd;
        }

        .weather-result h4 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          text-align: center;
          color: #ffffff;
        }

        .weather-details {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .weather-detail {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          background-color: #333333;
          border-radius: 4px;
          color: #dddddd;
        }

        .label {
          font-size: 0.8rem;
          color: #bbbbbb;
          margin-bottom: 0.25rem;
        }

        .value {
          font-size: 1.2rem;
          font-weight: 500;
          color: #ffffff;
        }

        .weather-timestamp {
          margin-top: 1rem;
          text-align: right;
          font-size: 0.8rem;
          color: #bbbbbb;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
