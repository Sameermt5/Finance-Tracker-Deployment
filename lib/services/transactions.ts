import {
  readSheet,
  appendToSheet,
  updateSheet,
  deleteRow,
  createSheetIfNotExists,
} from "@/lib/google-sheets";
import { SHEET_NAMES } from "@/lib/constants";
import { generateId, objectToRow, rowToObject } from "@/lib/utils";
import type { Transaction, TransactionFilter } from "@/types";

const TRANSACTION_HEADERS = [
  "id",
  "type",
  "amount",
  "date",
  "category",
  "description",
  "paymentMethod",
  "clientId",
  "invoiceId",
  "tags",
  "attachments",
  "notes",
  "isRecurring",
  "recurringFrequency",
  "createdAt",
  "updatedAt",
  "createdBy",
];

/**
 * Initialize Transactions sheet with headers
 */
export async function initializeTransactionsSheet() {
  await createSheetIfNotExists(SHEET_NAMES.TRANSACTIONS);

  // Check if headers exist
  const rows = await readSheet(SHEET_NAMES.TRANSACTIONS, "A1:Q1");

  if (rows.length === 0) {
    // Add headers
    await appendToSheet(SHEET_NAMES.TRANSACTIONS, [TRANSACTION_HEADERS]);
  }
}

/**
 * Convert row array to Transaction object
 */
function rowToTransaction(row: any[]): Transaction {
  const obj = rowToObject<any>(row, TRANSACTION_HEADERS);

  return {
    id: obj.id || "",
    type: obj.type || "expense",
    amount: parseFloat(obj.amount) || 0,
    date: obj.date || "",
    category: obj.category || "",
    description: obj.description || "",
    paymentMethod: obj.paymentMethod || "cash",
    clientId: obj.clientId || undefined,
    invoiceId: obj.invoiceId || undefined,
    tags: obj.tags ? JSON.parse(obj.tags) : [],
    attachments: obj.attachments ? JSON.parse(obj.attachments) : [],
    notes: obj.notes || undefined,
    isRecurring: obj.isRecurring === "true" || obj.isRecurring === true,
    recurringFrequency: obj.recurringFrequency || undefined,
    createdAt: obj.createdAt || "",
    updatedAt: obj.updatedAt || "",
    createdBy: obj.createdBy || "",
  };
}

/**
 * Convert Transaction object to row array
 */
function transactionToRow(transaction: Transaction): any[] {
  const obj = {
    ...transaction,
    tags: JSON.stringify(transaction.tags || []),
    attachments: JSON.stringify(transaction.attachments || []),
    isRecurring: transaction.isRecurring ? "true" : "false",
  };

  return objectToRow(obj, TRANSACTION_HEADERS);
}

/**
 * Get all transactions
 */
export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const rows = await readSheet(SHEET_NAMES.TRANSACTIONS);

    if (rows.length <= 1) {
      return []; // No data, only headers
    }

    // Skip header row and convert to Transaction objects
    return rows.slice(1).map(rowToTransaction);
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
}

/**
 * Get transaction by ID
 */
export async function getTransactionById(id: string): Promise<Transaction | null> {
  const transactions = await getAllTransactions();
  return transactions.find((t) => t.id === id) || null;
}

/**
 * Get transactions with filters
 */
export async function getFilteredTransactions(
  filter: TransactionFilter
): Promise<Transaction[]> {
  let transactions = await getAllTransactions();

  if (filter.startDate) {
    transactions = transactions.filter((t) => t.date >= filter.startDate!);
  }

  if (filter.endDate) {
    transactions = transactions.filter((t) => t.date <= filter.endDate!);
  }

  if (filter.type) {
    transactions = transactions.filter((t) => t.type === filter.type);
  }

  if (filter.category) {
    transactions = transactions.filter((t) => t.category === filter.category);
  }

  if (filter.clientId) {
    transactions = transactions.filter((t) => t.clientId === filter.clientId);
  }

  if (filter.paymentMethod) {
    transactions = transactions.filter(
      (t) => t.paymentMethod === filter.paymentMethod
    );
  }

  if (filter.minAmount !== undefined) {
    transactions = transactions.filter((t) => t.amount >= filter.minAmount!);
  }

  if (filter.maxAmount !== undefined) {
    transactions = transactions.filter((t) => t.amount <= filter.maxAmount!);
  }

  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    transactions = transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        (t.notes && t.notes.toLowerCase().includes(query))
    );
  }

  if (filter.tags && filter.tags.length > 0) {
    transactions = transactions.filter((t) =>
      filter.tags!.some((tag) => t.tags.includes(tag))
    );
  }

  return transactions;
}

/**
 * Create a new transaction
 */
export async function createTransaction(
  data: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  userEmail: string
): Promise<Transaction> {
  try {
    await initializeTransactionsSheet();

    const now = new Date().toISOString();
    const transaction: Transaction = {
      ...data,
      id: generateId("txn"),
      createdAt: now,
      updatedAt: now,
      createdBy: userEmail,
    };

    const row = transactionToRow(transaction);
    await appendToSheet(SHEET_NAMES.TRANSACTIONS, [row]);

    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(
  id: string,
  data: Partial<Transaction>,
  userEmail: string
): Promise<Transaction> {
  try {
    const transactions = await getAllTransactions();
    const index = transactions.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Transaction not found");
    }

    const updated: Transaction = {
      ...transactions[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    const row = transactionToRow(updated);
    const rowNumber = index + 2; // +1 for header, +1 for 1-indexed

    await updateSheet(SHEET_NAMES.TRANSACTIONS, `A${rowNumber}:Q${rowNumber}`, [
      row,
    ]);

    return updated;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: string): Promise<void> {
  try {
    const transactions = await getAllTransactions();
    const index = transactions.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Transaction not found");
    }

    const rowNumber = index + 1; // +1 for header row (0-indexed for deleteRow)
    await deleteRow(SHEET_NAMES.TRANSACTIONS, rowNumber);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}

/**
 * Get transaction statistics
 */
export async function getTransactionStats(
  startDate?: string,
  endDate?: string
) {
  const transactions = await getFilteredTransactions({
    startDate,
    endDate,
  });

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = income - expenses;

  const categoryBreakdown = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { amount: 0, count: 0 };
    }
    acc[t.category].amount += t.amount;
    acc[t.category].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    netBalance,
    transactionCount: transactions.length,
    categoryBreakdown,
  };
}
