
import { LayoutDashboard, ShoppingCart, Package, Users, UserCog, User } from 'lucide-react';
import './Sidebar.css';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Commandes', icon: ShoppingCart, path: '/commandes' },
  { label: 'Produits', icon: Package, path: '/produits' },
  { label: 'Clients', icon: Users, path: '/clients' },
  { label: 'Sous-comptes', icon: UserCog, path: '/sous-comptes' },
  { label: 'Profil', icon: User, path: '/profil' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Mon karnet</div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.path} href={item.path} className="sidebar-link">
              <Icon size={20} color="var(--color-blue)" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;