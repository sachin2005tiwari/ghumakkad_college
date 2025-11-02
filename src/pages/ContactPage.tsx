import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const STATIC_BACKGROUND = "photo/background.jpg";
const ContactPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col relative bg-cover bg-center"
      style={{ backgroundImage: `url(${STATIC_BACKGROUND})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div> 
      
      <div className="relative z-10 flex-grow flex flex-col ">
        <Navbar />
        
        <div className="flex-grow flex items-center justify-center p-8 w-full">
            <div className="bg-white/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl max-w-lg w-full">
                <h1 className="text-4xl font-bold text-brand-secondary mb-6 text-center">Get in Touch</h1>
                
                <form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea id="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary transition duration-150"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
      </div>
      <Footer />
      
    </div>
  );
};

export default ContactPage;