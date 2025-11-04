import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { LocationDetails } from "../types/locations";
import locationService from "../services/locationServices";
import AttractionCard from "../components/AttractionCard";

const STATIC_BACKGROUND = "/photo/background.jpg";

const PlaceDetailsPage: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [place, setPlace] = useState<LocationDetails | null>(null);
	const [carasolImages, setCarasolImages] = useState<string[]>([]);

	// Fetches data for a location if id is available
	useEffect(() => {
		const fetchLocationDetails = async (placeId: number) => {
			try {
				const data = await locationService.getLocationById(placeId);
				setPlace(data);
			} catch (error) {
				console.error("Error fetching location details:", error);
				navigate("/"); // Redirect to home on error
			}
		};

		if (id) {
			const placeId = parseInt(id, 10);
			fetchLocationDetails(placeId);
		}
	}, [id]);

	useEffect(() => {
		if (place) {
			const attractions = place.attractions_list;
			attractions.map((attraction) => {
				attraction.screenshots.map((imageUrl) => {
					setCarasolImages((prevImages) => [...prevImages, imageUrl]);
				});
			});
		}
	}, [place, id]);

	if (!place) {
		return (
			<div className="bg-brand-light min-h-screen">
				<Navbar />
				<div className="text-center p-10 text-2xl">
					Place not found!
				</div>
			</div>
		);
	}

	return (
		// ⬅️ Updated the main container with background styles
		<div
			className="min-h-screen flex flex-col relative bg-cover bg-center"
			style={{ backgroundImage: `url(${STATIC_BACKGROUND})` }}
		>
			{/* Static Overlay for Readability */}
			<div className="absolute inset-0 bg-black opacity-70 z-0"></div>

			{/* Main Content Wrapper (z-10 ensures content is above the overlay) */}
			<div className="relative z-10 flex-grow flex flex-col">
				<Navbar />

				{/* Page content starts here */}
				<div className="relative max-h-[500px]">
					<Carousel images={carasolImages} />

					<h1
						className="top-5 left-5 text-4xl z-10 text-white bg-brand-secondary/50 p-3 rounded-lg transition-opacity duration-500 absolute"
					>
						{place.name}
					</h1>
				</div>

				{/* Description Section and Tabs (Set background white for readability) */}
				<div className="p-5 max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg my-8">
					<p className="text-xl text-gray-700 my-5">
						{place.about_description}
					</p>
				</div>

				<div className="p-5 max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg my-8">
					<div className="grid grid-cols-3 w-full">
						{place.attractions_list.map((attraction, index) => {
							return (
								<AttractionCard
									key={index}
									imageUrl={attraction.screenshots[0]}
									name={attraction.name}
								/>
							);
						})}
					</div>
				</div>

				<div className="max-w-4xl mx-auto w-full">
					{/* Location Tab */}
					<div className="my-8 p-5 bg-white/80 backdrop-blur-sm rounded-lg shadow-md shadow-brand-secondary/30">
						<h2 className="text-2xl font-semibold mb-3 text-gray-800">
							Location
						</h2>
						<p className="text-gray-600 mb-4">
							Address: 123 Main St, Sample City, Country
						</p>
						<div className="w-full h-64 bg-gray-200 flex justify-center items-center text-gray-500 text-xl rounded-lg">
							<p>Map Placeholder</p>
						</div>
					</div>

					{/* Reviews/Blogs Tab */}
					<div className="my-8 p-5 bg-white/80 backdrop-blur-sm rounded-lg shadow-md shadow-brand-secondary/30">
						<h2 className="text-2xl font-semibold mb-3 text-gray-800">
							Blogs
						</h2>
						<div className="mt-4">
							<div className="mb-4 p-3 bg-gray-50/80 border border-gray-200 rounded-lg shadow-sm">
								<h3 className="text-lg font-medium text-gray-700">
									John Doe
								</h3>
								<p className="mt-1 text-gray-600">
									This place is amazing! The scenery is
									breathtaking, and the atmosphere is
									peaceful.
								</p>
							</div>
							<div className="mb-4 p-3 bg-gray-50/80 border border-gray-200 rounded-lg shadow-sm">
								<h3 className="text-lg font-medium text-gray-700">
									Jane Smith
								</h3>
								<p className="mt-1 text-gray-600">
									A wonderful destination for a weekend
									getaway. Highly recommended!
								</p>
							</div>
						</div>
						<button className="mt-4 py-2 px-5 text-white text-base bg-brand-primary border-none rounded-md cursor-pointer transition duration-300 hover:bg-brand-secondary">
							Share Your Story!
						</button>
					</div>
				</div>
			</div>

			<Footer />
			<Chatbot />
		</div>
	);
};

export default PlaceDetailsPage;
