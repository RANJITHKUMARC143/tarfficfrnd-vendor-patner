import React from 'react';
import { UserPlus, FileCheck, Shield, Smartphone, Package } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Register Online',
      description: 'Fill out our simple vendor registration form with your business details.'
    },
    {
      icon: FileCheck,
      title: 'Submit Documents',
      description: 'Upload your FSSAI license, GST certificate, and ID proof for verification.'
    },
    {
      icon: Shield,
      title: 'Get Verified',
      description: 'Our team reviews and approves your application within 24-48 hours.'
    },
    {
      icon: Smartphone,
      title: 'Manage via Vendor App',
      description: 'Use the Traffic Frnd Vendor App to manage products, orders, and inventory.'
    },
    {
      icon: Package,
      title: 'Pack & We Deliver',
      description: 'Pack items when orders come in. Our delivery team takes care of the rest!'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in 5 simple steps and start earning from traffic-stuck commuters
          </p>
        </div>

        <div className="relative">
          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            <div className="flex justify-between items-center mb-12">
              {steps.map((_, index) => (
                <div key={index} className="flex-1">
                  {index < steps.length - 1 && (
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-green-500 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-green-500 p-6 rounded-full inline-flex shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border-4 border-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-orange-500">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;