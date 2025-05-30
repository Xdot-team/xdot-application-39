
/**
 * Formats a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a date as MM/DD/YYYY
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formats a percentage
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Alias for formatPercent for backward compatibility
 */
export const formatPercentage = formatPercent;
