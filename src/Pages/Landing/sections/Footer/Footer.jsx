
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-main">
        <div className="landing-footer-brand">
          <span className="landing-footer-logo">Monkarnet</span>
          <p className="landing-footer-desc">
            L'outil gratuit qui remplace le cahier et WhatsApp pour les commerçants.
          </p>
          <a href="#" className="landing-footer-social">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
            Facebook
          </a>
        </div>

        <div className="landing-footer-col">
          <h4>Produit</h4>
          <Link to="/">Commandes</Link>
          <Link to="/">Livraisons</Link>
          <Link to="/">Statistiques</Link>
          <Link to="/">Produits</Link>
          <Link to="/">Tarifs</Link>
        </div>

        <div className="landing-footer-col">
          <h4>Compte</h4>
          <Link to="/login">Connexion</Link>
          <Link to="/inscription">Inscription</Link>
        </div>

        <div className="landing-footer-col">
          <h4>Légal</h4>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/confidentialite">Politique de confidentialité</Link>
        </div>
      </div>

      <p className="landing-footer-bottom">
        © {new Date().getFullYear()} Monkarnet. Tous droits réservés.
      </p>
    </footer>
  );
}

export default Footer;