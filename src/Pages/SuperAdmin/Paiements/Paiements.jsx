
import { CreditCard } from 'lucide-react';
import './Paiements.css';

function Paiements() {
  return (
    <div className="paiements">
      <h1 className="paiements-title">Paiements</h1>
      <p className="paiements-subtitle">Vue d'ensemble des abonnements et paiements.</p>

      <div className="paiements-empty">
        <div className="paiements-empty-icon">
          <CreditCard size={28} />
        </div>
        <p className="paiements-empty-title">Aucun paiement pour l'instant</p>
        <p className="paiements-empty-text">
          Tous les commerces sont actuellement sur le plan gratuit. Cette section s'activera automatiquement dès le lancement des plans payants.
        </p>
      </div>
    </div>
  );
}

export default Paiements;