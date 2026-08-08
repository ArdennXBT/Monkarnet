import { Link } from 'react-router-dom';
import Reveal from '../../../../components/Reveal/Reveal';
import './FinalCta.css';

function FinalCta() {
  return (
    <section className="final-cta-section">
      <div className="final-cta-panel">
        <div className="final-cta-container">
          <Reveal>
            <span className="final-cta-badge">
              <span className="final-cta-badge-dot" />
              Prêt à démarrer ?
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h3 className="final-cta-title">
              Le cahier a fait de son mieux.
              <br />
              <span>Place au digital.</span>
            </h3>
          </Reveal>

          <Reveal delay={200}>
            <p className="final-cta-subtitle">
              Essai gratuit de 14 jours, sans carte bancaire. Aucun engagement.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="final-cta-actions">
              <Link to="/inscription" className="final-cta-button">
                Passez au digital dès aujourd'hui
              </Link>
              <p className="final-cta-note">
                <svg
                  className="final-cta-note-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                Sans carte bancaire
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default FinalCta;