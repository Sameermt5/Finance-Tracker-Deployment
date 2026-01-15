import jsPDF from "jspdf";
import type { Invoice, Client } from "@/types";
import { formatCurrency, formatDate } from "./utils";

/**
 * Generate PDF for an invoice
 */
export function generateInvoicePDF(
  invoice: Invoice,
  client: Client | null,
  businessInfo?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  }
) {
  const doc = new jsPDF();

  // Set font
  doc.setFont("helvetica");

  // Header - Business Info
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138); // Blue
  doc.text(businessInfo?.name || "Your Business", 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  if (businessInfo?.email) doc.text(businessInfo.email, 20, 28);
  if (businessInfo?.phone) doc.text(businessInfo.phone, 20, 34);
  if (businessInfo?.address) doc.text(businessInfo.address, 20, 40);

  // Invoice Title
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text("INVOICE", 150, 20);

  // Invoice Number and Dates
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 150, 30);
  doc.text(`Issue Date: ${formatDate(invoice.issueDate)}`, 150, 36);
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 150, 42);

  // Status Badge
  const statusColors = {
    draft: [156, 163, 175],
    sent: [59, 130, 246],
    paid: [34, 197, 94],
    overdue: [239, 68, 68],
    cancelled: [107, 114, 128],
  };
  const color = statusColors[invoice.status] || [100, 100, 100];
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(150, 46, 30, 6, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(
    invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
    155,
    50
  );

  // Bill To Section
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Bill To:", 20, 60);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  if (client) {
    doc.text(client.name, 20, 68);
    if (client.email) doc.text(client.email, 20, 74);
    if (client.phone) doc.text(client.phone, 20, 80);
    if (client.address) {
      const addressLines = [
        client.address,
        [client.city, client.state, client.zip].filter(Boolean).join(", "),
        client.country,
      ].filter(Boolean);
      addressLines.forEach((line, idx) => {
        doc.text(line, 20, 86 + idx * 6);
      });
    }
  }

  // Line Items Table
  const tableTop = 110;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(243, 244, 246);
  doc.rect(20, tableTop, 170, 10, "F");

  // Table Headers
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 25, tableTop + 7);
  doc.text("Quantity", 120, tableTop + 7);
  doc.text("Rate", 145, tableTop + 7);
  doc.text("Amount", 170, tableTop + 7);

  // Table Rows
  doc.setFont("helvetica", "normal");
  let currentY = tableTop + 15;

  invoice.items.forEach((item, index) => {
    // Add new page if needed
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.text(item.description, 25, currentY);
    doc.text(item.quantity.toString(), 120, currentY);
    doc.text(formatCurrency(item.rate), 145, currentY);
    doc.text(formatCurrency(item.amount), 170, currentY);

    currentY += 8;
  });

  // Totals Section
  currentY += 10;
  const totalsX = 130;

  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", totalsX, currentY);
  doc.text(formatCurrency(invoice.subtotal), 170, currentY);

  currentY += 8;
  doc.text(`Tax (${invoice.taxRate}%):`, totalsX, currentY);
  doc.text(formatCurrency(invoice.tax), 170, currentY);

  currentY += 2;
  doc.setLineWidth(0.5);
  doc.line(totalsX, currentY, 190, currentY);

  currentY += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", totalsX, currentY);
  doc.text(formatCurrency(invoice.total), 170, currentY);

  currentY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Paid:", totalsX, currentY);
  doc.text(formatCurrency(invoice.paidAmount), 170, currentY);

  currentY += 8;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(239, 68, 68);
  doc.text("Balance Due:", totalsX, currentY);
  doc.text(formatCurrency(invoice.balanceDue), 170, currentY);

  // Notes Section
  if (invoice.notes) {
    currentY += 20;
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Notes:", 20, currentY);

    currentY += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);

    // Split notes into lines
    const notesLines = doc.splitTextToSize(invoice.notes, 170);
    notesLines.forEach((line: string) => {
      if (currentY > 280) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(line, 20, currentY);
      currentY += 5;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc;
}

/**
 * Download invoice as PDF
 */
export function downloadInvoicePDF(
  invoice: Invoice,
  client: Client | null,
  businessInfo?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  }
) {
  const doc = generateInvoicePDF(invoice, client, businessInfo);
  doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
}
