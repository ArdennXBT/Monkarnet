import Hero from './sections/Hero/Hero';
import Highlight from './sections/Highlight/Highlight';
import Features from './sections/Features/Features';

function Landing() {
  return (
    <div className="landing">
      <Hero />
      <Highlight />
      <Features />
    </div>
  );
}

export default Landing;