import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VerifierEmail.css';

function VerifierEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [chiffres, setChiffres] = useState(['', '', '', '', '', '']);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [renvoiEnCours, setRenvoiEnCours] = useState(false);
  const [messageRenvoi, setMessageRenvoi] = useState('');
  const inputsRef = useRef([]);

  useEffect(() => {
    // Si quelqu'un arrive directement sur cette page sans passer par l'inscription
    if (!email) navigate('/inscription');
  }, [email, navigate]);

  const handleChangeChiffre = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const nouveauxChiffres = [...chiffres];
    nouveauxChiffres[index] = value;
    setChiffres(nouveauxChiffres);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !chiffres[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const collé = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (collé.length === 6) {
      setChiffres(collé.split(''));
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    const code = chiffres.join('');

    if (code.length !== 6) {
      setErreur('Veuillez entrer les 6 chiffres du code.');
      return;
    }

    setChargement(true);
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/auth/verifier-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Code incorrect.');

      localStorage.setItem('token', data.token);
      localStorage.setItem('commercant', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  const handleRenvoyer = async () => {
    setErreur('');
    setMessageRenvoi('');
    setRenvoiEnCours(true);
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/auth/renvoyer-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur lors de l'envoi.");

      setMessageRenvoi('Un nouveau code a été envoyé.');
      setChiffres(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setErreur(err.message);
    } finally {
      setRenvoiEnCours(false);
    }
  };

  return (
    <div className="verifier-email">
      <div className="verifier-email-card">
        <span className="verifier-email-logo">Orbizo</span>
        <h1 className="verifier-email-title">Vérifiez votre email</h1>
        <p className="verifier-email-subtitle">
          Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
        </p>

        {erreur && <p className="verifier-email-error">{erreur}</p>}
        {messageRenvoi && <p className="verifier-email-success">{messageRenvoi}</p>}

        <form className="verifier-email-form" onSubmit={handleSubmit}>
          <div className="verifier-email-inputs" onPaste={handlePaste}>
            {chiffres.map((chiffre, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={chiffre}
                onChange={(e) => handleChangeChiffre(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button type="submit" className="verifier-email-submit" disabled={chargement}>
            {chargement ? 'Vérification...' : 'Vérifier'}
          </button>
        </form>

        <p className="verifier-email-footer">
          Vous n'avez rien reçu ?{' '}
          <button
            type="button"
            className="verifier-email-renvoyer"
            onClick={handleRenvoyer}
            disabled={renvoiEnCours}
          >
            {renvoiEnCours ? 'Envoi...' : 'Renvoyer le code'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default VerifierEmail;