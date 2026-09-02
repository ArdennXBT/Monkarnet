import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Store, ArrowRight } from 'lucide-react';
import { GOOGLE_CLIENT_ID } from '../../config';
import './Inscription.css';

function Inscription() {
  const [showPassword, setShowPassword] = useState(false);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    motDePasse: '',
    nomCommerce: '',
  });
  const navigate = useNavigate();
  const hiddenGoogleBtnRef = useRef(null);

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
    const initGoogle = () => {
      if (!window.google || !hiddenGoogleBtnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(hiddenGoogleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'signup_with',
      });
    };

    if (window.google) {
      initGoogle();
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initGoogle();
        }
      }, 100);

      // Sécurité
      setTimeout(() => clearInterval(checkGoogle), 5000);
    }
  }, []);

  const handleCustomGoogleClick = () => {
    const nativeBtn = hiddenGoogleBtnRef.current?.querySelector('div[role="button"]');
    if (nativeBtn) {
      nativeBtn.click();
    } else {
      setErreur('Bouton Google non prêt. Réessaie dans une seconde.');
    }
  };

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
        body: JSON.stringify({
          nomComplet: `${formData.prenom.trim()} ${formData.nom.trim()}`.trim(),
          email: formData.email,
          motDePasse: formData.motDePasse,
          nomCommerce: formData.nomCommerce,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription.");
      }

      navigate('/verifier-email', { state: { email: formData.email } });
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="inscription">
      <div className="inscription-card">
        <span className="inscription-logo">
          <img src="/logo-orbizo-icon.svg" alt="" className="inscription-logo-icon" />
          Orbizo
        </span>
        <h1 className="inscription-title">Créer un compte</h1>
        <p className="inscription-subtitle"></p>

        <button
          type="button"
          className="inscription-google-custom"
          onClick={handleCustomGoogleClick}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          S'inscrire avec Google
        </button>

        {/* Bouton Google natif caché */}
        <div ref={hiddenGoogleBtnRef} className="inscription-google-hidden"></div>

        <div className="inscription-divider"><span>ou</span></div>

        {erreur && <p className="inscription-error">{erreur}</p>}

        <form className="inscription-form" onSubmit={handleSubmit}>
          <div className="inscription-row">
            <label>
              Prénom
              <div className="inscription-input-wrapper">
                <User size={16} className="inscription-input-icon" />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Ren"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>
            <label>
              Nom
              <div className="inscription-input-wrapper">
                <User size={16} className="inscription-input-icon" />
                <input
                  type="text"
                  name="nom"
                  placeholder="Suxi"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>
          </div>

          <label>
            Email
            <div className="inscription-input-wrapper">
              <Mail size={16} className="inscription-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="vous@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <label>
            Mot de passe
            <div className="inscription-input-wrapper">
              <Lock size={16} className="inscription-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="motDePasse"
                placeholder="6 caractères minimum"
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label>
            Nom du commerce
            <div className="inscription-input-wrapper">
              <Store size={16} className="inscription-input-icon" />
              <input
                type="text"
                name="nomCommerce"
                placeholder="Boutique Ren"
                value={formData.nomCommerce}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <button type="submit" className="inscription-submit" disabled={chargement}>
            {chargement ? 'Création...' : (
              <>
                Créer mon compte
                <ArrowRight size={16} />
              </>
            )}
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