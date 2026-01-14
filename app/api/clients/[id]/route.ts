import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getClientById,
  updateClient,
  deleteClient,
} from "@/lib/services/clients";
import type { ApiResponse, Client } from "@/types";

/**
 * GET /api/clients/[id]
 * Get a single client by ID
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

    const client = await getClientById(params.id);

    if (!client) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Client>>(
      {
        success: true,
        data: client,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`GET /api/clients/${params.id} error:`, error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to fetch client",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/clients/[id]
 * Update a client
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
    const updateData: Partial<Client> = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.email !== undefined) updateData.email = body.email.trim();
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.zipCode !== undefined) updateData.zipCode = body.zipCode;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.taxId !== undefined) updateData.taxId = body.taxId?.trim() || undefined;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.notes !== undefined) updateData.notes = body.notes?.trim() || undefined;

    const client = await updateClient(params.id, updateData);

    return NextResponse.json<ApiResponse<Client>>(
      {
        success: true,
        data: client,
        message: "Client updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PUT /api/clients/${params.id} error:`, error);

    if (error.message === "Client not found") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to update client",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clients/[id]
 * Delete a client
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

    await deleteClient(params.id);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: true,
        message: "Client deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`DELETE /api/clients/${params.id} error:`, error);

    if (error.message === "Client not found") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to delete client",
      },
      { status: 500 }
    );
  }
}
