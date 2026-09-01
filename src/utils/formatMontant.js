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
  const locale = LOCALES[deviseCode] || 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: deviseCode,
    minimumFractionDigits: deviseCode === 'XOF' ? 0 : 2,
    maximumFractionDigits: deviseCode === 'XOF' ? 0 : 2,
  }).format(montant || 0);
}