
import Header from './sections/Header/Header';
import Hero from './sections/Hero/Hero';
import Highlight from './sections/Highlight/Highlight';
import Features from './sections/Features/Features';
import Steps from './sections/Steps/Steps';
import Faq from './sections/Faq/Faq';
import FinalCta from './sections/FinalCta/FinalCta';
import Footer from './sections/Footer/Footer';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      <Header />
      <Hero />
      <Highlight />
      <Features />
      <Steps />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

export default Landing;