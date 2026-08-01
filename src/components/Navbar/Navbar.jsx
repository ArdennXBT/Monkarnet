
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [notifOuvert, setNotifOuvert] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

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

  const handleDeconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('commercant');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search size={18} />
        <input type="text" placeholder="Rechercher une commande, un client..." />
      </div>

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

        <div className="navbar-profile-wrapper">
          <button className="navbar-profile" onClick={() => setMenuOuvert(!menuOuvert)}>
            <div className="navbar-avatar">C</div>
            <span className="navbar-username">Commerce</span>
          </button>
          {menuOuvert && (
            <div className="navbar-dropdown">
              <button className="navbar-dropdown-item" onClick={handleDeconnexion}>
                <LogOut size={16} />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;