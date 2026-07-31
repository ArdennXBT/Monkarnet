
import { Link } from 'react-router-dom';
import Reveal from '../../../../components/Reveal/Reveal';
import heroMockup from '../../../../assets/hero-dashboard-mockup.png';
import './Hero.css';

function Hero() {
  return (
    <section className="landing-hero-wrapper">
      <div className="landing-hero-blob landing-hero-blob-green" aria-hidden="true" />
      <div className="landing-hero-blob landing-hero-blob-blue" aria-hidden="true" />

      <div className="landing-hero">
        <Reveal>
          <span className="landing-badge">Gratuit pour les commerçants</span>
          <h1 className="landing-title">
            Vos ventes et vos livraisons,<br />
            enfin sous contrôle
          </h1>
          <img
            src={heroMockup}
            alt="Aperçu du tableau de bord Monkarnet"
            className="landing-hero-image"
          />
          <Link to="/login" className="landing-cta">Commencer gratuitement</Link>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;