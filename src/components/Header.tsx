import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Traffic Frnd" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Traffic Frnd</h1>
              <p className="text-xs text-gray-600">Vendor Portal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('why-partner')}
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              Why Partner
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('register')}
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              Register
            </button>
            <button 
              onClick={() => scrollToSection('support')}
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              Support
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-4">
            <nav className="flex flex-col space-y-2 pt-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors duration-200"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('why-partner')}
                className="text-left text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors duration-200"
              >
                Why Partner
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors duration-200"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('register')}
                className="text-left text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors duration-200"
              >
                Register
              </button>
              <button 
                onClick={() => scrollToSection('support')}
                className="text-left text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors duration-200"
              >
                Support
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;