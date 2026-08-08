import { Link } from 'react-router-dom';
import Reveal from '../../../../components/Reveal/Reveal';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-wrapper">
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
            <p className="hero-cta-note">
                <svg className="hero-cta-note-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
                <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" stroke="currentColor" strokeWidth="1.6"/>
                </svg>
                Sans carte bancaire
                </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;