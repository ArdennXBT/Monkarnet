import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <img
                src="/logo-orbizo-icon.svg"
                alt="Orbizo"
                className="footer-logo-icon"
              />
              <span className="footer-logo-text">Orbizo</span>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Produit</h4>
            <ul className="footer-links">
              <li><a href="#fonctionnalites">Fonctionnalités</a></li>
              <li><a href="#avantages">Avantages</a></li>
              <li><a href="#tarifs">Tarifs</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Réseaux sociaux</h4>
            <div className="footer-socials">
              <a
                href="https://www.facebook.com/ardenntradex"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Orbizo sur Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.523 1.492-3.917 3.777-3.917 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://x.com/ArdennXBT"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Orbizo sur X"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X (Twitter)</span>
              </a>
            </div>

            <h4 className="footer-col-title footer-legal-title">Légal</h4>
            <ul className="footer-links">
              <li><Link to="/confidentialite">Confidentialité</Link></li>
              <li><Link to="/conditions">Conditions d'utilisation</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;