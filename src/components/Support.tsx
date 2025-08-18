import React, { useState } from 'react';
import { Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Support = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How and when do I receive payments?',
      answer: 'Payments are processed weekly and directly transferred to your registered bank account. You can track all payments and earnings through the Traffic Frnd Vendor App.'
    },
    {
      question: 'What documents are required for registration?',
      answer: 'Required documents include: Business registration, Owner ID proof, Bank account details. Optional but recommended: FSSAI license for food items, GST certificate for tax compliance.'
    },
    {
      question: 'How long does the verification process take?',
      answer: 'Our verification process typically takes 24-48 hours after submitting all required documents. You will receive confirmation via SMS once approved.'
    },
    {
      question: 'Can I track my orders and earnings?',
      answer: 'Yes! The Traffic Frnd Vendor App provides real-time order tracking, earnings dashboard, customer feedback, and detailed analytics to help grow your business.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="support" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Support & Help
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions and reach out to our support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-orange-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Support</h3>
            <div className="space-y-6">
              {/* Phone Support */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Phone Support</h4>
                    <p className="text-gray-600">Call us for immediate assistance</p>
                    <a 
                      href="tel:+919353069942" 
                      className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
                    >
                      +91 93530 69942
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">WhatsApp Support</h4>
                    <p className="text-gray-600">Quick help via WhatsApp</p>
                    <a 
                      href="https://wa.me/919353069942" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Support Hours */}
            <div className="mt-8 bg-gradient-to-r from-orange-50 to-green-50 p-6 rounded-2xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Support Hours</h4>
              <p className="text-gray-700">Monday to Sunday: 9:00 AM - 9:00 PM</p>
              <p className="text-sm text-gray-600 mt-2">
                We aim to respond to all queries within 2-4 hours during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;