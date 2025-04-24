import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  const start = address.substring(0, chars + 2);
  const end = address.substring(address.length - chars);
  return `${start}...${end}`;
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatCurrency(value: number, symbol = '$'): string {
  return `${symbol}${formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercentage(value: number): string {
  return `${formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

export function formatTimeAgo(date: Date | number): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

// Mock gas fee calculator - would be replaced with actual estimation
export function estimateGasFee(gasLimit: number, gasPrice: number): number {
  return (gasLimit * gasPrice) / 1e9; // Convert from wei to gwei for display
}