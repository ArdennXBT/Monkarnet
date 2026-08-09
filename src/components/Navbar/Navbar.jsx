import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Search, Bell, X } from 'lucide-react';
import { useCommercant } from '../../context/CommercantContext';
import './Navbar.css';

function Navbar({ menuOuvert, onToggleMenu }) {
  const [notifOuvert, setNotifOuvert] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const location = useLocation();
  const { commercant } = useCommercant();

  const [searchParams, setSearchParams] = useSearchParams();

  const estSurDashboard = location.pathname === '/dashboard';
  const estSurProduits = location.pathname === '/produits';
  const estSurCommandes = location.pathname === '/commandes';
  const estSurClients = location.pathname === '/clients';

  // Valeur pour les pages avec recherche locale via URL ?q= (Produits / Commandes / Clients)
  const rechercheLocale = searchParams.get('q') || '';

  const token = localStorage.getItem('token');

  const chargerNotifications = async () => {
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/notifications/mes-notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setNotifications(data);
    } catch (err) {
      // silencieux
    }
  };

  useEffect(() => {
    chargerNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleClicNotification = async (notif) => {
    if (notif.lu) return;

    setNotifications((prev) =>
      prev.map((n) => (n._id === notif._id ? { ...n, lu: true } : n))
    );

    try {
      await fetch(`https://monkarnet-backend.onrender.com/api/notifications/${notif._id}/lire`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      // silencieux
    }
  };

  // === Recherche locale Produits / Commandes / Clients (via URL ?q=) ===
  const handleRechercheLocale = (e) => {
    const valeur = e.target.value;
    const nouveaux = new URLSearchParams(searchParams);
    if (valeur) {
      nouveaux.set('q', valeur);
    } else {
      nouveaux.delete('q');
    }
    setSearchParams(nouveaux);
  };

  const effacerRechercheLocale = () => {
    const nouveaux = new URLSearchParams(searchParams);
    nouveaux.delete('q');
    setSearchParams(nouveaux);
  };

  const placeholderRechercheLocale = estSurCommandes
    ? 'Rechercher par nom, téléphone ou n° de commande...'
    : estSurClients
    ? 'Rechercher un client, un numéro, une adresse...'
    : 'Rechercher un produit...';

  const nombreNonLues = notifications.filter((n) => !n.lu).length;
  const initiale = commercant?.nomComplet?.charAt(0) || 'C';

  return (
    <header className="navbar">
      <button
        className={`navbar-burger-btn ${menuOuvert ? 'navbar-burger-ouvert' : ''}`}
        onClick={onToggleMenu}
        aria-label="Menu"
      >
        <span className="navbar-burger-bar"></span>
        <span className="navbar-burger-bar"></span>
        <span className="navbar-burger-bar"></span>
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
              {commercant?.role === 'superadmin'
                ? 'Super Admin'
                : commercant?.role === 'sous-compte'
                ? 'Sous-compte'
                : 'Compte Admin'}
            </span>
          </div>
        </div>
      ) : estSurProduits || estSurCommandes || estSurClients ? (
        <div className="navbar-produits-toolbar">
          <div className="navbar-produits-search">
            <Search size={16} />
            <input
              type="text"
              placeholder={placeholderRechercheLocale}
              value={rechercheLocale}
              onChange={handleRechercheLocale}
            />
            {rechercheLocale && (
              <button
                type="button"
                className="navbar-search-clear"
                onClick={effacerRechercheLocale}
                aria-label="Effacer la recherche"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="navbar-spacer" />
      )}

      {estSurDashboard && (
        <div className="navbar-actions">
          <div className="navbar-notif-wrapper">
            <button className="navbar-icon-btn" onClick={() => setNotifOuvert(!notifOuvert)}>
              <Bell size={20} />
              {nombreNonLues > 0 && <span className="navbar-notif-badge">{nombreNonLues}</span>}
            </button>
            {notifOuvert && (
              <div className="navbar-notif-dropdown">
                <p className="navbar-notif-title">Notifications</p>
                {notifications.length === 0 ? (
                  <p className="navbar-notif-empty">Aucune notification pour l'instant.</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      className={`navbar-notif-item ${n.lu ? '' : 'navbar-notif-item-non-lue'}`}
                      onClick={() => handleClicNotification(n)}
                    >
                      <div className="navbar-notif-item-header">
                        {!n.lu && <span className="navbar-notif-dot"></span>}
                        <p className="navbar-notif-item-titre">{n.titre}</p>
                      </div>
                      <p className="navbar-notif-item-message">{n.message}</p>
                      <span className="navbar-notif-item-date">
                        {new Date(n.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;