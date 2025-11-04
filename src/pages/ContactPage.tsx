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
            <div className="bg-white/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl max-w-lg w-full text-gray-700">
                <h1 className="text-4xl font-bold text-brand-secondary mb-6 text-center">Connect with the Ghumakkad Team</h1>

                <div className="text-center mb-8">
                    <p className="text-lg ">
                        Ghumakkad is an open-source project dedicated to sharing travel stories. 
                        Reach out to the core team members below for collaborations, questions, or contributions.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Person 1: Sachin Tiwari */}
                    <div className="flex items-start p-4 border-l-4 border-brand-primary bg-gray-50 rounded-md">
                        {/* Placeholder Image for Sachin Tiwari */}
                        <img 
                            src="photo/sachin.jpg" 
                            alt="Sachin Tiwari Profile"
                            className="h-16 w-16 rounded-full object-cover mr-4 flex-shrink-0" 
                        />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Sachin Tiwari</h2>
                            <p className="mt-1">
                                GitHub: <a href="https://github.com/sachin2005tiwari" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-brand-primary font-medium">sachin2005tiwari</a>
                            </p>
                            <p>
                              LinkedIn: <a href="https://www.linkedin.com/in/sachin-tiwari-995912259/" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-brand-primary font-medium">Sachin Tiwari</a>
                            </p>
                        </div>
                    </div>

                    {/* Person 2: Contributor Two */}
                    <div className="flex items-start p-4 border-l-4 border-brand-primary bg-gray-50 rounded-md">
                        {/* Placeholder Image for Riya Sharma */}
                        <img 
                            src="photo/aditya.jpg" 
                            alt="Riya Sharma Profile"
                            className="h-16 w-16 rounded-full object-cover mr-4 flex-shrink-0" 
                        />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Aditya Dev</h2>
                            <p className="mt-1">
                                GitHub: <a href="https://github.com/Aditya-0703-Dev" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-brand-primary font-medium">Aditya-0703-Dev</a>
                            </p>
                            <p>
                                LinkedIn: <a href="https://www.linkedin.com/in/devaditya491/" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-brand-primary font-medium">Aditya Dev</a> </p>
                        </div>
                    </div>

                    {/* Person 3: Contributor Three */}
                    <div className="flex items-start p-4 border-l-4 border-brand-primary bg-gray-50 rounded-md">
                        {/* Placeholder Image for Vivek Singh */}
                        <img 
                            src="photo/gaurav.jpg" 
                            alt="gaurav gulia Profile"
                            className="h-16 w-16 rounded-full object-cover mr-4 flex-shrink-0" 
                        />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Gaurav Gulia</h2>
                            <p className="mt-1">
                                GitHub: <a href="https://github.com/OmniCoder100" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-brand-primary font-medium">OmniCoder100</a>
                            </p>
                            <p>
                                LinkedIn: <a href="https://www.linkedin.com/in/gaurav-gulia-82772b2b2" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-brand-primary font-medium">Gaurav Gulia</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer />
      
    </div>
  );
};

export default ContactPage;