import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  parseISO,
} from "date-fns";
import { CURRENCY_CONFIG } from "./constants";

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: "currency",
    currency: CURRENCY_CONFIG.currency,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, formatStr = "MMM dd, yyyy"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format relative date (e.g., "2 days ago")
 */
export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Get date range based on preset
 */
export function getDateRange(preset: string): { start: Date; end: Date } {
  const now = new Date();

  switch (preset) {
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) };

    case "yesterday":
      const yesterday = subDays(now, 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };

    case "this_week":
      return { start: startOfWeek(now), end: endOfWeek(now) };

    case "last_week":
      const lastWeekStart = startOfWeek(subWeeks(now, 1));
      const lastWeekEnd = endOfWeek(subWeeks(now, 1));
      return { start: lastWeekStart, end: lastWeekEnd };

    case "this_month":
      return { start: startOfMonth(now), end: endOfMonth(now) };

    case "last_month":
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));
      return { start: lastMonthStart, end: lastMonthEnd };

    case "this_quarter":
      return { start: startOfQuarter(now), end: endOfQuarter(now) };

    case "last_quarter":
      const lastQuarterStart = startOfQuarter(subQuarters(now, 1));
      const lastQuarterEnd = endOfQuarter(subQuarters(now, 1));
      return { start: lastQuarterStart, end: lastQuarterEnd };

    case "this_year":
      return { start: startOfYear(now), end: endOfYear(now) };

    case "last_year":
      const lastYearStart = startOfYear(subYears(now, 1));
      const lastYearEnd = endOfYear(subYears(now, 1));
      return { start: lastYearStart, end: lastYearEnd };

    case "all_time":
      return { start: new Date(0), end: now };

    default:
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
}

/**
 * Generate unique ID
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Convert row data to object (for Google Sheets rows)
 */
export function rowToObject<T>(
  row: any[],
  headers: string[]
): T {
  const obj: any = {};
  headers.forEach((header, index) => {
    obj[header] = row[index] || "";
  });
  return obj as T;
}

/**
 * Convert object to row data (for Google Sheets rows)
 */
export function objectToRow<T extends Record<string, any>>(
  obj: T,
  headers: string[]
): any[] {
  return headers.map((header) => obj[header] ?? "");
}

/**
 * Parse CSV string
 */
export function parseCSV(csv: string): string[][] {
  const lines = csv.split("\n");
  return lines.map((line) =>
    line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
  );
}

/**
 * Convert data to CSV
 */
export function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(",");
  const rows = data.map((item) =>
    headers.map((header) => {
      const value = item[header] ?? "";
      // Escape quotes and wrap in quotes if contains comma
      if (String(value).includes(",") || String(value).includes('"')) {
        return `"${String(value).replace(/"/g, '""')}"`;
      }
      return value;
    }).join(",")
  );
  return [headerRow, ...rows].join("\n");
}

/**
 * Download file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Calculate tax amount
 */
export function calculateTax(amount: number, taxRate: number): number {
  return (amount * taxRate) / 100;
}

/**
 * Calculate net amount after tax
 */
export function calculateTotal(subtotal: number, taxRate: number): number {
  return subtotal + calculateTax(subtotal, taxRate);
}

/**
 * Check if invoice is overdue
 */
export function isOverdue(dueDate: string): boolean {
  const due = parseISO(dueDate);
  return due < new Date() && format(due, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd");
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
