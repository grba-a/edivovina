/**
 * Cijene, jedno mjesto.
 *
 * Bio je kopiran verbatim u Dive.tsx i Shop.tsx, oba s hrvatskim zarezom. Sa sedam
 * stranica koje citiraju cijene to je sedam mjesta za drift.
 *
 * Engleska decimalna TOCKA, ne zarez — i to nije moja odluka nego njihova: njihov
 * vlastiti cutaway dijagram pise „glass bottle, 0.75L", a Woo im renderira
 * „€382.00". Kroz Intl bi ovisilo o CLDR-u runtimea.
 */
export const eur = (n: number) =>
  '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2))

/** „€382.00" — kako Woo ispisuje cijenu u `.woocommerce-Price-amount`. */
export const eurWoo = (n: number) => '€' + n.toFixed(2)
