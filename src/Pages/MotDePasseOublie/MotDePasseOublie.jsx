import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './MotDePasseOublie.css';

function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/auth/mot-de-passe-oublie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors de la demande.');

      setEnvoye(true);
      setTimeout(() => {
        navigate('/reinitialiser-mot-de-passe', { state: { email } });
      }, 1500);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="mdp-oublie">
      <div className="mdp-oublie-card">
        <span className="mdp-oublie-logo">Orbizo</span>
        <h1 className="mdp-oublie-title">Mot de passe oublié</h1>
        <p className="mdp-oublie-subtitle">
          Entrez votre adresse email, nous vous enverrons un code pour réinitialiser votre mot de passe.
        </p>

        {erreur && <p className="mdp-oublie-error">{erreur}</p>}
        {envoye && <p className="mdp-oublie-success">Code envoyé, redirection...</p>}

        <form className="mdp-oublie-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="mdp-oublie-submit" disabled={chargement}>
            {chargement ? 'Envoi...' : 'Envoyer le code'}
          </button>
        </form>

        <p className="mdp-oublie-footer">
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}

export default MotDePasseOublie;