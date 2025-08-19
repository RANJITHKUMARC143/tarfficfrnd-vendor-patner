import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const scrollToRegister = () => {
    const element = document.getElementById('register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="bg-gradient-to-br from-orange-50 to-green-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Traffic Frnd" className="h-32 w-auto object-contain" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Partner with Traffic Frnd
          </h1>
          <p className="text-xl md:text-2xl text-orange-600 font-semibold mb-4">
            Deliver to Commuters Stuck in Traffic & Boost Your Sales!
          </p>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Connect your business with thousands of commuters stuck in Bengaluru traffic. 
            Traffic Frnd uses walkers and e-scooters to deliver snacks, groceries, and beverages 
            directly to customers in their vehicles, creating a new revenue stream for your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToRegister}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            
          </div>
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">1000+</div>
                <p className="text-gray-600">Daily Commuters</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
                <p className="text-gray-600">Service Available</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">₹0</div>
                <p className="text-gray-600">Setup Cost</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;