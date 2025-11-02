import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PlaceDetailsPage from './pages/placeDetailsPage';
import LoginPage from './pages/Loginpage';
import RegisterPage from './pages/RegisterPage';
// ⬇️ NEW PAGE IMPORTS ⬇️

import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page is now the Home page */}
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/place/:name" element={<PlaceDetailsPage />} />
        
        {/* New Pages */}
        
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;