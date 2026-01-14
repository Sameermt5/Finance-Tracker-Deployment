import {
  readSheet,
  appendToSheet,
  updateSheet,
  deleteRow,
  createSheetIfNotExists,
} from "@/lib/google-sheets";
import { SHEET_NAMES } from "@/lib/constants";
import { generateId, objectToRow, rowToObject, isOverdue } from "@/lib/utils";
import type { Invoice, InvoiceItem, InvoiceStatus } from "@/types";

const INVOICE_HEADERS = [
  "id",
  "invoiceNumber",
  "clientId",
  "issueDate",
  "dueDate",
  "status",
  "subtotal",
  "tax",
  "taxRate",
  "total",
  "paidAmount",
  "balanceDue",
  "notes",
  "terms",
  "attachments",
  "sentDate",
  "paidDate",
  "createdAt",
  "updatedAt",
  "createdBy",
];

const INVOICE_ITEM_HEADERS = [
  "id",
  "invoiceId",
  "description",
  "quantity",
  "unitPrice",
  "amount",
];

/**
 * Initialize Invoice sheets with headers
 */
export async function initializeInvoiceSheets() {
  // Initialize Invoices sheet
  await createSheetIfNotExists(SHEET_NAMES.INVOICES);
  const invoiceRows = await readSheet(SHEET_NAMES.INVOICES, "A1:T1");
  if (invoiceRows.length === 0) {
    await appendToSheet(SHEET_NAMES.INVOICES, [INVOICE_HEADERS]);
  }

  // Initialize InvoiceItems sheet
  await createSheetIfNotExists(SHEET_NAMES.INVOICE_ITEMS);
  const itemRows = await readSheet(SHEET_NAMES.INVOICE_ITEMS, "A1:F1");
  if (itemRows.length === 0) {
    await appendToSheet(SHEET_NAMES.INVOICE_ITEMS, [INVOICE_ITEM_HEADERS]);
  }
}

/**
 * Convert row array to Invoice object
 */
function rowToInvoice(row: any[]): Invoice {
  const obj = rowToObject<any>(row, INVOICE_HEADERS);

  return {
    id: obj.id || "",
    invoiceNumber: obj.invoiceNumber || "",
    clientId: obj.clientId || "",
    issueDate: obj.issueDate || "",
    dueDate: obj.dueDate || "",
    status: obj.status || "draft",
    subtotal: parseFloat(obj.subtotal) || 0,
    tax: parseFloat(obj.tax) || 0,
    taxRate: parseFloat(obj.taxRate) || 0,
    total: parseFloat(obj.total) || 0,
    paidAmount: parseFloat(obj.paidAmount) || 0,
    balanceDue: parseFloat(obj.balanceDue) || 0,
    items: [], // Will be loaded separately
    notes: obj.notes || undefined,
    terms: obj.terms || undefined,
    attachments: obj.attachments ? JSON.parse(obj.attachments) : [],
    sentDate: obj.sentDate || undefined,
    paidDate: obj.paidDate || undefined,
    createdAt: obj.createdAt || "",
    updatedAt: obj.updatedAt || "",
    createdBy: obj.createdBy || "",
  };
}

/**
 * Convert Invoice object to row array
 */
function invoiceToRow(invoice: Invoice): any[] {
  const obj = {
    ...invoice,
    attachments: JSON.stringify(invoice.attachments || []),
  };
  // Remove items as they're stored separately
  delete (obj as any).items;
  return objectToRow(obj, INVOICE_HEADERS);
}

/**
 * Convert row array to InvoiceItem object
 */
function rowToInvoiceItem(row: any[]): InvoiceItem {
  const obj = rowToObject<any>(row, INVOICE_ITEM_HEADERS);

  return {
    id: obj.id || "",
    invoiceId: obj.invoiceId || "",
    description: obj.description || "",
    quantity: parseFloat(obj.quantity) || 0,
    unitPrice: parseFloat(obj.unitPrice) || 0,
    amount: parseFloat(obj.amount) || 0,
  };
}

