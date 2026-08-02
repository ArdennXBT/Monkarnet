
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, UserCog, User, X, NotebookText } from 'lucide-react';
import './Sidebar.css';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Commandes', icon: ShoppingCart, path: '/commandes' },
  { label: 'Produits', icon: Package, path: '/produits' },
  { label: 'Clients', icon: Users, path: '/clients' },
  { label: 'Sous-comptes', icon: UserCog, path: '/sous-comptes' },
  { label: 'Profil', icon: User, path: '/profil' },
];

function Sidebar({ ouverte, onFermer }) {
  return (
    <aside className={`sidebar ${ouverte ? 'sidebar-ouverte' : ''}`}>
      <div className="sidebar-top">
        <Link to="/dashboard" className="sidebar-logo" onClick={onFermer}>
          <span className="sidebar-logo-icon">
            <NotebookText size={20} />
          </span>
          <span className="sidebar-logo-text">Mon karnet</span>
        </Link>
        <button className="sidebar-close-btn" onClick={onFermer}>
          <X size={22} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="sidebar-link" onClick={onFermer}>
              <Icon size={20} color="var(--color-blue)" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;