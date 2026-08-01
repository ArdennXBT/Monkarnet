
import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Truck, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './Dashboard.css';

const periodes = ['Jour', 'Semaine', 'Mois', 'Année'];
const periodeCles = { Jour: 'jour', Semaine: 'semaine', Mois: 'mois', Année: 'annee' };

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="dashboard-chart-tooltip">
        <p className="dashboard-chart-tooltip-label">{label}</p>
        <p className="dashboard-chart-tooltip-ca">CA : {payload[0].value.toLocaleString('fr-FR')} F</p>
        <p className="dashboard-chart-tooltip-commandes">Commandes : {payload[1].value}</p>
      </div>
    );
  }
  return null;
}

function Dashboard() {
  const [periode, setPeriode] = useState('Jour');
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const token = localStorage.getItem('token');

  const chargerStats = async () => {
    try {
      const [resStats, resChart] = await Promise.all([
        fetch('https://monkarnet-backend.onrender.com/api/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`https://monkarnet-backend.onrender.com/api/stats/chart?periode=${periodeCles[periode]}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const dataStats = await resStats.json();
      const dataChart = await resChart.json();

      if (!resStats.ok) throw new Error(dataStats.message || 'Erreur statistiques.');
      if (!resChart.ok) throw new Error(dataChart.message || 'Erreur graphique.');

      setStats(dataStats);
      setChartData(dataChart);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periode]);

  const donneesPeriode = stats ? stats[periodeCles[periode]] : null;

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

      {erreur && <p className="dashboard-error">{erreur}</p>}

      {chargement || !stats ? (
        <p className="dashboard-loading">Chargement...</p>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="dashboard-card dashboard-card-gradient-1">
              <TrendingUp size={22} />
              <p className="dashboard-card-label">CA {periode.toLowerCase()}</p>
              <p className="dashboard-card-value">{donneesPeriode.totalCA.toLocaleString('fr-FR')} F</p>
            </div>

            <div className="dashboard-card dashboard-card-gradient-2">
              <ShoppingCart size={22} />
              <p className="dashboard-card-label">Commandes</p>
              <p className="dashboard-card-value">{donneesPeriode.nombreCommandes}</p>
            </div>

            <div className="dashboard-card dashboard-card-white">
              <Truck size={22} />
              <p className="dashboard-card-label">Livraisons en cours</p>
              <p className="dashboard-card-value">{stats.livraisonsEnCours}</p>
            </div>

            <div className="dashboard-card dashboard-card-white">
              <AlertCircle size={22} />
              <p className="dashboard-card-label">Litiges ouverts</p>
              <p className="dashboard-card-value">{stats.litigesOuverts}</p>
            </div>
          </div>

          <div className="dashboard-chart-card">
            <div className="dashboard-chart-header">
              <p className="dashboard-chart-title">Évolution — {periode}</p>
              <div className="dashboard-chart-legend">
                <span className="dashboard-legend-item"><span className="dashboard-legend-dot dashboard-legend-dot-ca"></span> Chiffre d'affaires</span>
                <span className="dashboard-legend-item"><span className="dashboard-legend-dot dashboard-legend-dot-commandes"></span> Commandes</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F5FEA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2F5FEA" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCommandes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9E7DF" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#5F5E5A' }} axisLine={{ stroke: '#E9E7DF' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#5F5E5A' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ca" stroke="#2F5FEA" strokeWidth={2.5} fill="url(#colorCa)" />
                <Area type="monotone" dataKey="commandes" stroke="#16A34A" strokeWidth={2.5} fill="url(#colorCommandes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;