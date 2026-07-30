
import { Link } from 'react-router-dom';
import './Inscription.css';

function Inscription() {
  return (
    <div className="inscription">
      <div className="inscription-card">
        <span className="inscription-logo">Monkarnet</span>
        <h1 className="inscription-title">Créer votre compte</h1>
        <p className="inscription-subtitle">Gratuit, sans engagement.</p>

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
            <input type="password" placeholder="••••••••" />
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