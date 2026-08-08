import Hero from './sections/Hero/Hero';
import Highlight from './sections/Highlight/Highlight';
import Features from './sections/Features/Features';
import Pricing from './sections/Pricing/Pricing';
import Faq from './sections/Faq/Faq';

function Landing() {
  return (
    <div className="landing">
      <Hero />
      <Highlight />
      <Features />
      <Pricing />
      <Faq />
    </div>
  );
}

export default Landing;