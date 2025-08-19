import React from 'react';
import { } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.png" alt="Traffic Frnd" className="h-16 w-auto object-contain" />
              <div>
                <h3 className="text-xl font-bold">Traffic Frnd</h3>
                <p className="text-sm text-gray-400">Vendor Portal</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Traffic Frnd is proudly developed by <span className="font-semibold text-orange-400">Curiospry Technologies Pvt Ltd.</span>
            </p>
            <p className="text-sm text-gray-400">
              Revolutionizing urban delivery by connecting vendors with commuters stuck in traffic. 
              Making delivery faster, smarter, and more accessible across Bengaluru.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              <a 
                href="#" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200"
              >
                Vendor Terms & Conditions
              </a>
              <a 
                href="#" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200"
              >
                Payment Policy
              </a>
              <a 
                href="#" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200"
              >
                Refund & Cancellation
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 Traffic Frnd. All rights reserved. Developed by Curiospry Technologies Pvt Ltd.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <p className="text-sm text-gray-400">
                Pilot City: <span className="text-orange-400 font-semibold">Bengaluru</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;