
import { Search, Bell } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search size={18} />
        <input type="text" placeholder="Rechercher une commande, un client..." />
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon-btn">
          <Bell size={20} />
        </button>
        <div className="navbar-profile">
          <div className="navbar-avatar">C</div>
          <span className="navbar-username">Commerce</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;