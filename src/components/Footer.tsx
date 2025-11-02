import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  // Define common classes for styling the links
  const linkClasses = "text-white font-bold no-underline transition duration-150 hover:text-brand-primary text-base";
  
  return (
    <footer className="bg-brand-secondary text-white p-4 text-center mt-auto relative z-10">
      
      {/* Links updated to use <Link to="..."> */}
      <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 lg:gap-60 mb-4">
        
        {/* Home is already linked to "/" */}
        <Link to="/" className={linkClasses}>Home</Link>
        
        {/* ⬇️ UPDATED LINKS TO USE REACT ROUTER ⬇️ */}
        <Link to="/about" className={linkClasses}>About</Link>
        
        <Link to="/contact" className={linkClasses}>Contact</Link>
      </div>
    </footer>
  );
};

export default Footer;