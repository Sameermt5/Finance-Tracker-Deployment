import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "@/lib/services/invoices";
import type { ApiResponse, Invoice } from "@/types";

/**
 * GET /api/invoices/[id]
 * Get a single invoice by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const invoice = await getInvoiceById(params.id);

    if (!invoice) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Invoice>>(
      {
        success: true,
        data: invoice,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`GET /api/invoices/${params.id} error:`, error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to fetch invoice",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/invoices/[id]
 * Update an invoice
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Build update object
    const updateData: Partial<Invoice> = {};

    if (body.clientId !== undefined) updateData.clientId = body.clientId;
    if (body.issueDate !== undefined) updateData.issueDate = body.issueDate;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.taxRate !== undefined) updateData.taxRate = parseFloat(body.taxRate);
    if (body.paidAmount !== undefined)
      updateData.paidAmount = parseFloat(body.paidAmount);
    if (body.notes !== undefined) updateData.notes = body.notes?.trim() || undefined;
    if (body.terms !== undefined) updateData.terms = body.terms?.trim() || undefined;
    if (body.attachments !== undefined) updateData.attachments = body.attachments;
    if (body.sentDate !== undefined) updateData.sentDate = body.sentDate;
    if (body.paidDate !== undefined) updateData.paidDate = body.paidDate;

    // Handle items update
    if (body.items !== undefined && Array.isArray(body.items)) {
      updateData.items = body.items.map((item: any) => ({
        ...item,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
      }));
    }

    const invoice = await updateInvoice(params.id, updateData, session.user.email);

    return NextResponse.json<ApiResponse<Invoice>>(
      {
        success: true,
        data: invoice,
        message: "Invoice updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PUT /api/invoices/${params.id} error:`, error);

    if (error.message === "Invoice not found") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to update invoice",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invoices/[id]
 * Delete an invoice
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await deleteInvoice(params.id);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: true,
        message: "Invoice deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`DELETE /api/invoices/${params.id} error:`, error);

    if (error.message === "Invoice not found") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to delete invoice",
      },
      { status: 500 }
    );
  }
}
