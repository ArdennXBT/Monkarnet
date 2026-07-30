
import { useState } from 'react';
import { TrendingUp, ShoppingCart, Truck, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './Dashboard.css';

const periodes = ['Jour', 'Semaine', 'Mois', 'Année'];

const dataParPeriode = {
  Jour: { ca: '452 000 F', commandes: '128', livraisons: '14', litiges: '2' },
  Semaine: { ca: '2 840 000 F', commandes: '812', livraisons: '46', litiges: '5' },
  Mois: { ca: '11 200 000 F', commandes: '3 240', livraisons: '190', litiges: '11' },
  Année: { ca: '128 500 000 F', commandes: '38 900', livraisons: '2 140', litiges: '87' },
};

const chartParPeriode = {
  Jour: [
    { label: '00h', ca: 20000, commandes: 4 },
    { label: '04h', ca: 15000, commandes: 3 },
    { label: '08h', ca: 45000, commandes: 9 },
    { label: '12h', ca: 80000, commandes: 18 },
    { label: '16h', ca: 65000, commandes: 14 },
    { label: '20h', ca: 90000, commandes: 22 },
  ],
  Semaine: [
    { label: 'Lun', ca: 400000, commandes: 60 },
    { label: 'Mar', ca: 550000, commandes: 80 },
    { label: 'Mer', ca: 450000, commandes: 65 },
    { label: 'Jeu', ca: 700000, commandes: 100 },
    { label: 'Ven', ca: 850000, commandes: 130 },
    { label: 'Sam', ca: 950000, commandes: 150 },
    { label: 'Dim', ca: 600000, commandes: 90 },
  ],
  Mois: [
    { label: 'Sem 1', ca: 2500000, commandes: 400 },
    { label: 'Sem 2', ca: 3200000, commandes: 520 },
    { label: 'Sem 3', ca: 2900000, commandes: 470 },
    { label: 'Sem 4', ca: 4100000, commandes: 640 },
  ],
  Année: [
    { label: 'Jan', ca: 8000000, commandes: 1200 },
    { label: 'Fév', ca: 9500000, commandes: 1400 },
    { label: 'Mar', ca: 8700000, commandes: 1300 },
    { label: 'Avr', ca: 10500000, commandes: 1600 },
    { label: 'Mai', ca: 11800000, commandes: 1800 },
    { label: 'Jun', ca: 12500000, commandes: 1950 },
    { label: 'Jul', ca: 13200000, commandes: 2100 },
  ],
};

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
  const data = dataParPeriode[periode];
  const chartData = chartParPeriode[periode];

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
    </div>
  );
}

export default Dashboard;