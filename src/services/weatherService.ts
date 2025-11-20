// src/services/weatherService.ts

export interface WeatherData {
	current: {
		temperature: number;
		weatherCode: number;
		aqi: number | null;
	};
	daily: {
		time: string[];
		weatherCode: number[];
		maxTemp: number[];
		minTemp: number[];
	};
}

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const AQI_API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

class WeatherService {
	async getWeather(lat: number, lon: number): Promise<WeatherData> {
		try {
			// 1. Fetch Weather Data (Current & 7-Day Forecast)
			const weatherRes = await fetch(
				`${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
			);
			const weatherJson = await weatherRes.json();

			// 2. Fetch Air Quality Data (Current AQI)
			const aqiRes = await fetch(
				`${AQI_API_URL}?latitude=${lat}&longitude=${lon}&current=us_aqi`
			);
			const aqiJson = await aqiRes.json();

			if (weatherJson.error || aqiJson.error) {
				throw new Error("Failed to fetch weather data");
			}

			return {
				current: {
					temperature: weatherJson.current.temperature_2m,
					weatherCode: weatherJson.current.weather_code,
					aqi: aqiJson.current?.us_aqi ?? null,
				},
				daily: {
					time: weatherJson.daily.time,
					weatherCode: weatherJson.daily.weather_code,
					maxTemp: weatherJson.daily.temperature_2m_max,
					minTemp: weatherJson.daily.temperature_2m_min,
				},
			};
		} catch (error) {
			console.error("Weather Service Error:", error);
			throw error;
		}
	}
}

const weatherService = new WeatherService();
export default weatherService;
