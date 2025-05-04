import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to yyyy-MM-dd format
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toISOString().split('T')[0];
}

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number | string): string {
  if (!value) return '0,00 €';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  return numValue.toLocaleString('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  });
}

/**
 * Generates a random ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Downloads a file
 */
export function downloadFile(content: string, fileName: string, contentType: string): void {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}