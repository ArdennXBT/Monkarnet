
import { useState, useRef, useEffect } from 'react';
import { useCommercant } from '../../context/CommercantContext';
import './Profil.css';

function Profil() {
  const { commercant, setCommercant, chargement } = useCommercant();
  const [formData, setFormData] = useState({
    nomCommerce: '',
    typeCommerce: '',
    adresse: '',
    telephone: '',
  });
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [uploadEnCours, setUploadEnCours] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem('token');

  // Si les données du contexte arrivent après le premier rendu, on synchronise le formulaire
  useEffect(() => {
    if (commercant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        nomCommerce: commercant.nomCommerce || '',
        typeCommerce: commercant.typeCommerce || '',
        adresse: commercant.adresse || '',
        telephone: commercant.telephone || '',
      });
    }
  }, [commercant]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setSucces('');

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/profil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors de la mise à jour.');

      setCommercant(data);
      setSucces('Informations mises à jour.');
    } catch (err) {
      setErreur(err.message);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    setErreur('');
    setSucces('');
    setUploadEnCours(true);

    const formDataPhoto = new FormData();
    formDataPhoto.append('photo', fichier);

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/profil/photo', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataPhoto,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors de l\'upload.');

      setCommercant(data);
      setSucces('Photo mise à jour.');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setUploadEnCours(false);
    }
  };

  if (chargement || !commercant) {
    return <p className="profil-loading">Chargement...</p>;
  }

  return (
    <div className="profil">
      <h1 className="profil-title">Profil</h1>
      <p className="profil-subtitle">Informations de votre commerce.</p>

      <div className="profil-card">
        <button className="profil-avatar-btn" onClick={handlePhotoClick} disabled={uploadEnCours}>
          {commercant.photo ? (
            <img src={commercant.photo} alt="Photo de profil" className="profil-avatar-img" />
          ) : (
            <div className="profil-avatar">{commercant.nomComplet?.charAt(0) || 'C'}</div>
          )}
          <span className="profil-avatar-overlay">{uploadEnCours ? '...' : 'Modifier'}</span>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
        <div>
          <p className="profil-nom">{commercant.nomCommerce}</p>
          <p className="profil-role">{commercant.role === 'superadmin' ? 'Super Admin' : commercant.role === 'sous-compte' ? 'Sous-compte' : 'Compte Admin'}</p>
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