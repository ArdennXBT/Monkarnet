import { Link } from 'react-router-dom';
import Reveal from '../../../../components/Reveal/Reveal';
import heroMockup from '../../../../assets/hero-dashboard-mockup.png';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-wrapper">
      <div className="hero-blob hero-blob-gold" aria-hidden="true" />
      <div className="hero-blob hero-blob-cobalt" aria-hidden="true" />

      <div className="hero-inner">
        <Reveal>
          <div className="hero-col-text">
            <span className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              Fait pour les commerçants africains
            </span>

            <h1 className="hero-title">
              <span className="hero-title-black">Votre chiffre d&rsquo;affaires,</span><br />
              <span className="hero-title-gold">en temps réel.</span>
            </h1>

            <p className="hero-lede">
              Fini les commandes copiées à la main et la caisse recomptée en fin de
              journée. Orbizo calcule tout pour vous, pendant que vos concurrents
              perdent encore du temps.
            </p>

            <Link to="/login" className="hero-cta">
              Essai gratuit 14 jours
            </Link>
            <p className="hero-cta-note">Sans carte bancaire</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="hero-col-visual">
            <div className="hero-visual-glow" aria-hidden="true" />
            <div className="hero-visual-frame">
              <img
                src={heroMockup}
                alt="Aperçu du tableau de bord Orbizo"
                className="hero-visual-image"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;