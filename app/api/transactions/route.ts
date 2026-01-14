import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getAllTransactions,
  getFilteredTransactions,
  createTransaction,
  getTransactionStats,
} from "@/lib/services/transactions";
import type { ApiResponse, Transaction, TransactionFilter } from "@/types";

/**
 * GET /api/transactions
 * Get all transactions or filtered transactions
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");

    // Handle stats endpoint
    if (action === "stats") {
      const startDate = searchParams.get("startDate") || undefined;
      const endDate = searchParams.get("endDate") || undefined;

      const stats = await getTransactionStats(startDate, endDate);

      return NextResponse.json<ApiResponse<any>>(
        {
          success: true,
          data: stats,
        },
        { status: 200 }
      );
    }

    // Build filter from query params
    const filter: TransactionFilter = {};

    if (searchParams.get("startDate")) {
      filter.startDate = searchParams.get("startDate")!;
    }

    if (searchParams.get("endDate")) {
      filter.endDate = searchParams.get("endDate")!;
    }

    if (searchParams.get("type")) {
      filter.type = searchParams.get("type") as "income" | "expense";
    }

    if (searchParams.get("category")) {
      filter.category = searchParams.get("category")!;
    }

    if (searchParams.get("clientId")) {
      filter.clientId = searchParams.get("clientId")!;
    }

    if (searchParams.get("paymentMethod")) {
      filter.paymentMethod = searchParams.get("paymentMethod") as any;
    }

    if (searchParams.get("minAmount")) {
      filter.minAmount = parseFloat(searchParams.get("minAmount")!);
    }

    if (searchParams.get("maxAmount")) {
      filter.maxAmount = parseFloat(searchParams.get("maxAmount")!);
    }

    if (searchParams.get("searchQuery")) {
      filter.searchQuery = searchParams.get("searchQuery")!;
    }

    if (searchParams.get("tags")) {
      filter.tags = searchParams.get("tags")!.split(",");
    }

    // Get transactions
    const transactions =
      Object.keys(filter).length > 0
        ? await getFilteredTransactions(filter)
        : await getAllTransactions();

    return NextResponse.json<ApiResponse<Transaction[]>>(
      {
        success: true,
        data: transactions,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to fetch transactions",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * Create a new transaction
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.type || !body.amount || !body.date || !body.category || !body.description) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await createTransaction(
      {
        type: body.type,
        amount: parseFloat(body.amount),
        date: body.date,
        category: body.category,
        description: body.description,
        paymentMethod: body.paymentMethod || "cash",
        clientId: body.clientId,
        invoiceId: body.invoiceId,
        tags: body.tags || [],
        attachments: body.attachments || [],
        notes: body.notes,
        isRecurring: body.isRecurring || false,
        recurringFrequency: body.recurringFrequency,
      },
      session.user.email
    );

    return NextResponse.json<ApiResponse<Transaction>>(
      {
        success: true,
        data: transaction,
        message: "Transaction created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to create transaction",
      },
      { status: 500 }
    );
  }
}
