
import { useState } from 'react';
import { TrendingUp, ShoppingCart, Truck, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const periodes = ['Jour', 'Semaine', 'Mois', 'Année'];

const dataParPeriode = {
  Jour: { ca: '452 000 F', commandes: '128', livraisons: '14', litiges: '2' },
  Semaine: { ca: '2 840 000 F', commandes: '812', livraisons: '46', litiges: '5' },
  Mois: { ca: '11 200 000 F', commandes: '3 240', livraisons: '190', litiges: '11' },
  Année: { ca: '128 500 000 F', commandes: '38 900', livraisons: '2 140', litiges: '87' },
};

function Dashboard() {
  const [periode, setPeriode] = useState('Jour');
  const data = dataParPeriode[periode];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tableau de bord</h1>
          <p className="dashboard-subtitle">Vue d'ensemble de votre activité.</p>
        </div>

        <div className="dashboard-periode-switch">
          {periodes.map((p) => (
            <button
              key={p}
              className={`dashboard-periode-btn ${periode === p ? 'dashboard-periode-active' : ''}`}
              onClick={() => setPeriode(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-card dashboard-card-gradient-1">
          <TrendingUp size={22} />
          <p className="dashboard-card-label">CA {periode.toLowerCase()}</p>
          <p className="dashboard-card-value">{data.ca}</p>
        </div>

        <div className="dashboard-card dashboard-card-gradient-2">
          <ShoppingCart size={22} />
          <p className="dashboard-card-label">Commandes</p>
          <p className="dashboard-card-value">{data.commandes}</p>
        </div>

        <div className="dashboard-card dashboard-card-white">
          <Truck size={22} />
          <p className="dashboard-card-label">Livraisons en cours</p>
          <p className="dashboard-card-value">{data.livraisons}</p>
        </div>

        <div className="dashboard-card dashboard-card-white">
          <AlertCircle size={22} />
          <p className="dashboard-card-label">Litiges ouverts</p>
          <p className="dashboard-card-value">{data.litiges}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;