
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { useCommercant } from '../../context/CommercantContext';
import './Navbar.css';

function Navbar({ onOuvrirMenu }) {
  const [notifOuvert, setNotifOuvert] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const { commercant } = useCommercant();

  const estSurDashboard = location.pathname === '/dashboard';

  const token = localStorage.getItem('token');

  useEffect(() => {
    const chargerNotifications = async () => {
      try {
        const response = await fetch('https://monkarnet-backend.onrender.com/api/notifications/mes-notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setNotifications(data);
      } catch (err) {
        // silencieux, pas critique
      }
    };

    chargerNotifications();
  }, [token]);

  const initiale = commercant?.nomComplet?.charAt(0) || 'C';

  return (
    <header className="navbar">
      <button className="navbar-burger-btn" onClick={onOuvrirMenu}>
        <Menu size={22} />
      </button>

      {estSurDashboard ? (
        <div className="navbar-commerce-block">
          {commercant?.photo ? (
            <img src={commercant.photo} alt="Photo du commerce" className="navbar-commerce-photo" />
          ) : (
            <div className="navbar-commerce-avatar">{initiale}</div>
          )}
          <div className="navbar-commerce-texte">
            <span className="navbar-commerce-nom">{commercant?.nomCommerce || 'Mon commerce'}</span>
            <span className="navbar-commerce-role">
              {commercant?.role === 'superadmin' ? 'Super Admin' : commercant?.role === 'sous-compte' ? 'Sous-compte' : 'Compte Admin'}
            </span>
          </div>
        </div>
      ) : (
        <div className="navbar-search">
          <Search size={18} />
          <input type="text" placeholder="Rechercher une commande, un client..." />
        </div>
      )}

      <div className="navbar-actions">
        <div className="navbar-notif-wrapper">
          <button className="navbar-icon-btn" onClick={() => setNotifOuvert(!notifOuvert)}>
            <Bell size={20} />
            {notifications.length > 0 && <span className="navbar-notif-badge">{notifications.length}</span>}
          </button>
          {notifOuvert && (
            <div className="navbar-notif-dropdown">
              <p className="navbar-notif-title">Notifications</p>
              {notifications.length === 0 ? (
                <p className="navbar-notif-empty">Aucune notification pour l'instant.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="navbar-notif-item">
                    <p className="navbar-notif-item-titre">{n.titre}</p>
                    <p className="navbar-notif-item-message">{n.message}</p>
                    <span className="navbar-notif-item-date">{new Date(n.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;