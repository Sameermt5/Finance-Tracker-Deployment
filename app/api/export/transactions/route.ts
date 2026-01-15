import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllTransactions } from "@/lib/services/transactions";
import { getAllClients } from "@/lib/services/clients";
import { convertToCSV } from "@/lib/utils";

/**
 * GET /api/export/transactions
 * Export transactions to CSV
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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");

    // Fetch transactions and clients
    const [transactions, clients] = await Promise.all([
      getAllTransactions(),
      getAllClients(),
    ]);

    // Filter transactions
    let filteredTransactions = transactions;

    if (startDate) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.date >= startDate
      );
    }

    if (endDate) {
      filteredTransactions = filteredTransactions.filter((t) => t.date <= endDate);
    }

    if (type && (type === "income" || type === "expense")) {
      filteredTransactions = filteredTransactions.filter((t) => t.type === type);
    }

    // Prepare data for export
    const exportData = filteredTransactions.map((t) => {
      const client = t.clientId
        ? clients.find((c) => c.id === t.clientId)
        : null;

      return {
        Date: t.date,
        Type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
        Amount: t.amount.toFixed(2),
        Category: t.category,
        Description: t.description,
        "Payment Method": t.paymentMethod,
        Client: client?.name || "",
        Tags: t.tags.join(", "),
        Notes: t.notes || "",
        "Created By": t.createdBy,
        "Created At": t.createdAt,
      };
    });

    const headers = [
      "Date",
      "Type",
      "Amount",
      "Category",
      "Description",
      "Payment Method",
      "Client",
      "Tags",
      "Notes",
      "Created By",
      "Created At",
    ];

    const csv = convertToCSV(exportData, headers);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("GET /api/export/transactions error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to export transactions",
      },
      { status: 500 }
    );
  }
}
