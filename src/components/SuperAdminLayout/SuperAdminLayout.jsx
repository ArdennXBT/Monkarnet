
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Store, CreditCard, Bell } from 'lucide-react';
import './SuperAdminLayout.css';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Commerces', icon: Store, path: '/admin/commerces' },
  { label: 'Paiements', icon: CreditCard, path: '/admin/paiements' },
  { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
];

function SuperAdminLayout() {
  return (
    <div className="superadmin-layout">
      <header className="superadmin-navbar">
        <span className="superadmin-logo">Monkarnet <span className="superadmin-tag">Admin</span></span>
        <nav className="superadmin-nav">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="superadmin-nav-link">
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="superadmin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;