
import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import './Notifications.css';

function Notifications() {
  const [historique, setHistorique] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [formData, setFormData] = useState({ titre: '', message: '', cible: 'tous' });

  const token = localStorage.getItem('token');

  const chargerHistorique = async () => {
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors du chargement.');

      setHistorique(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerHistorique();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoi(true);
    setErreur('');

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur lors de l'envoi.");

      setHistorique([data, ...historique]);
      setFormData({ titre: '', message: '', cible: 'tous' });
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  const labelCible = (cible) => {
    if (cible === 'commercants') return 'Commerçants principaux';
    if (cible === 'sous-comptes') return 'Sous-comptes';
    return 'Tous les commerçants';
  };

  return (
    <div className="notifications">
      <h1 className="notifications-title">Notifications</h1>
      <p className="notifications-subtitle">Envoyez des annonces à vos utilisateurs.</p>

      {erreur && <p className="notifications-error">{erreur}</p>}

      <div className="notifications-form-card">
        <h2 className="notifications-form-label">Nouvelle notification</h2>
        <form className="notifications-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="titre"
            placeholder="Titre de la notification"
            value={formData.titre}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Message..."
            rows="3"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <select name="cible" value={formData.cible} onChange={handleChange}>
            <option value="tous">Tous les commerçants</option>
            <option value="commercants">Commerçants principaux uniquement</option>
            <option value="sous-comptes">Sous-comptes uniquement</option>
          </select>
          <button type="submit" className="notifications-send-btn" disabled={envoi}>
            <Send size={16} />
            {envoi ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      </div>

      <h2 className="notifications-history-label">Déjà envoyées</h2>
      {chargement ? (
        <p className="notifications-loading">Chargement...</p>
      ) : historique.length === 0 ? (
        <p className="notifications-loading">Aucune notification envoyée pour l'instant.</p>
      ) : (
        <div className="notifications-history">
          {historique.map((n) => (
            <div key={n._id} className="notifications-history-item">
              <div>
                <p className="notifications-history-titre">{n.titre}</p>
                <p className="notifications-history-cible">{labelCible(n.cible)}</p>
              </div>
              <span className="notifications-history-date">{new Date(n.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;