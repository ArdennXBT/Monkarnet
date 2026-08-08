import Hero from './sections/Hero/Hero';
import Highlight from './sections/Highlight/Highlight';
import Features from './sections/Features/Features';
import Pricing from './sections/Pricing/Pricing';
import FAQ from './sections/FAQ/FAQ';



function Landing() {
  return (
    <div className="landing">
      <Hero />
      <Highlight />
      <Features />
      <Pricing />
      <FAQ />
    </div>
  );
}

export default Landing;