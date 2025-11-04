import React from "react";
import { Link } from "react-router-dom";
import { LocationCard } from "../types/locations";

interface PlaceCardProps {
	place: LocationCard;
	onMouseEnter: (image: string) => void;
	onMouseLeave: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
	place,
	onMouseEnter,
	onMouseLeave,
}) => {
	return (
		<Link
			// Link to the details page, encoding the name for the URL
			to={`/place/${encodeURIComponent(place.name)}`}
			// ⬇️ BOX-SHADOW CUSTOMIZATION: shadow-xl for default, hover:shadow-2xl for lift ⬇️
			className="bg-[#f8f1ec] rounded-lg shadow-xl overflow-hidden w-[250px] cursor-pointer transition duration-200 hover:-translate-y-1 hover:shadow-2xl no-underline text-inherit"
			// ⬆️ BOX-SHADOW CUSTOMIZATION ⬆️
			onMouseEnter={() => onMouseEnter(place.landing_image)}
			onMouseLeave={onMouseLeave}
		>
			<img
				src={place.landing_image}
				alt={place.name}
				className="w-full h-52 object-cover"
			/>
			<div className="p-4">
				<h2 className="text-xl font-medium mb-2 text-gray-800">
					{place.name}
				</h2>
				<p className="text-gray-600 text-sm">
					{place.about_description}
				</p>
			</div>
		</Link>
	);
};

export default PlaceCard;
