export function estAbonnementBloque(commercant) {
  if (!commercant) return false;
  if (commercant.role === 'superadmin') return false;

  const planActuel = commercant.plan || 'gratuit';
  const maintenant = new Date();

  if (planActuel === 'gratuit') {
    return commercant.dateFinEssai && maintenant > new Date(commercant.dateFinEssai);
  }

  if (['mensuel', 'annuel'].includes(planActuel)) {
    return !commercant.dateFinAbonnement || maintenant > new Date(commercant.dateFinAbonnement);
  }

  return false;
}