import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import PlaceCard from '../components/PlaceCard';
import { placesData } from '../Data/PlacesData';
import Footer from '../components/Footer';


// Using a placeholder URL based on your file path
const STATIC_BACKGROUND = "photo/background.jpg"; 

const LandingPage: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isFading, setIsFading] = useState<boolean>(false);

  const handleMouseEnter = (image: string) => {
    setBackgroundImage(image);
    setIsFading(true);
  };

  const handleMouseLeave = () => {
    setBackgroundImage('');
    setIsFading(false);
  };

  return (
    <div 
      className="min-h-screen relative transition-all duration-1000 ease-in-out bg-cover bg-center" 
      style={{
        backgroundImage: `url(${backgroundImage || STATIC_BACKGROUND})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay: Opacity is slightly reduced (0.3) on base image for readability */}
    <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ${isFading ? 'opacity-75' : 'opacity-70'}`} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        {/* ⬇️ WELCOME SECTION ADDED HERE ⬇️ */}
        <div className="text-center p-8 text-[#f8f1ec] drop-shadow-lg">
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-2 tracking-wide drop-shadow-lg">
                Welcome to Ghumakkad!
            </h1>
            <p className="text-xl lg:text-2xl font-medium drop-shadow-lg">
                Because memories are meant to be shared, not forgotten.
            </p>
        </div>
        {/* ⬆️ END WELCOME SECTION ⬆️ */}

        {/* Card Container: Reduced gap and padding for mobile */}
        <div className="flex justify-center flex-wrap gap-4 p-4 max-w-6xl mx-auto flex-grow"> 
          {placesData.map((place) => (
            <PlaceCard
              key={place.name}
              place={place}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>

        
      </div>
      <Footer />
 
    </div>
  );
};

export default LandingPage;