/**
 * Convert InvoiceItem object to row array
 */
function invoiceItemToRow(item: InvoiceItem): any[] {
  return objectToRow(item, INVOICE_ITEM_HEADERS);
}

/**
 * Get all invoice items for a specific invoice
 */
export async function getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  try {
    const rows = await readSheet(SHEET_NAMES.INVOICE_ITEMS);

    if (rows.length <= 1) {
      return [];
    }

    const allItems = rows.slice(1).map(rowToInvoiceItem);
    return allItems.filter((item) => item.invoiceId === invoiceId);
  } catch (error) {
    console.error("Error getting invoice items:", error);
    return [];
  }
}

/**
 * Generate next invoice number
 */
async function generateInvoiceNumber(): Promise<string> {
  const invoices = await getAllInvoices();
  const year = new Date().getFullYear();
  const yearInvoices = invoices.filter((inv) =>
    inv.invoiceNumber.startsWith(`INV-${year}`)
  );
  const nextNum = yearInvoices.length + 1;
  return `INV-${year}-${String(nextNum).padStart(4, "0")}`;
}

/**
 * Calculate invoice totals
 */
function calculateInvoiceTotals(items: InvoiceItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

/**
 * Update invoice status based on payment and dates
 */
function determineInvoiceStatus(
  invoice: Invoice,
  currentStatus?: InvoiceStatus
): InvoiceStatus {
  // If paid in full, status is paid
  if (invoice.paidAmount >= invoice.total) {
    return "paid";
  }

  // If overdue and not paid
  if (isOverdue(invoice.dueDate) && invoice.status !== "paid") {
    return "overdue";
  }

  // Keep current status if provided
  if (currentStatus) {
    return currentStatus;
  }

  return invoice.status;
}

/**
 * Get all invoices
 */
export async function getAllInvoices(): Promise<Invoice[]> {
  try {
    const rows = await readSheet(SHEET_NAMES.INVOICES);

    if (rows.length <= 1) {
      return [];
    }

    const invoices = rows.slice(1).map(rowToInvoice);

    // Load items for each invoice
    for (const invoice of invoices) {
      invoice.items = await getInvoiceItems(invoice.id);
    }

    return invoices;
  } catch (error) {
    console.error("Error getting invoices:", error);
    throw error;
  }
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const invoices = await getAllInvoices();
  return invoices.find((inv) => inv.id === id) || null;
}

/**
 * Get invoices by client
 */
export async function getInvoicesByClient(clientId: string): Promise<Invoice[]> {
  const invoices = await getAllInvoices();
  return invoices.filter((inv) => inv.clientId === clientId);
}

/**
 * Get invoices by status
 */
export async function getInvoicesByStatus(
  status: InvoiceStatus
): Promise<Invoice[]> {
  const invoices = await getAllInvoices();
  return invoices.filter((inv) => inv.status === status);
}

/**
 * Create a new invoice
 */
export async function createInvoice(
  data: Omit<Invoice, "id" | "invoiceNumber" | "createdAt" | "updatedAt">,
  userEmail: string
): Promise<Invoice> {
  try {
    await initializeInvoiceSheets();

    const now = new Date().toISOString();
    const invoiceNumber = await generateInvoiceNumber();

    // Calculate totals from items
    const { subtotal, tax, total } = calculateInvoiceTotals(
      data.items,
      data.taxRate
    );

    const balanceDue = total - (data.paidAmount || 0);

    const invoice: Invoice = {
      ...data,
      id: generateId("inv"),
      invoiceNumber,
      subtotal,
      tax,
      total,
      balanceDue,
      status: determineInvoiceStatus({
        ...data,
        subtotal,
        tax,
        total,
        balanceDue,
      } as Invoice),
      createdAt: now,
      updatedAt: now,
      createdBy: userEmail,
    };

    // Save invoice
    const invoiceRow = invoiceToRow(invoice);
    await appendToSheet(SHEET_NAMES.INVOICES, [invoiceRow]);

    // Save invoice items
    for (const item of data.items) {
      const invoiceItem: InvoiceItem = {
        ...item,
        id: generateId("item"),
        invoiceId: invoice.id,
        amount: item.quantity * item.unitPrice,
      };
      const itemRow = invoiceItemToRow(invoiceItem);
      await appendToSheet(SHEET_NAMES.INVOICE_ITEMS, [itemRow]);
    }

    return invoice;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(
  id: string,
  data: Partial<Invoice>,
  userEmail: string
): Promise<Invoice> {
  try {
    const invoices = await getAllInvoices();
    const index = invoices.findIndex((inv) => inv.id === id);

    if (index === -1) {
      throw new Error("Invoice not found");
    }

    const existing = invoices[index];

    // If items are provided, recalculate totals
    let updatedData = { ...data };
    if (data.items) {
      const { subtotal, tax, total } = calculateInvoiceTotals(
        data.items,
        data.taxRate ?? existing.taxRate
      );
      updatedData = {
        ...updatedData,
        subtotal,
        tax,
        total,
        balanceDue: total - (data.paidAmount ?? existing.paidAmount),
      };

      // Update invoice items
      // Delete old items
      const oldItems = await getInvoiceItems(id);
      for (const item of oldItems) {
        const itemRows = await readSheet(SHEET_NAMES.INVOICE_ITEMS);
        const itemIndex = itemRows
          .slice(1)
          .map(rowToInvoiceItem)
          .findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
          await deleteRow(SHEET_NAMES.INVOICE_ITEMS, itemIndex + 1);
        }
      }

      // Add new items
      for (const item of data.items) {
        const invoiceItem: InvoiceItem = {
          ...item,
          id: item.id || generateId("item"),
          invoiceId: id,
          amount: item.quantity * item.unitPrice,
        };
        const itemRow = invoiceItemToRow(invoiceItem);
        await appendToSheet(SHEET_NAMES.INVOICE_ITEMS, [itemRow]);
      }
    }

    const updated: Invoice = {
      ...existing,
      ...updatedData,
      id,
      updatedAt: new Date().toISOString(),
      status: determineInvoiceStatus(
        {
          ...existing,
          ...updatedData,
        } as Invoice,
        data.status
      ),
    };

    const row = invoiceToRow(updated);
    const rowNumber = index + 2;

    await updateSheet(SHEET_NAMES.INVOICES, `A${rowNumber}:T${rowNumber}`, [row]);

    // Reload items
    updated.items = await getInvoiceItems(id);

    return updated;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(id: string): Promise<void> {
  try {
    // Delete invoice items first
    const items = await getInvoiceItems(id);
    for (const item of items) {
      const itemRows = await readSheet(SHEET_NAMES.INVOICE_ITEMS);
      const itemIndex = itemRows
        .slice(1)
        .map(rowToInvoiceItem)
        .findIndex((i) => i.id === item.id);
      if (itemIndex !== -1) {
        await deleteRow(SHEET_NAMES.INVOICE_ITEMS, itemIndex + 1);
      }
    }

    // Delete invoice
    const invoices = await getAllInvoices();
    const index = invoices.findIndex((inv) => inv.id === id);

    if (index === -1) {
      throw new Error("Invoice not found");
    }

    await deleteRow(SHEET_NAMES.INVOICES, index + 1);
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
}

/**
 * Get invoice statistics
 */
export async function getInvoiceStats() {
  const invoices = await getAllInvoices();

  const totalInvoices = invoices.length;
  const draftCount = invoices.filter((inv) => inv.status === "draft").length;
  const sentCount = invoices.filter((inv) => inv.status === "sent").length;
  const paidCount = invoices.filter((inv) => inv.status === "paid").length;
  const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const outstanding = totalAmount - paidAmount;

  return {
    totalInvoices,
    draftCount,
    sentCount,
    paidCount,
    overdueCount,
    totalAmount,
    paidAmount,
    outstanding,
  };
}
