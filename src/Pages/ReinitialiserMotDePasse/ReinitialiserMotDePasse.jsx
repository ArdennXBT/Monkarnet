import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './ReinitialiserMotDePasse.css';

function ReinitialiserMotDePasse() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (!email) navigate('/mot-de-passe-oublie');
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setSucces('');

    if (nouveauMotDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }

    setChargement(true);
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/auth/reinitialiser-mot-de-passe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, nouveauMotDePasse }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors de la réinitialisation.');

      setSucces('Mot de passe réinitialisé. Redirection...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="reset-mdp">
      <div className="reset-mdp-card">
        <span className="reset-mdp-logo">Orbizo</span>
        <h1 className="reset-mdp-title">Nouveau mot de passe</h1>
        <p className="reset-mdp-subtitle">
          Entrez le code reçu à <strong>{email}</strong> et votre nouveau mot de passe.
        </p>

        {erreur && <p className="reset-mdp-error">{erreur}</p>}
        {succes && <p className="reset-mdp-success">{succes}</p>}

        <form className="reset-mdp-form" onSubmit={handleSubmit}>
          <label>
            Code reçu par email
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
            />
          </label>
          <label>
            Nouveau mot de passe
            <div className="reset-mdp-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="reset-mdp-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>
          <label>
            Confirmer le mot de passe
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
              minLength={6}
            />
          </label>
          <button type="submit" className="reset-mdp-submit" disabled={chargement}>
            {chargement ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <p className="reset-mdp-footer">
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}

export default ReinitialiserMotDePasse;