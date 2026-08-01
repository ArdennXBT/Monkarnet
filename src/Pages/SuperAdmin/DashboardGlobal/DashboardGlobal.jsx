
import { useState, useEffect } from 'react';
import { Store, TrendingUp, ShoppingBag } from 'lucide-react';
import './DashboardGlobal.css';

function DashboardGlobal() {
  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const chargerStats = async () => {
      try {
        const response = await fetch('https://monkarnet-backend.onrender.com/api/superadmin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Erreur lors du chargement.');

        setStats(data);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };

    chargerStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statsAffichees = stats
    ? [
        { label: 'Commerces inscrits', value: stats.totalCommerces.toLocaleString('fr-FR'), icon: Store },
        { label: 'CA total plateforme', value: `${stats.totalCA.toLocaleString('fr-FR')} F`, icon: TrendingUp },
        { label: 'Commandes totales', value: stats.totalCommandes.toLocaleString('fr-FR'), icon: ShoppingBag },
      ]
    : [];

  return (
    <div className="dashboardglobal">
      <h1 className="dashboardglobal-title">Vue d'ensemble</h1>
      <p className="dashboardglobal-subtitle">Statistiques globales de la plateforme.</p>

      {erreur && <p className="dashboardglobal-error">{erreur}</p>}

      {chargement ? (
        <p className="dashboardglobal-loading">Chargement...</p>
      ) : (
        <div className="dashboardglobal-stats">
          {statsAffichees.map((s) => (
            <div key={s.label} className="dashboardglobal-card">
              <s.icon size={20} color="#185FA5" />
              <p className="dashboardglobal-card-label">{s.label}</p>
              <p className="dashboardglobal-card-value">{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardGlobal;