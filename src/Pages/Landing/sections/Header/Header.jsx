
import { Link } from 'react-router-dom';
import { NotebookText } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <header className="landing-header">
      <Link to="/" className="landing-logo">
        <span className="landing-logo-icon">
          <NotebookText size={18} />
        </span>
        Mon karnet
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