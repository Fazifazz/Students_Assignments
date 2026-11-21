import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const DATE_FORMAT = 'DD MMM YYYY';
export const MONTH_FORMAT = 'MMM YYYY';
export const MONTH_SHORT = 'MMM';

export function formatDate(value, format = DATE_FORMAT) {
  if (!value) return '—';
  const date = dayjs(value);
  return date.isValid() ? date.format(format) : '—';
}

export function formatMonthYear(value) {
  return formatDate(value, MONTH_FORMAT);
}

export function formatRelative(value) {
  if (!value) return '—';
  const date = dayjs(value);
  return date.isValid() ? date.fromNow() : '—';
}

export function formatPercent(value, fractionDigits = 0) {
  const numeric = Number(value || 0);
  return `${numeric.toFixed(fractionDigits)}%`;
}

/** "2026-11" style key used by budget + monthly aggregation endpoints. */
export function monthKey(value = new Date()) {
  return dayjs(value).format('YYYY-MM');
}

export function monthLabel(value) {
  return dayjs(value).format(MONTH_SHORT);
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function titleCase(value = '') {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
