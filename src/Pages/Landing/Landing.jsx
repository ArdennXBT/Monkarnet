import Hero from './sections/Hero/Hero';
import Highlight from './sections/Highlight/Highlight';
import Features from './sections/Features/Features';
import Pricing from './sections/Pricing/Pricing';
import Faq from './sections/Faq/Faq';
import FinalCta from './sections/FinalCta/FinalCta';


function Landing() {
  return (
    <div className="landing">
      <Hero />
      <Highlight />
      <Features />
      <Pricing />
      <Faq />
      <FinalCta />
    </div>
  );
}

export default Landing;