import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const STATIC_BACKGROUND = "photo/background.jpg";

const AboutPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col relative bg-cover bg-center"
      style={{ backgroundImage: `url(${STATIC_BACKGROUND})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div> 
      
      <div className="relative z-10 flex-grow flex flex-col ">
        <Navbar />
        
        <div className="flex-grow flex items-center justify-center p-8">
            <div className="bg-white/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl max-w-2xl text-center">
                <h1 className="text-4xl font-bold text-brand-secondary mb-4">About Ghumakkad</h1>
                <p className="text-lg text-gray-700">
                    Ghumakkad is dedicated to celebrating the spirit of adventure. We believe every journey is a story waiting to be told. Our platform connects passionate travelers with breathtaking destinations and shared experiences.
                </p>
                <p className="mt-4 text-gray-600">
                    Founded in 2023, we aim to be your ultimate source for authentic travel knowledge.
                </p>
            </div>
        </div>
      </div>
      <Footer />
     
    </div>
  );
};

export default AboutPage;