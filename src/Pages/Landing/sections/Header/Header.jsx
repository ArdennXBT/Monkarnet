import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="header-section">
      <div className="header-container">
        <div className="header-logo">
          <span className="header-logo-icon" aria-hidden="true"></span>
          <span className="header-logo-text">Orbizo</span>
        </div>

        {/* Navigation desktop */}
        <nav className="header-nav-desktop">
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#avantages">Avantages</a>
          <a href="#tarifs">Tarifs</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="header-actions-desktop">
          <Link to="/login" className="header-login-btn">
            Se connecter
          </Link>
        </div>

        {/* Bouton hamburger mobile */}
        <button
          className="header-burger"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu size={26} strokeWidth={2} />
        </button>
      </div>

      {/* Overlay + menu mobile */}
      <div className={`header-mobile-overlay ${isMenuOpen ? 'header-mobile-overlay-open' : ''}`}>
        <div className="header-mobile-panel">
          <div className="header-mobile-top">
            <div className="header-logo">
              <span className="header-logo-icon" aria-hidden="true"></span>
              <span className="header-logo-text">Orbizo</span>
            </div>
            <button
              className="header-close-btn"
              onClick={closeMenu}
              aria-label="Fermer le menu"
            >
              <X size={22} strokeWidth={2} />
            </button>
          </div>

          <nav className="header-nav-mobile">
            <a href="#fonctionnalites" onClick={closeMenu}>Fonctionnalités</a>
            <a href="#avantages" onClick={closeMenu}>Avantages</a>
            <a href="#tarifs" onClick={closeMenu}>Tarifs</a>
            <a href="#faq" onClick={closeMenu}>FAQ</a>
          </nav>

          <div className="header-mobile-actions">
            <Link to="/login" className="header-login-link-mobile" onClick={closeMenu}>
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;