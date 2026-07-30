
import { Link } from 'react-router-dom';
import Reveal from '../../../../components/Reveal/Reveal';
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
            <span className="landing-title-highlight">enfin sous contrôle</span>
          </h1>
          <p className="landing-subtitle">
            Fini le cahier et les messages perdus dans WhatsApp — tout votre commerce, au même endroit.
          </p>
          <Link to="/login" className="landing-cta">Créer mon compte gratuit</Link>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;