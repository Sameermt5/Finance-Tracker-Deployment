import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getAllInvoices,
  getInvoicesByClient,
  getInvoicesByStatus,
  createInvoice,
  getInvoiceStats,
} from "@/lib/services/invoices";
import type { ApiResponse, Invoice, InvoiceStatus } from "@/types";

/**
 * GET /api/invoices
 * Get all invoices or filtered invoices
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
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    // Handle stats endpoint
    if (action === "stats") {
      const stats = await getInvoiceStats();

      return NextResponse.json<ApiResponse<any>>(
        {
          success: true,
          data: stats,
        },
        { status: 200 }
      );
    }

    // Handle client filter
    if (clientId) {
      const invoices = await getInvoicesByClient(clientId);

      return NextResponse.json<ApiResponse<Invoice[]>>(
        {
          success: true,
          data: invoices,
        },
        { status: 200 }
      );
    }

    // Handle status filter
    if (status && ["draft", "sent", "paid", "overdue", "cancelled"].includes(status)) {
      const invoices = await getInvoicesByStatus(status as InvoiceStatus);

      return NextResponse.json<ApiResponse<Invoice[]>>(
        {
          success: true,
          data: invoices,
        },
        { status: 200 }
      );
    }

    // Get all invoices
    const invoices = await getAllInvoices();

    return NextResponse.json<ApiResponse<Invoice[]>>(
      {
        success: true,
        data: invoices,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/invoices error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to fetch invoices",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invoices
 * Create a new invoice
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
    if (!body.clientId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Client is required" },
        { status: 400 }
      );
    }

    if (!body.issueDate) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Issue date is required" },
        { status: 400 }
      );
    }

    if (!body.dueDate) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Due date is required" },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "At least one line item is required" },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of body.items) {
      if (!item.description || !item.quantity || !item.unitPrice) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Invalid line item data" },
          { status: 400 }
        );
      }
    }

    // Create invoice
    const invoice = await createInvoice(
      {
        clientId: body.clientId,
        issueDate: body.issueDate,
        dueDate: body.dueDate,
        status: body.status || "draft",
        taxRate: parseFloat(body.taxRate) || 0,
        paidAmount: parseFloat(body.paidAmount) || 0,
        items: body.items.map((item: any) => ({
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })),
        notes: body.notes?.trim() || undefined,
        terms: body.terms?.trim() || undefined,
        attachments: body.attachments || [],
        sentDate: body.sentDate || undefined,
        paidDate: body.paidDate || undefined,
      },
      session.user.email
    );

    return NextResponse.json<ApiResponse<Invoice>>(
      {
        success: true,
        data: invoice,
        message: "Invoice created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/invoices error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to create invoice",
      },
      { status: 500 }
    );
  }
}
