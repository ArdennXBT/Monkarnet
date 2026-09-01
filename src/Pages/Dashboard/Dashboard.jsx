import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingCart, Wallet, ChevronDown, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './Dashboard.css';
import { useCommercant } from '../../context/CommercantContext';
import { formatMontant } from '../../utils/formatMontant';

const periodeCles = {
  Jour: 'jour',
  Semaine: 'semaine',
  Mois: 'mois',
  Année: 'annee',
};

function CustomTooltip({ active, payload, label, devise }) {
  if (active && payload && payload.length) {
    return (
      <div className="dashboard-chart-tooltip">
        <p className="dashboard-chart-tooltip-label">{label}</p>
        <p className="dashboard-chart-tooltip-ca">CA : {formatMontant(payload[0].value, devise)}</p>
        <p className="dashboard-chart-tooltip-commandes">Commandes : {payload[1].value}</p>
      </div>
    );
  }
  return null;
}

function Dashboard() {
  const { commercant } = useCommercant();
  const [periode, setPeriode] = useState('jour');
  const [periodeLabel, setPeriodeLabel] = useState('Jour');
  const [showPeriodeMenu, setShowPeriodeMenu] = useState(false);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const menuRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowPeriodeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chargerStats = async () => {
    try {
      setChargement(true);
      const [resStats, resChart] = await Promise.all([
        fetch('https://monkarnet-backend.onrender.com/api/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`https://monkarnet-backend.onrender.com/api/stats/chart?periode=${periode}`, {
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
  }, [periode]);

  const donneesPeriode = stats ? stats[periode] : null;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tableau de bord</h1>
          <p className="dashboard-subtitle">Vue d'ensemble de votre activité.</p>
        </div>

        <div className="dashboard-periode-dropdown" ref={menuRef}>
          <button
            className="dashboard-periode-trigger"
            onClick={() => setShowPeriodeMenu(!showPeriodeMenu)}
          >
            <span>{periodeLabel}</span>
            <ChevronDown size={14} className={showPeriodeMenu ? 'rotated' : ''} />
          </button>

          {showPeriodeMenu && (
            <div className="dashboard-periode-menu">
              {['Jour', 'Semaine', 'Mois', 'Année'].map((p) => (
                <button
                  key={p}
                  className={`dashboard-periode-option ${periodeLabel === p ? 'active' : ''}`}
                  onClick={() => {
                    setPeriodeLabel(p);
                    setPeriode(periodeCles[p]);
                    setShowPeriodeMenu(false);
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {erreur && <p className="dashboard-error">{erreur}</p>}

      {chargement || !stats ? (
        <p className="dashboard-loading">Chargement...</p>
      ) : (
        <>
          {/* 3 CARTES */}
          <div className="dashboard-stats">
            <div className="dashboard-card dashboard-card-gradient-1">
              <div className="dashboard-card-icon">
                <TrendingUp size={18} />
              </div>
              <p className="dashboard-card-label">CA {periodeLabel.toLowerCase()}</p>
              <p className="dashboard-card-value">
                {formatMontant(donneesPeriode?.totalCA, commercant?.devise)}
              </p>
            </div>

            <div className="dashboard-card dashboard-card-gradient-4">
              <div className="dashboard-card-icon">
                <Wallet size={18} />
              </div>
              <p className="dashboard-card-label">Bénéfice</p>
              <p className="dashboard-card-value">
                {formatMontant(donneesPeriode?.totalBenefice, commercant?.devise)}
              </p>
            </div>

            <div className="dashboard-card dashboard-card-gradient-2">
              <div className="dashboard-card-icon">
                <ShoppingCart size={18} />
              </div>
              <p className="dashboard-card-label">Commandes</p>
              <p className="dashboard-card-value">
                {donneesPeriode?.nombreCommandes || 0}
              </p>
            </div>
          </div>

          {/* BOUTONS RAPIDES */}
          <div className="dashboard-quick-actions">
            <Link to="/commandes" className="dashboard-quick-btn dashboard-quick-btn-primary">
              <ShoppingCart size={18} />
              <span>Voir les commandes</span>
            </Link>
            <Link to="/produits" className="dashboard-quick-btn dashboard-quick-btn-secondary">
              <Package size={18} />
              <span>Gérer les produits</span>
            </Link>
          </div>

          {/* GRAPHIQUE */}
          <div className="dashboard-chart-card">
            <div className="dashboard-chart-header">
              <p className="dashboard-chart-title">Évolution — {periodeLabel}</p>
              <div className="dashboard-chart-legend">
                <span className="dashboard-legend-item">
                  <span className="dashboard-legend-dot dashboard-legend-dot-ca"></span>
                  Chiffre d'affaires
                </span>
                <span className="dashboard-legend-item">
                  <span className="dashboard-legend-dot dashboard-legend-dot-commandes"></span>
                  Commandes
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F5FEA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2F5FEA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCommandes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9E7DF" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: '#5F5E5A' }}
                  axisLine={{ stroke: '#E9E7DF' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#5F5E5A' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip devise={commercant?.devise} />} />
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