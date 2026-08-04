
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { GOOGLE_CLIENT_ID } from '../../config';
import './Inscription.css';

function Inscription() {
  const [showPassword, setShowPassword] = useState(false);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    motDePasse: '',
    nomCommerce: '',
    typeCommerce: '',
    adresse: '',
    telephone: '',
  });
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  const handleGoogleResponse = async (response) => {
    setErreur('');
    try {
      const res = await fetch('https://monkarnet-backend.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erreur de connexion Google.');

      localStorage.setItem('token', data.token);
      localStorage.setItem('commercant', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setErreur(err.message);
    }
  };

  useEffect(() => {
    if (window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 340,
        text: 'signup_with',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/auth/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription.");
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('commercant', JSON.stringify(data));

      navigate('/dashboard');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="inscription">
      <div className="inscription-card">
        <span className="inscription-logo">Comerza</span>
        <h1 className="inscription-title">Créer votre compte</h1>
        <p className="inscription-subtitle">Gratuit, sans engagement.</p>

        <div ref={googleBtnRef} className="inscription-google-btn"></div>

        <div className="inscription-divider"><span>ou</span></div>

        {erreur && <p className="inscription-error">{erreur}</p>}

        <form className="inscription-form" onSubmit={handleSubmit}>
          <div className="inscription-section-label">Vos informations</div>
          <label>
            Nom complet
            <input
              type="text"
              name="nomComplet"
              placeholder="Votre nom"
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
              placeholder="vous@exemple.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Mot de passe
            <div className="inscription-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="motDePasse"
                placeholder="••••••••"
                value={formData.motDePasse}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="inscription-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <div className="inscription-section-label">Votre commerce</div>
          <label>
            Nom du commerce
            <input
              type="text"
              name="nomCommerce"
              placeholder="Ex: Chez Rosine"
              value={formData.nomCommerce}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Type de commerce
            <input
              type="text"
              name="typeCommerce"
              placeholder="Ex: Restaurant, Boutique..."
              value={formData.typeCommerce}
              onChange={handleChange}
            />
          </label>
          <label>
            Adresse
            <input
              type="text"
              name="adresse"
              placeholder="Adresse du commerce"
              value={formData.adresse}
              onChange={handleChange}
            />
          </label>
          <label>
            Téléphone
            <input
              type="tel"
              name="telephone"
              placeholder="+229 ..."
              value={formData.telephone}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="inscription-submit" disabled={chargement}>
            {chargement ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="inscription-footer">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default Inscription;