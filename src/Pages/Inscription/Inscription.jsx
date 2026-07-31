
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Inscription.css';

function Inscription() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="inscription">
      <div className="inscription-card">
        <span className="inscription-logo">Monkarnet</span>
        <h1 className="inscription-title">Créer votre compte</h1>
        <p className="inscription-subtitle">Gratuit, sans engagement.</p>

        <button type="button" className="inscription-google">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continuer avec Google
        </button>

        <div className="inscription-divider"><span>ou</span></div>

        <form className="inscription-form">
          <div className="inscription-section-label">Vos informations</div>
          <label>
            Nom complet
            <input type="text" placeholder="Votre nom" />
          </label>
          <label>
            Email
            <input type="email" placeholder="vous@exemple.com" />
          </label>
          <label>
            Mot de passe
            <div className="inscription-password-wrapper">
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
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
            <input type="text" placeholder="Ex: Chez Rosine" />
          </label>
          <label>
            Type de commerce
            <input type="text" placeholder="Ex: Restaurant, Boutique..." />
          </label>
          <label>
            Adresse
            <input type="text" placeholder="Adresse du commerce" />
          </label>
          <label>
            Téléphone
            <input type="tel" placeholder="+229 ..." />
          </label>

          <button type="submit" className="inscription-submit">Créer mon compte</button>
        </form>

        <p className="inscription-footer">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default Inscription;