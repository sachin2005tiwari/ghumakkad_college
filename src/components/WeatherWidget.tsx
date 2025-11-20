// src/components/WeatherWidget.tsx
import React, { useEffect, useState } from "react";
import weatherService, { WeatherData } from "../services/weatherService";
import {
	Sun,
	Cloud,
	CloudRain,
	CloudLightning,
	Snowflake,
	Wind,
	CloudSun,
	Droplets,
	ChevronUp,
	ChevronDown,
	Loader2,
} from "lucide-react";

interface WeatherWidgetProps {
	lat: number;
	lon: number;
	placeName: string;
}

// Helper to map WMO weather codes to Lucide icons and labels
const getWeatherIcon = (code: number) => {
	if (code === 0)
		return { icon: <Sun className="text-yellow-500" />, label: "Clear" };
	if (code >= 1 && code <= 3)
		return {
			icon: <CloudSun className="text-orange-400" />,
			label: "Partly Cloudy",
		};
	if (code >= 45 && code <= 48)
		return { icon: <Wind className="text-gray-400" />, label: "Foggy" };
	if (code >= 51 && code <= 67)
		return { icon: <CloudRain className="text-blue-400" />, label: "Rain" };
	if (code >= 71 && code <= 77)
		return { icon: <Snowflake className="text-cyan-400" />, label: "Snow" };
	if (code >= 80 && code <= 82)
		return {
			icon: <CloudRain className="text-blue-600" />,
			label: "Showers",
		};
	if (code >= 95 && code <= 99)
		return {
			icon: <CloudLightning className="text-purple-500" />,
			label: "Thunderstorm",
		};
	return { icon: <Cloud className="text-gray-500" />, label: "Cloudy" };
};

// Helper to get AQI color
const getAqiColor = (aqi: number) => {
	if (aqi <= 50) return "text-green-600";
	if (aqi <= 100) return "text-yellow-600";
	if (aqi <= 150) return "text-orange-600";
	return "text-red-600";
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lon }) => {
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(false); // State to toggle forecast

	useEffect(() => {
		const fetchWeather = async () => {
			setLoading(true);
			try {
				const data = await weatherService.getWeather(lat, lon);
				setWeather(data);
			} catch (error) {
				console.error("Failed to load weather", error);
			} finally {
				setLoading(false);
			}
		};

		if (lat && lon) {
			fetchWeather();
		}
	}, [lat, lon]);

	if (loading) return <Loader2 className="fixed bottom-4 left-4 text-gray-400 animate-spin" />;
	if (!weather) return null;

	const { icon, label } = getWeatherIcon(weather.current.weatherCode);

	return (
		<div className="fixed bottom-4 left-4 z-50 flex flex-col items-start">
			{/* Main Card (Always Visible) */}
			<div
				className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl border border-white/50 p-4 cursor-pointer transition-all duration-300 hover:scale-105 w-64"
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-3">
						<div className="bg-blue-50 p-2 rounded-full shadow-inner">
							{icon}
						</div>
						<div>
							<div className="flex items-baseline gap-1">
								<span className="text-2xl font-bold text-gray-800">
									{Math.round(weather.current.temperature)}°
								</span>
								<span className="text-sm text-gray-500 font-medium">
									{label}
								</span>
							</div>
							{weather.current.aqi !== null && (
								<div className="flex items-center gap-1 mt-1">
									<Droplets
										size={14}
										className="text-gray-400"
									/>
									<span
										className={`text-xs font-bold ${getAqiColor(
											weather.current.aqi
										)}`}
									>
										AQI {weather.current.aqi}
									</span>
								</div>
							)}
						</div>
					</div>
					<button className="text-gray-400 hover:text-brand-primary transition-colors">
						{isOpen ? (
							<ChevronDown size={20} />
						) : (
							<ChevronUp size={20} />
						)}
					</button>
				</div>
			</div>

			{/* Expandable Forecast Section */}
			{isOpen && (
				<div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl border border-white/50 p-4 mt-2 w-64 animate-in slide-in-from-bottom-2 fade-in duration-300 max-h-[300px] overflow-y-auto">
					<h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
						7-Day Forecast
					</h4>
					<div className="space-y-3">
						{weather.daily.time.map((dateStr, idx) => {
							// Skip today for forecast list if preferred, or keep it.
							// Open-Meteo forecast usually starts with current day.
							const date = new Date(dateStr);
							const dayName = date.toLocaleDateString("en-US", {
								weekday: "short",
							});
							const dailyCode = weather.daily.weatherCode[idx];
							const dailyIcon = getWeatherIcon(dailyCode).icon;

							return (
								<div
									key={idx}
									className="flex items-center justify-between text-sm"
								>
									<span className="text-gray-600 w-8 font-medium">
										{dayName}
									</span>
									<div className="flex-1 flex justify-center">
										{dailyIcon}
									</div>
									<div className="flex gap-2 text-gray-700 font-medium w-16 justify-end">
										<span>
											{Math.round(
												weather.daily.maxTemp[idx]
											)}
											°
										</span>
										<span className="text-gray-400">
											{Math.round(
												weather.daily.minTemp[idx]
											)}
											°
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default WeatherWidget;
