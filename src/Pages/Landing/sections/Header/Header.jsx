import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="landing-header">
      <Link to="/" className="landing-logo">
        <img
          src="/logo-orbizo-full.svg"
          alt="Orbizo"
          className="landing-logo-full"
        />
      </Link>
      <nav className="landing-nav">
        <a href="#fonctionnalites" className="landing-nav-link"></a>
        <a href="#tarifs" className="landing-nav-link"></a>
        <Link to="/login" className="landing-nav-login">Connexion</Link>
      </nav>
    </header>
  );
}

export default Header;