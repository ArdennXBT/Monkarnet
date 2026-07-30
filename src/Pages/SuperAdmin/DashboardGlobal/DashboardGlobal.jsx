
import { Store, TrendingUp, ShoppingBag } from 'lucide-react';
import './DashboardGlobal.css';

const stats = [
  { label: 'Commerces inscrits', value: '342', icon: Store },
  { label: 'CA total plateforme', value: '18 200 000 F', icon: TrendingUp },
  { label: 'Commandes ce mois', value: '4 812', icon: ShoppingBag },
];

function DashboardGlobal() {
  return (
    <div className="dashboardglobal">
      <h1 className="dashboardglobal-title">Vue d'ensemble</h1>
      <p className="dashboardglobal-subtitle">Statistiques globales de la plateforme.</p>

      <div className="dashboardglobal-stats">
        {stats.map((s) => (
          <div key={s.label} className="dashboardglobal-card">
            <s.icon size={20} color="#185FA5" />
            <p className="dashboardglobal-card-label">{s.label}</p>
            <p className="dashboardglobal-card-value">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardGlobal;