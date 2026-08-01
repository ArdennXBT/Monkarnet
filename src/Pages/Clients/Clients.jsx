
import { useState, useEffect } from 'react';
import { Phone, MapPin } from 'lucide-react';
import './Clients.css';

function Clients() {
  const [clients, setClients] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const chargerClients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/clients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Erreur lors du chargement.');

        setClients(data);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };

    chargerClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="clients">
      <h1 className="clients-title">Clients</h1>
      <p className="clients-subtitle">Retrouvez vos clients et leur historique.</p>

      {erreur && <p className="clients-error">{erreur}</p>}

      {chargement ? (
        <p className="clients-loading">Chargement...</p>
      ) : clients.length === 0 ? (
        <p className="clients-loading">Aucun client pour l'instant. Vos clients apparaîtront ici après leur première commande.</p>
      ) : (
        <div className="clients-grid">
          {clients.map((c) => (
            <div key={c._id} className="clients-card">
              <div className="clients-card-avatar">{c.nom?.charAt(0) || '?'}</div>
              <div className="clients-card-info">
                <p className="clients-card-nom">{c.nom}</p>
                <p className="clients-card-detail"><Phone size={14} /> {c.telephone || 'Non renseigné'}</p>
                <p className="clients-card-detail"><MapPin size={14} /> {c.adresse || 'Non renseignée'}</p>
              </div>
              <div className="clients-card-stats">
                <div>
                  <p className="clients-card-stat-value">{c.nombreCommandes}</p>
                  <p className="clients-card-stat-label">Commandes</p>
                </div>
                <div>
                  <p className="clients-card-stat-value">{c.totalDepense.toLocaleString('fr-FR')} F</p>
                  <p className="clients-card-stat-label">Total dépensé</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Clients;