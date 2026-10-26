export function formatCurrency(amount, currency = "USD") {
  const numericAmount = Number(amount) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}
