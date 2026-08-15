import { useState, useEffect, useRef } from 'react';
import { useCommercant } from '../../context/CommercantContext';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { API_URL } from '../../config';
import './Abonnement.css';

const OPERATEURS = [
  { value: 'mtn', label: 'MTN Money' },
  { value: 'moov', label: 'Moov Money' },
  { value: 'orange', label: 'Orange Money' },
  { value: 'wav', label: 'Wave' },
];

function Abonnement() {
  const { commercant, chargement, rechargerCommercant } = useCommercant();
  const [planChoisi, setPlanChoisi] = useState(null); // 'mensuel' | 'annuel' | null
  const [telephone, setTelephone] = useState('');
  const [operateur, setOperateur] = useState('');
  const [chargementPaiement, setChargementPaiement] = useState(false);
  const [enAttentePaiement, setEnAttentePaiement] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [erreur, setErreur] = useState('');
  const pollingRef = useRef(null);

  const token = localStorage.getItem('token');

  // Nettoyage du polling si le composant est démonté
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const demarrerPolling = (txId) => {
    let tentatives = 0;
    const maxTentatives = 40; // 40 x 3s = 2 minutes max

    pollingRef.current = setInterval(async () => {
      tentatives++;

      try {
        const response = await fetch(`${API_URL}/api/abonnement/transaction/${txId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.statut === 'approved') {
          clearInterval(pollingRef.current);
          setEnAttentePaiement(false);
          await rechargerCommercant();
        } else if (data.statut === 'rejected') {
          clearInterval(pollingRef.current);
          setEnAttentePaiement(false);
          setErreur('Le paiement a été refusé ou annulé. Réessayez.');
        }
      } catch (err) {
        // on continue à retenter silencieusement
      }

      if (tentatives >= maxTentatives) {
        clearInterval(pollingRef.current);
        setEnAttentePaiement(false);
        setErreur('Le paiement prend plus de temps que prévu. Vérifiez votre téléphone ou réessayez.');
      }
    }, 3000);
  };

  const handleSouscrire = async (e) => {
    e.preventDefault();
    setErreur('');

    if (!telephone || !operateur) {
      setErreur('Veuillez renseigner votre numéro et votre opérateur.');
      return;
    }

    setChargementPaiement(true);

    try {
      const response = await fetch(`${API_URL}/api/abonnement/souscrire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planChoisi, phone: telephone, operator: operateur }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur lors de l'initialisation du paiement.");

      setTransactionId(data.transactionId);
      setEnAttentePaiement(true);
      demarrerPolling(data.transactionId);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargementPaiement(false);
    }
  };

  if (chargement || !commercant) {
    return <p className="abonnement-loading">Chargement...</p>;
  }

  const planActuel = commercant.plan || 'gratuit';
  const joursRestants = commercant.essaiJoursRestants;

  // --- Écran d'attente de validation du paiement sur le téléphone ---
  if (enAttentePaiement) {
    return (
      <div className="abonnement">
        <div className="abonnement-attente">
          <Loader2 className="abonnement-spinner" size={40} />
          <h2>Validez le paiement sur votre téléphone</h2>
          <p>
            Une notification a été envoyée au {telephone}. Composez le code USSD reçu ou validez la
            demande pour confirmer votre abonnement.
          </p>
          {erreur && <p className="abonnement-error">{erreur}</p>}
        </div>
      </div>
    );
  }

  // --- Écran de succès si l'abonnement vient d'être activé ---
  if (['mensuel', 'annuel'].includes(planActuel) && transactionId) {
    return (
      <div className="abonnement">
        <div className="abonnement-succes">
          <CheckCircle2 size={48} strokeWidth={2} />
          <h2>Abonnement activé !</h2>
          <p>Merci, votre plan {planActuel} est maintenant actif.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="abonnement">
      <h1 className="abonnement-title">Abonnement</h1>
      <p className="abonnement-subtitle">Gérez votre formule et vos paiements.</p>

      <div className="abonnement-statut-card">
        <div>
          <p className="abonnement-statut-nom">
            {planActuel === 'gratuit'
              ? 'Essai gratuit'
              : planActuel === 'mensuel'
              ? 'Plan Mensuel'
              : 'Plan Annuel'}
          </p>
          <p className="abonnement-statut-desc">
            {planActuel === 'gratuit'
              ? joursRestants != null
                ? joursRestants > 0
                  ? `Il vous reste ${joursRestants} jour${joursRestants > 1 ? 's' : ''} d'essai gratuit.`
                  : "Votre période d'essai est terminée."
                : "Vous profitez actuellement de l'essai gratuit de 14 jours."
              : 'Votre abonnement est actif.'}
          </p>
        </div>
        <span className="abonnement-statut-badge">
          {planActuel === 'gratuit' && joursRestants === 0 ? 'Expiré' : 'Actif'}
        </span>
      </div>

      {!planChoisi ? (
        <>
          <p className="abonnement-intro">Choisissez la formule qui vous convient :</p>

          <div className="abonnement-grid">
            <div className="abonnement-card">
              <h3 className="abonnement-nom">Mensuel</h3>
              <p className="abonnement-texte">Facturé chaque mois, sans engagement.</p>

              <div className="abonnement-prix-row">
                <span className="abonnement-prix">4 200 F</span>
                <span className="abonnement-periode">/ mois</span>
              </div>

              <ul className="abonnement-points">
                <li>
                  <CheckCircle2 size={16} strokeWidth={2} />
                  <span>Dashboard, commandes, produits et clients</span>
                </li>
                <li>
                  <CheckCircle2 size={16} strokeWidth={2} />
                  <span>Jusqu'à 5 sous-comptes</span>
                </li>
                <li>
                  <CheckCircle2 size={16} strokeWidth={2} />
                  <span>Résiliation possible à tout moment</span>
                </li>
              </ul>

              <button
                className="abonnement-btn abonnement-btn-outline"
                onClick={() => setPlanChoisi('mensuel')}
              >
                Choisir ce plan
              </button>
            </div>

            <div className="abonnement-card abonnement-card-highlighted">
              <span className="abonnement-discount">- 40%</span>

              <h3 className="abonnement-nom">Annuel</h3>
              <p className="abonnement-texte">Payez une fois par an et économisez.</p>

              <div className="abonnement-prix-row">
                <span className="abonnement-prix">30 240 F</span>
                <span className="abonnement-periode">/ an</span>
              </div>
              <p className="abonnement-old-prix">
                au lieu de <s>50 400 F</s> — soit 40% d'économie
              </p>

              <ul className="abonnement-points">
                <li>
                  <CheckCircle2 size={16} strokeWidth={2} />
                  <span>Dashboard, commandes, produits et clients</span>
                </li>
                <li>
                  <CheckCircle2 size={16} strokeWidth={2} />
                  <span>Jusqu'à 5 sous-comptes</span>
                </li>
                <li>
                  <CheckCircle2 size={16} strokeWidth={2} />
                  <span>20 160 F d'économie sur l'année</span>
                </li>
              </ul>

              <button
                className="abonnement-btn abonnement-btn-filled"
                onClick={() => setPlanChoisi('annuel')}
              >
                Choisir ce plan
              </button>
            </div>
          </div>
        </>
      ) : (
        <form className="abonnement-form-paiement" onSubmit={handleSouscrire}>
          <h3>
            Paiement — Plan {planChoisi === 'mensuel' ? 'Mensuel (4 200 F)' : 'Annuel (30 240 F)'}
          </h3>

          <label>
            Numéro de téléphone Mobile Money
            <input
              type="tel"
              placeholder="Ex: 22997000000"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </label>

          <label>
            Opérateur
            <select value={operateur} onChange={(e) => setOperateur(e.target.value)} required>
              <option value="">Sélectionnez votre opérateur</option>
              {OPERATEURS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </label>

          {erreur && <p className="abonnement-error">{erreur}</p>}

          <div className="abonnement-form-actions">
            <button
              type="button"
              className="abonnement-btn abonnement-btn-outline"
              onClick={() => setPlanChoisi(null)}
              disabled={chargementPaiement}
            >
              Retour
            </button>
            <button
              type="submit"
              className="abonnement-btn abonnement-btn-filled"
              disabled={chargementPaiement}
            >
              {chargementPaiement ? 'Envoi en cours...' : 'Payer maintenant'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Abonnement;