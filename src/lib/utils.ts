
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export formatting functions from formatters.ts for backward compatibility
export { formatCurrency, formatDate, formatPercent } from './formatters';
