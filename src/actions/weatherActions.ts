"use server";

// This file contains server actions for weather data

interface WeatherData {
  location: string;
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
  timestamp: string;
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  // Validate input
  if (!city || !city.trim()) {
    throw new Error("City name is required");
  }

  // Normalize city name
  const normalizedCity = city.trim().toLowerCase();

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In a real app, you would call a weather API here
  // For this demo, we'll generate mock data based on the city name

  // Use the city name to seed a pseudo-random number generator
  const seed = normalizedCity
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    const r = x - Math.floor(x);
    return min + Math.floor(r * (max - min + 1));
  };

  // Generate mock weather data
  const weatherConditions = [
    "Sunny",
    "Cloudy",
    "Partly Cloudy",
    "Rainy",
    "Stormy",
    "Snowy",
    "Foggy",
    "Windy",
  ];
  const temperature = random(-10, 35);
  const humidity = random(30, 90);
  const windSpeed = random(0, 30);
  const conditions = weatherConditions[random(0, weatherConditions.length - 1)];

  // Perform some CPU-intensive operations to test profiling
  performHeavyComputation(normalizedCity);

  // Return the weather data
  return {
    location: city.trim(),
    temperature,
    conditions,
    humidity,
    windSpeed,
    timestamp: new Date().toISOString(),
  };
}

// Helper function to simulate CPU-intensive work
function performHeavyComputation(input: string): number {
  // Create a hash from the input string
  const hash = input.split("").reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0);
  }, 0);

  // Use the hash to determine the number of iterations
  const iterations = (Math.abs(hash) % 1000000) + 500000;

  // Perform a CPU-intensive calculation
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }

  return result;
}
