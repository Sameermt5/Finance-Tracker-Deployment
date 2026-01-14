// Transaction Types
export type TransactionType = "income" | "expense";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "credit_card"
  | "debit_card"
  | "paypal"
  | "check"
  | "other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO date string
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  clientId?: string; // Reference to client/vendor
  invoiceId?: string; // Reference to invoice
  tags: string[];
  attachments: string[]; // URLs or file IDs
  notes?: string;
  isRecurring: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User email
}

// Client/Vendor Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId?: string; // Tax ID or business registration number
  type: "client" | "vendor" | "both";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Invoice Types
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  taxRate: number; // Percentage
  total: number;
  paidAmount: number;
  balanceDue: number;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  attachments: string[]; // PDF URLs or file IDs
  sentDate?: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color?: string; // Hex color for UI
  icon?: string; // Icon name or emoji
  isDefault: boolean;
  createdAt: string;
  createdBy: string;
}

// User Types
export type UserRole = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  joinedAt: string;
  lastLogin: string;
  isActive: boolean;
}

// Recurring Transaction Template
export interface RecurringTransaction {
  id: string;
  templateName: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  clientId?: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate?: string;
  nextOccurrence: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

// Analytics Types
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeChange: number; // Percentage change from previous period
  expenseChange: number;
  transactionCount: number;
  overdueInvoices: number;
  upcomingInvoices: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyData {
  month: string; // YYYY-MM format
  income: number;
  expenses: number;
  net: number;
}

export interface TopClient {
  clientId: string;
  clientName: string;
  totalRevenue: number;
  transactionCount: number;
}

// Filter Types
export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  category?: string;
  clientId?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: PaymentMethod;
  searchQuery?: string;
  tags?: string[];
}

export interface InvoiceFilter {
  startDate?: string;
  endDate?: string;
  status?: InvoiceStatus;
  clientId?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form Types
export interface TransactionFormData {
  type: TransactionType;
  amount: string;
  date: string;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  clientId?: string;
  invoiceId?: string;
  tags: string[];
  notes?: string;
  isRecurring: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId?: string;
  type: "client" | "vendor" | "both";
  notes?: string;
}

export interface InvoiceFormData {
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  notes?: string;
  terms?: string;
}

// Utility Types
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// Export/Import Types
export interface ExportConfig {
  format: "csv" | "excel";
  includeHeaders: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: TransactionFilter | InvoiceFilter;
}
