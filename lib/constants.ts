import type { PaymentMethod, TransactionType } from "@/types";

// Sheet Names in Google Sheets
export const SHEET_NAMES = {
  TRANSACTIONS: "Transactions",
  CLIENTS: "Clients",
  INVOICES: "Invoices",
  INVOICE_ITEMS: "InvoiceItems",
  CATEGORIES: "Categories",
  USERS: "Users",
  RECURRING: "RecurringTransactions",
} as const;

// Default Categories
export const DEFAULT_INCOME_CATEGORIES = [
  "Sales Revenue",
  "Service Income",
  "Consulting",
  "Commission",
  "Interest Income",
  "Rental Income",
  "Other Income",
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Rent",
  "Utilities",
  "Salaries & Wages",
  "Office Supplies",
  "Marketing & Advertising",
  "Travel & Transportation",
  "Professional Services",
  "Insurance",
  "Software & Subscriptions",
  "Meals & Entertainment",
  "Bank Fees",
  "Taxes",
  "Other Expenses",
];

// Payment Methods
export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "check", label: "Check" },
  { value: "other", label: "Other" },
];

// Transaction Types
export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

// Invoice Statuses
export const INVOICE_STATUSES = [
  { value: "draft", label: "Draft", color: "gray" },
  { value: "sent", label: "Sent", color: "blue" },
  { value: "paid", label: "Paid", color: "green" },
  { value: "overdue", label: "Overdue", color: "red" },
  { value: "cancelled", label: "Cancelled", color: "gray" },
];

// User Roles
export const USER_ROLES = [
  { value: "admin", label: "Admin", description: "Full access to all features" },
  {
    value: "editor",
    label: "Editor",
    description: "Can create and edit transactions, clients, and invoices",
  },
  {
    value: "viewer",
    label: "Viewer",
    description: "Read-only access to view data and reports",
  },
];

// Date Range Presets
export const DATE_RANGE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "This Quarter", value: "this_quarter" },
  { label: "Last Quarter", value: "last_quarter" },
  { label: "This Year", value: "this_year" },
  { label: "Last Year", value: "last_year" },
  { label: "All Time", value: "all_time" },
  { label: "Custom Range", value: "custom" },
];

// Recurring Frequencies
export const RECURRING_FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

// Chart Colors
export const CHART_COLORS = {
  income: "#10b981", // green-500
  expense: "#ef4444", // red-500
  net: "#3b82f6", // blue-500
  primary: "#6366f1", // indigo-500
  secondary: "#8b5cf6", // violet-500
};

// Currency Format
export const CURRENCY_CONFIG = {
  currency: "USD",
  locale: "en-US",
  symbol: "$",
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];
