const LOCALES = {
  USD: 'en-US',
  EUR: 'fr-FR',
  XOF: 'fr-FR',
  MAD: 'fr-MA',
  DZD: 'fr-DZ',
  EGP: 'ar-EG',
  GBP: 'en-GB',
  CAD: 'fr-CA',
  CHF: 'fr-CH',
};

export function formatMontant(montant, deviseCode = 'USD') {
  const valeur = montant || 0;

  // Le Franc CFA (XOF) n'a pas de symbole monétaire universellement reconnu
  // par Intl selon les navigateurs : certains affichent le code ISO "XOF"
  // au lieu de "FCFA". On le formate donc à la main pour garantir le bon
  // affichage partout, plutôt que de compter sur le style 'currency'.
  if (deviseCode === 'XOF') {
    const nombre = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valeur);
    return `${nombre} F`;
  }

  const locale = LOCALES[deviseCode] || 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: deviseCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valeur);
}