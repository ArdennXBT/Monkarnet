import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCommercant } from '../../context/CommercantContext';
import { necessiteAbonnementPayant } from '../../utils/abonnement';
import './AccesPayantRequis.css';

function AccesPayantRequis({ children }) {
  const { commercant, chargement } = useCommercant();
  const navigate = useNavigate();

  if (chargement || !commercant) return null;

  const bloque = necessiteAbonnementPayant(commercant);

  if (!bloque) {
    return children;
  }

  return (
    <div className="verrou-payant">
      <div className="verrou-payant-contenu">
        <div className="verrou-payant-icone">
          <Lock size={32} strokeWidth={2} />
        </div>
        <h2>Fonctionnalité réservée aux abonnés</h2>
        <p>
          La gestion des sous-comptes est disponible uniquement avec un abonnement
          Mensuel ou Annuel — même pendant votre période d'essai.
        </p>
        <button className="verrou-payant-btn" onClick={() => navigate('/abonnement')}>
          Voir les abonnements
        </button>
      </div>
    </div>
  );
}

export default AccesPayantRequis;