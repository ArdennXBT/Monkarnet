import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCommercant } from '../../context/CommercantContext';
import { estAbonnementBloque } from '../../utils/abonnement';
import './AccesAbonnementRequis.css';

function AccesAbonnementRequis({ children }) {
  const { commercant, chargement } = useCommercant();
  const navigate = useNavigate();

  // On affiche le loader seulement si on charge ET qu'on n'a encore aucune donnée
  if (chargement && !commercant) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
        }}
      >
        Chargement...
      </div>
    );
  }

  // Si après chargement on n'a toujours pas de commercant, on laisse passer
  // (RouteProtegee s'occupe déjà de la redirection si pas de token)
  if (!commercant) {
    return children;
  }

  const bloque = estAbonnementBloque(commercant);

  if (!bloque) {
    return children;
  }

  return (
    <div className="verrou-abonnement">
      <div className="verrou-abonnement-contenu">
        <div className="verrou-abonnement-icone">
          <Lock size={32} strokeWidth={2} />
        </div>
        <h2>Abonnement requis</h2>
        <p>
          Votre période d'essai gratuite est terminée. Souscrivez à un abonnement
          pour continuer à utiliser cette fonctionnalité.
        </p>
        <button className="verrou-abonnement-btn" onClick={() => navigate('/abonnement')}>
          Voir les abonnements
        </button>
      </div>
    </div>
  );
}

export default AccesAbonnementRequis;