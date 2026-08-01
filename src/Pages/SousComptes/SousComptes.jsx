
import { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import './SousComptes.css';

function SousComptes() {
  const [sousComptes, setSousComptes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [modalOuvert, setModalOuvert] = useState(false);
  const [formData, setFormData] = useState({ nomComplet: '', email: '', motDePasse: '' });

  const token = localStorage.getItem('token');

  const chargerSousComptes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sous-comptes', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/sous-comptes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur lors de la création.");

      setSousComptes([data, ...sousComptes]);
      setModalOuvert(false);
      setFormData({ nomComplet: '', email: '', motDePasse: '' });
    } catch (err) {
      setErreur(err.message);
    }
  };

  const handleSupprimer = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sous-comptes/${id}`, {
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

  return (
    <div className="souscomptes">
      <div className="souscomptes-header">
        <div>
          <h1 className="souscomptes-title">Sous-comptes</h1>
          <p className="souscomptes-subtitle">Gérez les accès de votre équipe.</p>
        </div>
        <button className="souscomptes-add-btn" onClick={() => setModalOuvert(true)}>
          <Plus size={18} />
          Ajouter un sous-compte
        </button>
      </div>

      {erreur && <p className="souscomptes-error">{erreur}</p>}

      {chargement ? (
        <p className="souscomptes-loading">Chargement...</p>
      ) : sousComptes.length === 0 ? (
        <p className="souscomptes-loading">Aucun sous-compte pour l'instant.</p>
      ) : (
        <div className="souscomptes-list">
          {sousComptes.map((s) => (
            <div key={s._id} className="souscomptes-card">
              <div className="souscomptes-card-info">
                <p className="souscomptes-card-nom">{s.nomComplet}</p>
                <p className="souscomptes-card-date">{s.email}</p>
              </div>
              <button className="souscomptes-delete-btn" onClick={() => handleSupprimer(s._id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOuvert && (
        <div className="souscomptes-modal-overlay" onClick={() => setModalOuvert(false)}>
          <div className="souscomptes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="souscomptes-modal-header">
              <h2>Ajouter un sous-compte</h2>
              <button className="souscomptes-modal-close" onClick={() => setModalOuvert(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="souscomptes-modal-form" onSubmit={handleSubmit}>
              <label>
                Nom complet
                <input type="text" name="nomComplet" value={formData.nomComplet} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </label>
              <label>
                Mot de passe
                <input type="password" name="motDePasse" value={formData.motDePasse} onChange={handleChange} required />
              </label>
              <button type="submit" className="souscomptes-modal-submit">Créer le sous-compte</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SousComptes;