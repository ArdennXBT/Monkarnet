
import { useState, useEffect } from 'react';
import './Profil.css';

function Profil() {
  const [profil, setProfil] = useState(null);
  const [formData, setFormData] = useState({
    nomCommerce: '',
    typeCommerce: '',
    adresse: '',
    telephone: '',
  });
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const chargerProfil = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Erreur lors du chargement.');

        setProfil(data);
        setFormData({
          nomCommerce: data.nomCommerce || '',
          typeCommerce: data.typeCommerce || '',
          adresse: data.adresse || '',
          telephone: data.telephone || '',
        });
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };

    chargerProfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setSucces('');

    try {
      const response = await fetch('http://localhost:5000/api/profil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors de la mise à jour.');

      setProfil(data);
      setSucces('Informations mises à jour.');
    } catch (err) {
      setErreur(err.message);
    }
  };

  if (chargement) {
    return <p className="profil-loading">Chargement...</p>;
  }

  return (
    <div className="profil">
      <h1 className="profil-title">Profil</h1>
      <p className="profil-subtitle">Informations de votre commerce.</p>

      <div className="profil-card">
        <div className="profil-avatar">{profil?.nomComplet?.charAt(0) || 'C'}</div>
        <div>
          <p className="profil-nom">{profil?.nomCommerce}</p>
          <p className="profil-role">{profil?.role === 'superadmin' ? 'Super Admin' : profil?.role === 'sous-compte' ? 'Sous-compte' : 'Compte Admin'}</p>
        </div>
      </div>

      {erreur && <p className="profil-error">{erreur}</p>}
      {succes && <p className="profil-success">{succes}</p>}

      <div className="profil-section">
        <h2 className="profil-section-title">Informations du commerce</h2>
        <form className="profil-form" onSubmit={handleSubmit}>
          <label>
            Nom du commerce
            <input type="text" name="nomCommerce" value={formData.nomCommerce} onChange={handleChange} />
          </label>
          <label>
            Type de commerce
            <input type="text" name="typeCommerce" value={formData.typeCommerce} onChange={handleChange} />
          </label>
          <label>
            Adresse
            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} />
          </label>
          <label>
            Téléphone
            <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} />
          </label>
          <button type="submit" className="profil-save-btn">Enregistrer</button>
        </form>
      </div>

      <div className="profil-section">
        <h2 className="profil-section-title">Abonnement</h2>
        <div className="profil-plan-card">
          <div>
            <p className="profil-plan-nom">Plan Gratuit</p>
            <p className="profil-plan-desc">Toutes les fonctionnalités de base, sans limite de temps.</p>
          </div>
          <span className="profil-plan-badge">Actif</span>
        </div>
      </div>
    </div>
  );
}

export default Profil;