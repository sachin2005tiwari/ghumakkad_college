import React from "react";
import { Navigation } from "lucide-react";

interface MapDisplayProps {
	lat: number;
	lon: number;
	placeName: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ lat, lon, placeName }) => {
	// 1. Create the URL for the embedded OpenStreetMap iframe
	// We create a small "bounding box" around the location for the view
	const bbox = `${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}`;
	const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

	// 2. Create the URL for Google Maps Directions
	// This link will open Google Maps and set the destination,
	// prompting the user for their starting location.
	const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

	return (
		<div className="w-full">
			{/* The embedded OpenStreetMap */}
			<iframe
				width="100%"
				height="400"
				src={osmEmbedUrl}
				className="border-none rounded-lg shadow-md"
				style={{ border: 0 }}
				allowFullScreen
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				title={`Map of ${placeName}`}
			></iframe>

			{/* Button to get directions */}
			<div className="text-center mt-4">
				<a
					href={googleMapsUrl}
					target="_blank" // Open in a new tab
					rel="noopener noreferrer" // Security best practice
					className="inline-flex items-center justify-center gap-2 py-3 px-6 text-white text-lg font-medium bg-brand-primary border-none rounded-md cursor-pointer transition duration-300 hover:bg-brand-secondary"
				>
					<Navigation size={20} />
					Get Directions
				</a>
			</div>
		</div>
	);
};

export default MapDisplay;
