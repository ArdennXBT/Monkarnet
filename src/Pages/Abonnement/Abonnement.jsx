import { useState } from 'react';
import { useCommercant } from '../../context/CommercantContext';
import { CheckCircle2 } from 'lucide-react';
import './Abonnement.css';

function Abonnement() {
  const { commercant, chargement } = useCommercant();
  const [chargementPlan, setChargementPlan] = useState(null); // 'mensuel' | 'annuel' | null
  const [erreur, setErreur] = useState('');

  const token = localStorage.getItem('token');

  const handleSouscrire = async (plan) => {
    setErreur('');
    setChargementPlan(plan);

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/abonnement/souscrire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur lors de l'initialisation du paiement.");

      if (data.urlPaiement) {
        window.location.href = data.urlPaiement;
      }
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargementPlan(null);
    }
  };

  if (chargement || !commercant) {
    return <p className="abonnement-loading">Chargement...</p>;
  }

  const planActuel = commercant.plan || 'gratuit';
  const joursRestants = commercant.essaiJoursRestants; // à fournir par le backend

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
                ? `Il vous reste ${joursRestants} jour${joursRestants > 1 ? 's' : ''} d'essai gratuit.`
                : "Vous profitez actuellement de l'essai gratuit de 14 jours."
              : 'Votre abonnement est actif.'}
          </p>
        </div>
        <span className="abonnement-statut-badge">Actif</span>
      </div>

      {erreur && <p className="abonnement-error">{erreur}</p>}

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
            onClick={() => handleSouscrire('mensuel')}
            disabled={chargementPlan !== null}
          >
            {chargementPlan === 'mensuel' ? 'Redirection...' : 'Choisir ce plan'}
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
            onClick={() => handleSouscrire('annuel')}
            disabled={chargementPlan !== null}
          >
            {chargementPlan === 'annuel' ? 'Redirection...' : 'Choisir ce plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Abonnement;