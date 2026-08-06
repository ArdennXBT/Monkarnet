import { useState, useEffect } from 'react';
import {
  Plus, X, Trash2, Pencil, ChevronDown, Clock, Users,
} from 'lucide-react';
import './SousComptes.css';

// Config des rôles disponibles — facile à étendre plus tard
const ROLES = {
  admin: { label: 'Admin', className: 'role-admin' },
  vendeur: { label: 'Vendeur', className: 'role-vendeur' },
  comptable: { label: 'Comptable', className: 'role-comptable' },
  livreur: { label: 'Livreur', className: 'role-livreur' },
};

// Nombre max de sous-comptes selon le plan (à brancher sur le plan réel plus tard)
const MAX_SOUS_COMPTES = 5;

function formatDate(dateStr) {
  if (!dateStr) return 'Jamais connecté';
  const date = new Date(dateStr);
  return `Connecté le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}

function SousComptes() {
  const [sousComptes, setSousComptes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [modalOuvert, setModalOuvert] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [compteEnEdition, setCompteEnEdition] = useState(null);
  const [ouvert, setOuvert] = useState(null); // id du sous-compte dont l'activité est dépliée
  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    motDePasse: '',
    roleSousCompte: 'vendeur',
  });

  const token = localStorage.getItem('token');

  const chargerSousComptes = async () => {
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/sous-comptes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors du chargement.');

      setSousComptes(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerSousComptes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ouvrirModalCreation = () => {
    setModeEdition(false);
    setCompteEnEdition(null);
    setFormData({ nomComplet: '', email: '', motDePasse: '', roleSousCompte: 'vendeur' });
    setModalOuvert(true);
  };

  const ouvrirModalEdition = (compte) => {
    setModeEdition(true);
    setCompteEnEdition(compte._id);
    setFormData({
      nomComplet: compte.nomComplet,
      email: compte.email,
      motDePasse: '',
      roleSousCompte: compte.roleSousCompte || 'vendeur',
    });
    setModalOuvert(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = modeEdition
        ? `https://monkarnet-backend.onrender.com/api/sous-comptes/${compteEnEdition}`
        : 'https://monkarnet-backend.onrender.com/api/sous-comptes';

      // En édition, on n'envoie le mot de passe que s'il a été rempli
      const body = { ...formData };
      if (modeEdition && !body.motDePasse) delete body.motDePasse;

      const response = await fetch(url, {
        method: modeEdition ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors de l\'enregistrement.');

      if (modeEdition) {
        setSousComptes(sousComptes.map((s) => (s._id === compteEnEdition ? data : s)));
      } else {
        setSousComptes([data, ...sousComptes]);
      }

      setModalOuvert(false);
      setFormData({ nomComplet: '', email: '', motDePasse: '', roleSousCompte: 'vendeur' });
    } catch (err) {
      setErreur(err.message);
    }
  };

  const handleSupprimer = async (id) => {
    try {
      const response = await fetch(`https://monkarnet-backend.onrender.com/api/sous-comptes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors de la suppression.');

      setSousComptes(sousComptes.filter((s) => s._id !== id));
    } catch (err) {
      setErreur(err.message);
    }
  };

  const toggleActivite = (id) => {
    setOuvert(ouvert === id ? null : id);
  };

  const limiteAtteinte = sousComptes.length >= MAX_SOUS_COMPTES;

  return (
    <div className="souscomptes">
      <div className="souscomptes-header">
        <div>
          <h1 className="souscomptes-title">Sous-comptes</h1>
          <p className="souscomptes-subtitle">Gérez les accès de votre équipe.</p>
        </div>
        <button
          className="souscomptes-add-btn"
          onClick={ouvrirModalCreation}
          disabled={limiteAtteinte}
        >
          <Plus size={18} />
          Ajouter un sous-compte
        </button>
      </div>

      {/* Compteur d'utilisation du plan */}
      <div className="souscomptes-plan-limit">
        <div className="souscomptes-plan-limit-top">
          <span>
            <Users size={14} />
            {sousComptes.length} / {MAX_SOUS_COMPTES} sous-comptes utilisés
          </span>
          {limiteAtteinte && <span className="souscomptes-plan-limit-warning">Limite atteinte</span>}
        </div>
        <div className="souscomptes-plan-bar">
          <div
            className="souscomptes-plan-bar-fill"
            style={{ width: `${Math.min((sousComptes.length / MAX_SOUS_COMPTES) * 100, 100)}%` }}
          />
        </div>
      </div>

      {erreur && <p className="souscomptes-error">{erreur}</p>}

      {chargement ? (
        <p className="souscomptes-loading">Chargement...</p>
      ) : sousComptes.length === 0 ? (
        <p className="souscomptes-loading">Aucun sous-compte pour l'instant.</p>
      ) : (
        <div className="souscomptes-list">
          {sousComptes.map((s) => {
            const role = ROLES[s.roleSousCompte] || ROLES.vendeur;
            const statut = s.statut || 'actif'; // valeur par défaut tant que le backend ne le fournit pas
            const activites = s.activites || [];

            return (
              <div key={s._id} className="souscomptes-card">
                <div className="souscomptes-card-main">
                  <div className="souscomptes-avatar">{s.nomComplet.charAt(0).toUpperCase()}</div>

                  <div className="souscomptes-card-info">
                    <div className="souscomptes-card-name-row">
                      <p className="souscomptes-card-nom">{s.nomComplet}</p>
                      <span className={`souscomptes-badge ${role.className}`}>{role.label}</span>
                      <span className={`souscomptes-status-badge status-${statut}`}>
                        {statut === 'actif' ? 'Actif' : 'En attente'}
                      </span>
                    </div>
                    <p className="souscomptes-card-email">{s.email}</p>
                    <p className="souscomptes-card-connexion">
                      <Clock size={12} />
                      {formatDate(s.derniereConnexion)}
                    </p>
                  </div>

                  <div className="souscomptes-card-actions">
                    <button
                      className="souscomptes-icon-btn"
                      onClick={() => ouvrirModalEdition(s)}
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="souscomptes-icon-btn souscomptes-delete-btn"
                      onClick={() => handleSupprimer(s._id)}
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      className={`souscomptes-icon-btn souscomptes-expand-btn ${ouvert === s._id ? 'ouvert' : ''}`}
                      onClick={() => toggleActivite(s._id)}
                      title="Voir l'activité"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>

                {ouvert === s._id && (
                  <div className="souscomptes-activity-panel">
                    <p className="souscomptes-activity-title">Activité récente</p>
                    {activites.length === 0 ? (
                      <p className="souscomptes-empty-activity">Aucune activité enregistrée pour l'instant.</p>
                    ) : (
                      <ul className="souscomptes-activity-list">
                        {activites.map((a, i) => (
                          <li key={i} className="souscomptes-activity-item">
                            <span>{a.description}</span>
                            <span className="souscomptes-activity-date">
                              {new Date(a.date).toLocaleString('fr-FR')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOuvert && (
        <div className="souscomptes-modal-overlay" onClick={() => setModalOuvert(false)}>
          <div className="souscomptes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="souscomptes-modal-header">
              <h2>{modeEdition ? 'Modifier le sous-compte' : 'Ajouter un sous-compte'}</h2>
              <button className="souscomptes-modal-close" onClick={() => setModalOuvert(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="souscomptes-modal-form" onSubmit={handleSubmit}>
              <label>
                Nom complet
                <input
                  type="text"
                  name="nomComplet"
                  value={formData.nomComplet}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Rôle
                <select name="roleSousCompte" value={formData.roleSousCompte} onChange={handleChange}>
                  {Object.entries(ROLES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </label>
              <label>
                {modeEdition ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  required={!modeEdition}
                  placeholder={modeEdition ? 'Laisser vide pour ne pas changer' : ''}
                />
              </label>
              <button type="submit" className="souscomptes-modal-submit">
                {modeEdition ? 'Enregistrer les modifications' : 'Créer le sous-compte'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SousComptes;