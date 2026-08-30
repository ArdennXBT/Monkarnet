import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCommercant } from '../../context/CommercantContext';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { API_URL } from '../../config';
import './Abonnement.css';

function Abonnement() {
  const { commercant, chargement, rechargerCommercant } = useCommercant();
  const [searchParams, setSearchParams] = useSearchParams();
  const [chargementPaiement, setChargementPaiement] = useState(false);
  const [verificationRetour, setVerificationRetour] = useState(false);
  const [succesConfirme, setSuccesConfirme] = useState(false);
  const [erreur, setErreur] = useState('');
  const pollingRef = useRef(null);

  const token = localStorage.getItem('token');
  const paiementReussi = searchParams.get('paiement') === 'succes';

  // Nettoyage du polling si le composant est démonté
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Si on revient du checkout Dodo (?paiement=succes), on vérifie que le
  // webhook a bien mis à jour le plan côté backend, puis on nettoie l'URL.
  useEffect(() => {
    if (!paiementReussi) return;

    setVerificationRetour(true);
    let tentatives = 0;
    const maxTentatives = 15; // 15 x 2s = 30s max, le webhook arrive généralement en 1-2s

    pollingRef.current = setInterval(async () => {
      tentatives++;

      try {
        const response = await fetch(`${API_URL}/api/abonnement/statut`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const planActif = data?.plan && ['mensuel', 'annuel'].includes(data.plan);

        if (planActif) {
          clearInterval(pollingRef.current);
          await rechargerCommercant(); // synchronise le contexte global
          setVerificationRetour(false);
          setSuccesConfirme(true);
          setSearchParams({}, { replace: true }); // retire ?paiement=succes de l'URL
          return;
        }
      } catch (err) {
        // on continue à retenter silencieusement
      }

      if (tentatives >= maxTentatives) {
        clearInterval(pollingRef.current);
        setVerificationRetour(false);
        // on laisse ?paiement=succes : le webhook a peut-être juste pris plus de temps
      }
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paiementReussi]);

  const handleSouscrire = async (plan) => {
    setErreur('');
    setChargementPaiement(true);

    try {
      const response = await fetch(`${API_URL}/api/abonnement/souscrire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur lors de l'initialisation du paiement.");

      // Redirection vers la page de paiement sécurisée hébergée par Dodo
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setErreur(err.message);
      setChargementPaiement(false);
    }
  };

  if (chargement || !commercant) {
    return <p className="abonnement-loading">Chargement...</p>;
  }

  const planActuel = commercant.plan || 'gratuit';
  const joursRestants = commercant.essaiJoursRestants;

  // --- Écran d'attente pendant qu'on confirme le retour de paiement ---
  if (verificationRetour) {
    return (
      <div className="abonnement">
        <div className="abonnement-attente">
          <Loader2 className="abonnement-spinner" size={40} />
          <h2>Confirmation du paiement...</h2>
          <p>Merci de patienter quelques secondes pendant qu'on active votre abonnement.</p>
        </div>
      </div>
    );
  }

  // --- Écran de succès si l'abonnement vient d'être activé ---
  if (succesConfirme) {
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

      {erreur && <p className="abonnement-error">{erreur}</p>}

      <p className="abonnement-intro">Choisissez la formule qui vous convient :</p>

      <div className="abonnement-grid">
        <div className="abonnement-card">
          <h3 className="abonnement-nom">Mensuel</h3>
          <p className="abonnement-texte">Facturé chaque mois, sans engagement.</p>

          <div className="abonnement-prix-row">
            <span className="abonnement-prix">6,99 $</span>
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
            onClick={() => handleSouscrire('mensuel')}
            disabled={chargementPaiement}
          >
            {chargementPaiement ? 'Redirection...' : 'Choisir ce plan'}
          </button>
        </div>

        <div className="abonnement-card abonnement-card-highlighted">
          <span className="abonnement-discount">- 40%</span>

          <h3 className="abonnement-nom">Annuel</h3>
          <p className="abonnement-texte">Payez une fois par an et économisez.</p>

          <div className="abonnement-prix-row">
            <span className="abonnement-prix">49,99 $</span>
            <span className="abonnement-periode">/ an</span>
          </div>
          <p className="abonnement-old-prix">
            au lieu de <s>84 $</s> — soit 40% d'économie
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
              <span>34 $ d'économie sur l'année</span>
            </li>
          </ul>

          <button
            className="abonnement-btn abonnement-btn-filled"
            onClick={() => handleSouscrire('annuel')}
            disabled={chargementPaiement}
          >
            {chargementPaiement ? 'Redirection...' : 'Choisir ce plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Abonnement;