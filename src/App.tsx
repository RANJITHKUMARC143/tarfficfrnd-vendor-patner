import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import HowItWorks from './components/HowItWorks';
import RegistrationForm from './components/RegistrationForm';
import Support from './components/Support';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />
      <RegistrationForm />
      <Support />
      <Footer />
    </div>
  );
}

export default App;