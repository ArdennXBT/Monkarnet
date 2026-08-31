import { Link } from 'react-router-dom';
import Reveal from '../../../../components/Reveal/Reveal';
import dashboardMockup from '../../../../assets/hero-dashboard-mockup.png';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-wrapper">
      <div className="hero-inner">
        <Reveal>
          <div className="hero-col-text">
            <span className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              Simplifie le quotidien des commerçants
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
              Essai gratuit 7 jours
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <div className="hero-col-image">
            <div className="hero-image-frame">
              <img
                src={dashboardMockup}
                alt="Aperçu du tableau de bord Orbizo"
                className="hero-image"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;