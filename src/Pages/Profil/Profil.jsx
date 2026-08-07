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

  // --- Changement d'email ---
  const [etapeEmail, setEtapeEmail] = useState(1); // 1 = formulaire, 2 = code de confirmation
  const [emailData, setEmailData] = useState({ nouvelEmail: '', motDePasse: '' });
  const [codeEmail, setCodeEmail] = useState('');
  const [erreurEmail, setErreurEmail] = useState('');
  const [succesEmail, setSuccesEmail] = useState('');
  const [chargementEmail, setChargementEmail] = useState(false);

  // --- Changement de mot de passe ---
  const [passwordData, setPasswordData] = useState({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: '' });
  const [erreurPassword, setErreurPassword] = useState('');
  const [succesPassword, setSuccesPassword] = useState('');
  const [chargementPassword, setChargementPassword] = useState(false);

  const token = localStorage.getItem('token');

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

      if (!response.ok) throw new Error(data.message || "Erreur lors de l'upload.");

      setCommercant(data);
      setSucces('Photo mise à jour.');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setUploadEnCours(false);
    }
  };

  // --- Changement d'email ---
  const handleEmailChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleDemanderChangementEmail = async (e) => {
    e.preventDefault();
    setErreurEmail('');
    setSuccesEmail('');
    setChargementEmail(true);

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/profil/demander-changement-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors de la demande.');

      setSuccesEmail(data.message);
      setEtapeEmail(2);
    } catch (err) {
      setErreurEmail(err.message);
    } finally {
      setChargementEmail(false);
    }
  };

  const handleConfirmerChangementEmail = async (e) => {
    e.preventDefault();
    setErreurEmail('');
    setSuccesEmail('');
    setChargementEmail(true);

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/profil/confirmer-changement-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: codeEmail }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Code incorrect.');

      setCommercant(data);
      setSuccesEmail('Adresse email mise à jour avec succès.');
      setEtapeEmail(1);
      setEmailData({ nouvelEmail: '', motDePasse: '' });
      setCodeEmail('');
    } catch (err) {
      setErreurEmail(err.message);
    } finally {
      setChargementEmail(false);
    }
  };

  // --- Changement de mot de passe ---
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangerMotDePasse = async (e) => {
    e.preventDefault();
    setErreurPassword('');
    setSuccesPassword('');

    if (passwordData.nouveauMotDePasse !== passwordData.confirmation) {
      setErreurPassword('Les mots de passe ne correspondent pas.');
      return;
    }

    setChargementPassword(true);
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/profil/mot-de-passe', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ancienMotDePasse: passwordData.ancienMotDePasse,
          nouveauMotDePasse: passwordData.nouveauMotDePasse,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors du changement.');

      setSuccesPassword('Mot de passe modifié avec succès.');
      setPasswordData({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: '' });
    } catch (err) {
      setErreurPassword(err.message);
    } finally {
      setChargementPassword(false);
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
        <h2 className="profil-section-title">Adresse email</h2>
        <p className="profil-email-actuel">Email actuel : <strong>{commercant.email}</strong></p>

        {erreurEmail && <p className="profil-error">{erreurEmail}</p>}
        {succesEmail && <p className="profil-success">{succesEmail}</p>}

        {etapeEmail === 1 ? (
          <form className="profil-form" onSubmit={handleDemanderChangementEmail}>
            <label>
              Nouvelle adresse email
              <input
                type="email"
                name="nouvelEmail"
                value={emailData.nouvelEmail}
                onChange={handleEmailChange}
                required
              />
            </label>
            <label>
              Mot de passe actuel
              <input
                type="password"
                name="motDePasse"
                value={emailData.motDePasse}
                onChange={handleEmailChange}
                required
              />
            </label>
            <button type="submit" className="profil-save-btn" disabled={chargementEmail}>
              {chargementEmail ? 'Envoi...' : 'Recevoir un code de confirmation'}
            </button>
          </form>
        ) : (
          <form className="profil-form" onSubmit={handleConfirmerChangementEmail}>
            <label>
              Code reçu à {emailData.nouvelEmail}
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={codeEmail}
                onChange={(e) => setCodeEmail(e.target.value.replace(/\D/g, ''))}
                required
              />
            </label>
            <button type="submit" className="profil-save-btn" disabled={chargementEmail}>
              {chargementEmail ? 'Vérification...' : 'Confirmer le changement'}
            </button>
            <button
              type="button"
              className="profil-cancel-btn"
              onClick={() => {
                setEtapeEmail(1);
                setErreurEmail('');
                setSuccesEmail('');
              }}
            >
              Annuler
            </button>
          </form>
        )}
      </div>

      <div className="profil-section">
        <h2 className="profil-section-title">Mot de passe</h2>

        {erreurPassword && <p className="profil-error">{erreurPassword}</p>}
        {succesPassword && <p className="profil-success">{succesPassword}</p>}

        <form className="profil-form" onSubmit={handleChangerMotDePasse}>
          <label>
            Mot de passe actuel
            <input
              type="password"
              name="ancienMotDePasse"
              value={passwordData.ancienMotDePasse}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <label>
            Nouveau mot de passe
            <input
              type="password"
              name="nouveauMotDePasse"
              value={passwordData.nouveauMotDePasse}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />
          </label>
          <label>
            Confirmer le nouveau mot de passe
            <input
              type="password"
              name="confirmation"
              value={passwordData.confirmation}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />
          </label>
          <button type="submit" className="profil-save-btn" disabled={chargementPassword}>
            {chargementPassword ? 'Modification...' : 'Changer le mot de passe'}
          </button>
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