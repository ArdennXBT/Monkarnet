
import { useState, useEffect } from 'react';
import './Commerces.css';

function Commerces() {
  const [commerces, setCommerces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const chargerCommerces = async () => {
      try {
        const response = await fetch('https://monkarnet-backend.onrender.com/api/superadmin/commerces', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Erreur lors du chargement.');

        setCommerces(data);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };

    chargerCommerces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="commerces">
      <h1 className="commerces-title">Commerces</h1>
      <p className="commerces-subtitle">Tous les commerces inscrits sur la plateforme.</p>

      {erreur && <p className="commerces-error">{erreur}</p>}

      {chargement ? (
        <p className="commerces-loading">Chargement...</p>
      ) : commerces.length === 0 ? (
        <p className="commerces-loading">Aucun commerce inscrit pour l'instant.</p>
      ) : (
        <div className="commerces-table-wrapper">
          <table className="commerces-table">
            <thead>
              <tr>
                <th>Commerce</th>
                <th>Type</th>
                <th>Adresse</th>
                <th>Inscrit le</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {commerces.map((c) => (
                <tr key={c._id}>
                  <td>{c.nomCommerce}</td>
                  <td>{c.typeCommerce || 'Non renseigné'}</td>
                  <td>{c.adresse || 'Non renseignée'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className="commerces-badge commerces-badge-green">Actif</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Commerces;