import React from 'react';
import { Users, TrendingUp, DollarSign, Settings } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Users,
      title: 'New Customer Base in Traffic',
      description: 'Reach thousands of commuters stuck in Bengaluru traffic who need quick snacks and beverages.'
    },
    {
      icon: TrendingUp,
      title: 'Extra Sales & Quick Payouts',
      description: 'Boost your revenue with additional orders and receive quick payments directly to your bank account.'
    },
    {
      icon: DollarSign,
      title: 'Zero Setup Cost',
      description: 'No upfront investment required. Start selling immediately with our free vendor partnership program.'
    },
    {
      icon: Settings,
      title: 'Hassle-free Operations',
      description: 'Focus on your business while Traffic Frnd handles all delivery logistics with our walker and e-scooter network.'
    }
  ];

  return (
    <section id="why-partner" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Partner With Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of vendors who are already benefiting from our unique traffic-based delivery model
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-orange-50 to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="bg-white p-4 rounded-xl inline-flex mb-6 shadow-md">
                <benefit.icon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;