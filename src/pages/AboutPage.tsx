import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Still imported, but button usage removed. Can be kept or removed.


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
                <p className="text-lg text-gray-700 mb-2">
                    Ghumakkad is dedicated to celebrating the spirit of adventure. We believe every journey is a story waiting to be told. Our platform connects passionate travelers with breathtaking destinations and shared experiences.
                </p>
                <p className="mt-4 text-gray-600">
                    Founded in 2023, we aim to be your ultimate source for authentic travel knowledge.
                </p>
                
                {/* Section 1: Vision & Mission */}
                <hr className="my-8 border-t border-brand-primary/50"/>
                
                <h2 className="text-3xl font-bold text-brand-secondary mb-3">Our Vision & Mission</h2>
                <p className="text-base text-gray-700 mb-6">
                    Our mission is to create a community where every traveler, from the seasoned backpacker to the weekend explorer, can share and discover authentic, unfiltered travel stories and practical advice. We emphasize sustainability and respect for local cultures in all our featured destinations.
                </p>
                
                {/* Section 2: Why Join Us? */}
                <h2 className="text-3xl font-bold text-brand-secondary mb-3">Why Join Us?</h2>
                <div className="text-left space-y-3 text-gray-700 mx-auto max-w-sm mb-8">
                    <p className="font-medium">🌍 Discover Hidden Gems: Read inspiring stories and local tips you won't find in guidebooks.</p> 
                    <p className="font-medium">✍️ Publish Your Own Adventures: Share your journeys effortlessly with our dedicated community.</p>
                    <p className="font-medium">🤝 Connect with Fellow Explorers: Find travel partners and get real-time advice from the community.</p>
                </div>
                
                {/* NEW CARD/DIV: Extra Content (Technology & Contribution) */}
                <div className="mt-6 p-6 border-2 border-brand-secondary bg-brand-light/70 rounded-xl text-left shadow-lg">
                    <h3 className="text-2xl font-bold text-brand-secondary mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Our Open-Source Commitment
                    </h3>
                    <p className="text-gray-700 mb-4">
                        Ghumakkad is proudly built on modern, open-source foundations. We believe in transparency and community-driven development.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li><b>Frontend Stack:</b> Built with React (or Preact), TypeScript, and Vite.</li>
                        <li><b>Styling:</b> Designed for speed and responsiveness using Tailwind CSS.</li>
                        <li><b>Core Technologies:</b> Leverages Supabase for database and authentication services.</li>
                        <li><b>Contribute:</b> We welcome bug reports, feature suggestions, and code contributions!</li>
                    </ul>
                </div>
                
               
                
            </div>
        </div>
      </div>
      <Footer />
     
    </div>
  );
};

export default AboutPage;