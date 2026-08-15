import { Navigate } from 'react-router-dom';
import { useCommercant } from '../../context/CommercantContext';

function RouteProtegee({ children }) {
  const token = localStorage.getItem('token');
  const { commercant, chargement } = useCommercant();

  // Pas de token → redirection login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Encore en train de charger le profil
  if (chargement) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '18px'
      }}>
        Chargement...
      </div>
    );
  }

  // Si on a les infos du commerçant
  if (commercant) {
    const role = (commercant.role || '').toLowerCase();

    // Superadmin / admin → accès total, on ne touche à rien
    if (role === 'superadmin' || role === 'admin') {
      return children;
    }

    const planActuel = commercant.plan || 'gratuit';
    const maintenant = new Date();

    const essaiExpire =
      planActuel === 'gratuit' &&
      commercant.dateFinEssai &&
      maintenant > new Date(commercant.dateFinEssai);

    const abonnementExpire =
      ['mensuel', 'annuel'].includes(planActuel) &&
      (!commercant.dateFinAbonnement || maintenant > new Date(commercant.dateFinAbonnement));

    // Essai ou abonnement expiré → on envoie vers la page abonnement
    // (sauf si on est déjà sur la page abonnement)
    if ((essaiExpire || abonnementExpire) && window.location.pathname !== '/abonnement') {
      return <Navigate to="/abonnement" replace />;
    }
  }

  return children;
}

export default RouteProtegee;