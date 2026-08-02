
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, UserCog, User, X, NotebookText, LogOut } from 'lucide-react';
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
  const navigate = useNavigate();

  const handleDeconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('commercant');
    navigate('/login');
  };

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
        <button className="sidebar-link sidebar-logout-btn" onClick={handleDeconnexion}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;