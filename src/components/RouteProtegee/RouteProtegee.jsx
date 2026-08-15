
import { Navigate } from 'react-router-dom';
import { useCommercant } from '../../context/CommercantContext';

function RouteProtegee({ children }) {
  const token = localStorage.getItem('token');
  const { commercant, chargement } = useCommercant();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // On attend que le contexte ait fini de charger avant de décider
  if (chargement) {
    return null; // ou un petit loader si tu préfères
  }

  if (commercant) {
    const planActuel = commercant.plan || 'gratuit';
    const maintenant = new Date();

    const essaiExpire =
      planActuel === 'gratuit' &&
      commercant.dateFinEssai &&
      maintenant > new Date(commercant.dateFinEssai);

    const abonnementExpire =
      ['mensuel', 'annuel'].includes(planActuel) &&
      (!commercant.dateFinAbonnement || maintenant > new Date(commercant.dateFinAbonnement));

    if (essaiExpire || abonnementExpire) {
      return <Navigate to="/abonnement" replace />;
    }
  }

  return children;
}

export default RouteProtegee;