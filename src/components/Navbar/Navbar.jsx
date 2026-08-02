
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, X } from 'lucide-react';
import { useCommercant } from '../../context/CommercantContext';
import './Navbar.css';

function Navbar({ menuOuvert, onToggleMenu }) {
  const [notifOuvert, setNotifOuvert] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [resultats, setResultats] = useState({ commandes: [], produits: [] });
  const [rechercheOuverte, setRechercheOuverte] = useState(false);
  const [rechercheEnCours, setRechercheEnCours] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { commercant } = useCommercant();
  const debounceRef = useRef(null);

  const estSurDashboard = location.pathname === '/dashboard';

  const token = localStorage.getItem('token');

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
      // silencieux, pas critique
    }
  };

  const handleChangeRecherche = (e) => {
    const valeur = e.target.value;
    setRecherche(valeur);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (valeur.trim().length < 2) {
      setResultats({ commandes: [], produits: [] });
      setRechercheOuverte(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setRechercheEnCours(true);
      try {
        const response = await fetch(`https://monkarnet-backend.onrender.com/api/recherche?q=${encodeURIComponent(valeur.trim())}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setResultats(data);
          setRechercheOuverte(true);
        }
      } catch (err) {
        // silencieux
      } finally {
        setRechercheEnCours(false);
      }
    }, 400);
  };

  const handleClicResultat = (type) => {
    setRechercheOuverte(false);
    setRecherche('');
    setResultats({ commandes: [], produits: [] });
    navigate(type === 'commande' ? '/commandes' : '/produits');
  };

  const effacerRecherche = () => {
    setRecherche('');
    setResultats({ commandes: [], produits: [] });
    setRechercheOuverte(false);
  };

  const nombreNonLues = notifications.filter((n) => !n.lu).length;
  const initiale = commercant?.nomComplet?.charAt(0) || 'C';
  const aucunResultat = recherche.trim().length >= 2 && !rechercheEnCours && resultats.commandes.length === 0 && resultats.produits.length === 0;

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
              {commercant?.role === 'superadmin' ? 'Super Admin' : commercant?.role === 'sous-compte' ? 'Sous-compte' : 'Compte Admin'}
            </span>
          </div>
        </div>
      ) : (
        <div className="navbar-search-wrapper">
          <div className="navbar-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Rechercher une commande, un client, un produit..."
              value={recherche}
              onChange={handleChangeRecherche}
              onFocus={() => recherche.trim().length >= 2 && setRechercheOuverte(true)}
            />
            {recherche && (
              <button className="navbar-search-clear" onClick={effacerRecherche}>
                <X size={14} />
              </button>
            )}
          </div>

          {rechercheOuverte && (
            <div className="navbar-search-dropdown">
              {rechercheEnCours && <p className="navbar-search-empty">Recherche...</p>}

              {!rechercheEnCours && aucunResultat && (
                <p className="navbar-search-empty">Aucun résultat pour « {recherche} ».</p>
              )}

              {!rechercheEnCours && resultats.commandes.length > 0 && (
                <div className="navbar-search-section">
                  <p className="navbar-search-section-title">Commandes</p>
                  {resultats.commandes.map((c) => (
                    <button key={c._id} className="navbar-search-item" onClick={() => handleClicResultat('commande')}>
                      <span className="navbar-search-item-titre">{c.client?.nom}</span>
                      <span className="navbar-search-item-sub">{c.total?.toLocaleString('fr-FR')} F · {c.statut}</span>
                    </button>
                  ))}
                </div>
              )}

              {!rechercheEnCours && resultats.produits.length > 0 && (
                <div className="navbar-search-section">
                  <p className="navbar-search-section-title">Produits</p>
                  {resultats.produits.map((p) => (
                    <button key={p._id} className="navbar-search-item" onClick={() => handleClicResultat('produit')}>
                      <span className="navbar-search-item-titre">{p.nom}</span>
                      <span className="navbar-search-item-sub">{p.prix?.toLocaleString('fr-FR')} F</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
                    <span className="navbar-notif-item-date">{new Date(n.createdAt).toLocaleDateString('fr-FR')}</span>
                  </button>
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