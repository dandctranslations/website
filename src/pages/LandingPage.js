import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import WhyUs from '../components/WhyUs';
import CtaBand from '../components/CtaBand';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function LandingPage() {
  const location = useLocation();

  // When arriving via /#services etc. (e.g. nav link from the quote page),
  // scroll to the target section once the page has mounted.
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="font-sans">
      <Navbar variant="landing" />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyUs />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
