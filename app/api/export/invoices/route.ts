import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllInvoices } from "@/lib/services/invoices";
import { getAllClients } from "@/lib/services/clients";
import { convertToCSV } from "@/lib/utils";

/**
 * GET /api/export/invoices
 * Export invoices to CSV
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    // Fetch invoices and clients
    const [invoices, clients] = await Promise.all([
      getAllInvoices(),
      getAllClients(),
    ]);

    // Filter invoices
    let filteredInvoices = invoices;

    if (status) {
      filteredInvoices = filteredInvoices.filter((inv) => inv.status === status);
    }

    // Prepare data for export
    const exportData = filteredInvoices.map((inv) => {
      const client = clients.find((c) => c.id === inv.clientId);

      return {
        "Invoice Number": inv.invoiceNumber,
        Client: client?.name || "",
        "Issue Date": inv.issueDate,
        "Due Date": inv.dueDate,
        Status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
        Subtotal: inv.subtotal.toFixed(2),
        "Tax Rate": inv.taxRate.toFixed(2) + "%",
        Tax: inv.tax.toFixed(2),
        Total: inv.total.toFixed(2),
        "Paid Amount": inv.paidAmount.toFixed(2),
        "Balance Due": inv.balanceDue.toFixed(2),
        "Line Items": inv.items.length,
        "Created By": inv.createdBy,
        "Created At": inv.createdAt,
      };
    });

    const headers = [
      "Invoice Number",
      "Client",
      "Issue Date",
      "Due Date",
      "Status",
      "Subtotal",
      "Tax Rate",
      "Tax",
      "Total",
      "Paid Amount",
      "Balance Due",
      "Line Items",
      "Created By",
      "Created At",
    ];

    const csv = convertToCSV(exportData, headers);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="invoices_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("GET /api/export/invoices error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to export invoices",
      },
      { status: 500 }
    );
  }
}
