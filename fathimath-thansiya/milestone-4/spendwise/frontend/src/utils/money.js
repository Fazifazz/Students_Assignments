/**
 * Money helpers.
 *
 * SpendWise stores every monetary amount as an integer number of minor units
 * (paise). Floats never enter the data model — only at the input boundary,
 * where a decimal string is converted exactly into paise.
 */

export const MINOR_UNITS_PER_MAJOR = 100;

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Indian short-scale notation for chart axes: ₹25K / ₹1.2L / ₹1.5Cr.
 * Intl's `en-IN` compact form renders thousands as "T", which reads poorly.
 */
export function formatCompactCurrency(minorUnits) {
  const rupees = Math.abs(toMajor(minorUnits));
  const sign = toMajor(minorUnits) < 0 ? '−' : '';

  if (rupees >= 10000000) return `${sign}₹${(rupees / 10000000).toFixed(1)}Cr`;
  if (rupees >= 100000) return `${sign}₹${(rupees / 100000).toFixed(1)}L`;
  if (rupees >= 1000) return `${sign}₹${(rupees / 1000).toFixed(0)}K`;
  return `${sign}₹${rupees.toFixed(0)}`;
}

const numberFormatter = new Intl.NumberFormat('en-IN');

/** Convert paise to a major-unit number (rupees). Safe for display only. */
export function toMajor(minorUnits) {
  return Number(minorUnits || 0) / MINOR_UNITS_PER_MAJOR;
}

/** Format paise as INR, e.g. 125000 -> "₹1,250.00". */
export function formatCurrency(minorUnits, { showSign = false } = {}) {
  const value = toMajor(minorUnits);
  const formatted = inrFormatter.format(Math.abs(value));
  if (!showSign || value === 0) return formatted;
  return `${value > 0 ? '+' : '−'}${formatted}`;
}

/** Grouped number without a currency symbol. */
export function formatNumber(value) {
  return numberFormatter.format(Number(value || 0));
}

/**
 * Parse a user-typed rupee string into integer paise.
 * Returns null when the input is not a valid positive amount.
 */
export function parseAmountToMinorUnits(input) {
  if (input === null || input === undefined) return null;
  const normalised = String(input).trim().replace(/[₹,\s]/g, '');
  if (!/^\d*(\.\d{0,2})?$/.test(normalised) || normalised === '' || normalised === '.') return null;
  const [major, minor = ''] = normalised.split('.');
  const majorUnits = Number(major || 0);
  const minorUnits = Number(minor.padEnd(2, '0') || 0);
  if (!Number.isFinite(majorUnits)) return null;
  return majorUnits * MINOR_UNITS_PER_MAJOR + minorUnits;
}

/** Clamp a 0..1 ratio into a percentage, guarding against division by zero. */
export function toPercentage(value, total) {
  const numerator = Number(value || 0);
  const denominator = Number(total || 0);
  if (denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}
