export const DEVISES = [
  { code: 'USD', label: 'Dollar américain', symbole: '$' },
  { code: 'EUR', label: 'Euro', symbole: '€' },
  { code: 'XOF', label: 'Franc CFA (XOF)', symbole: 'F' },
  { code: 'MAD', label: 'Dirham marocain', symbole: 'DH' },
  { code: 'DZD', label: 'Dinar algérien', symbole: 'DA' },
  { code: 'EGP', label: 'Livre égyptienne', symbole: 'E£' },
  { code: 'GBP', label: 'Livre sterling', symbole: '£' },
  { code: 'CAD', label: 'Dollar canadien', symbole: 'CA$' },
  { code: 'CHF', label: 'Franc suisse', symbole: 'CHF' },
];

export function getDevise(code) {
  return DEVISES.find((d) => d.code === code) || DEVISES[0];
}