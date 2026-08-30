import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, UserCog, User, CreditCard, X, LogOut, ShieldCheck } from 'lucide-react';
import { useCommercant } from '../../context/CommercantContext';
import './Sidebar.css';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', pageKey: 'dashboard' },
  { label: 'Commandes', icon: ShoppingCart, path: '/commandes', pageKey: 'commandes' },
  { label: 'Produits', icon: Package, path: '/produits', pageKey: 'produits' },
  { label: 'Clients', icon: Users, path: '/clients', pageKey: 'clients' },
  { label: 'Sous-comptes', icon: UserCog, path: '/sous-comptes', pageKey: null },
  { label: 'Profil', icon: User, path: '/profil', pageKey: null },
  { label: 'Abonnement', icon: CreditCard, path: '/abonnement', pageKey: null },
];

// Liens réservés au compte principal (jamais affichés à un sous-compte)
const LIENS_RESERVES_AU_PRINCIPAL = ['/sous-comptes', '/abonnement'];

function Sidebar({ ouverte, onFermer }) {
  const navigate = useNavigate();
  const { commercant } = useCommercant();

  const estSousCompte = commercant?.role === 'sous-compte';

  const liensVisibles = menuItems.filter((item) => {
    if (estSousCompte) {
      if (LIENS_RESERVES_AU_PRINCIPAL.includes(item.path)) return false;
      // Le Profil reste toujours accessible ; les autres pages dépendent des permissions
      if (item.pageKey === null) return true;
      return commercant?.pagesAutorisees?.includes(item.pageKey);
    }
    return true;
  });

  const handleDeconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('commercant');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${ouverte ? 'sidebar-ouverte' : ''}`}>
      <div className="sidebar-top">
        <Link to="/dashboard" className="sidebar-logo" onClick={onFermer}>
          <img
            src="/logo-orbizo-full.svg"
            alt="Orbizo"
            className="sidebar-logo-full"
          />
        </Link>
        <button className="sidebar-close-btn" onClick={onFermer}>
          <X size={22} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {liensVisibles.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="sidebar-link" onClick={onFermer}>
              <Icon size={20} color="var(--color-blue)" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {commercant?.role === 'superadmin' && (
          <Link to="/admin/dashboard" className="sidebar-link sidebar-superadmin-link" onClick={onFermer}>
            <ShieldCheck size={20} />
            <span>Espace SuperAdmin</span>
          </Link>
        )}

        <button className="sidebar-link sidebar-logout-btn" onClick={handleDeconnexion}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;