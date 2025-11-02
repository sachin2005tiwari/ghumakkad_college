import React, { useState } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalImages = images.length;
  if (totalImages === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  // Calculate the horizontal shift: -100% per image
  // Note: The original JS used a fixed 20% shift logic that seems incorrect for a 100% image width. 
  // We use the standard 100% shift here.
  const offset = -currentIndex * 100; 

  return (
    <div className="relative overflow-hidden w-full max-h-[500px]">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        // Set the flex container width to hold all images horizontally
        style={{ transform: `translateX(${offset}%)`, width: `${totalImages * 100}%` }}
      >
        {images.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            alt={`Place Image ${index + 1}`}
            className="w-full h-[500px] object-cover block"
            // Ensure each image takes the correct width within the flex container
            style={{ width: `${100 / totalImages}%` }} 
          />
        ))}
      </div>

      {/* Navigation Buttons (carousel-button) */}
      <button
        onClick={prevImage}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black/50 text-white text-2xl p-2 cursor-pointer rounded-full z-20 transition hover:bg-black/80 w-12 h-12 flex items-center justify-center"
      >
        &#10094;
      </button>
      <button
        onClick={nextImage}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black/50 text-white text-2xl p-2 cursor-pointer rounded-full z-20 transition hover:bg-black/80 w-12 h-12 flex items-center justify-center"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;