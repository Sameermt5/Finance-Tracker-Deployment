import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "@/lib/services/transactions";
import type { ApiResponse, Transaction } from "@/types";

/**
 * GET /api/transactions/[id]
 * Get a single transaction by ID
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

    const transaction = await getTransactionById(params.id);

    if (!transaction) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Transaction>>(
      {
        success: true,
        data: transaction,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`GET /api/transactions/${params.id} error:`, error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to fetch transaction",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/transactions/[id]
 * Update a transaction
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

    // Build update object (only include provided fields)
    const updateData: Partial<Transaction> = {};

    if (body.type !== undefined) updateData.type = body.type;
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
    if (body.date !== undefined) updateData.date = body.date;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod;
    if (body.clientId !== undefined) updateData.clientId = body.clientId;
    if (body.invoiceId !== undefined) updateData.invoiceId = body.invoiceId;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.attachments !== undefined) updateData.attachments = body.attachments;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.isRecurring !== undefined) updateData.isRecurring = body.isRecurring;
    if (body.recurringFrequency !== undefined)
      updateData.recurringFrequency = body.recurringFrequency;

    const transaction = await updateTransaction(
      params.id,
      updateData,
      session.user.email
    );

    return NextResponse.json<ApiResponse<Transaction>>(
      {
        success: true,
        data: transaction,
        message: "Transaction updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PUT /api/transactions/${params.id} error:`, error);

    if (error.message === "Transaction not found") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to update transaction",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/transactions/[id]
 * Delete a transaction
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

    await deleteTransaction(params.id);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: true,
        message: "Transaction deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`DELETE /api/transactions/${params.id} error:`, error);

    if (error.message === "Transaction not found") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to delete transaction",
      },
      { status: 500 }
    );
  }
}
