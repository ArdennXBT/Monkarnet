import Hero from './sections/Hero/Hero';
import Highlight from './sections/Highlight/Highlight';
import Features from './sections/Features/Features';
import Pricing from './sections/Pricing/Pricing';
import Faq from './sections/Faq/Faq';
import FinalCta from './sections/FinalCta/FinalCta';
import Footer from './sections/Footer/Footer';
import Header from './sections/Header/Header';


function Landing() {
  return (
    <div className="landing">
       <Header />
      <Hero />
      <Highlight />
      <Features />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

export default Landing;