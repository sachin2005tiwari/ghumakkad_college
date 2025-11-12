import React from "react";
import { Link } from "react-router-dom";
import { LocationCard } from "../types/locations";

interface PlaceCardProps {
	place: LocationCard;
	onMouseEnter: (image: string) => void;
	onMouseLeave: () => void;
}
const truncateText = (text: string, wordLimit: number): string => {
	// Agar text undefined ho toh empty string return karo
	if (!text) {
		return "";
	}

	// Text ko spaces ke through words mein break karo
	const words = text.split(/\s+/);

	// Agar words ki count limit se kam hai, toh poora text waapis kar do
	if (words.length <= wordLimit) {
		return text;
	}

	// Words ko limit tak slice karo, join karo aur '...' add karo
	const truncatedText = words.slice(0, wordLimit).join(' ');

	return truncatedText.trim() + '...';
}

const PlaceCard: React.FC<PlaceCardProps> = ({
	place,
	onMouseEnter,
	onMouseLeave,
}) => {
	const truncatedDescription = truncateText(place.about_description, 30);
	return (
		<Link
			// Link to the details page, encoding the name for the URL
			to={`/place/${place.id}`}
			// ⬇️ BOX-SHADOW CUSTOMIZATION ⬇️
			// W-FULL for mobile (default), sm:w-[250px] for screens >= 640px
			className="bg-[#f8f1ec] rounded-lg shadow-xl overflow-hidden w-full sm:w-[250px] cursor-pointer transition duration-200 hover:-translate-y-1 hover:shadow-2xl no-underline text-inherit"
			// ⬆️ BOX-SHADOW CUSTOMIZATION ⬆️
			onMouseEnter={() => onMouseEnter(place.landing_image)}
			onMouseLeave={onMouseLeave}
		>
			<img
				src={place.landing_image}
				alt={place.name}
				// h-48 for mobile (default), sm:h-52 for screens >= 640px
				className="w-full  sm:h-52 object-cover"
			/>
			<div className="p-4">
				<h2 className="text-xl font-medium mb-2 text-gray-800">
					{place.name}
				</h2>
				<p className="text-gray-600 text-sm">

					{truncatedDescription}
				</p>
			</div>
		</Link>
	);
};

export default PlaceCard;