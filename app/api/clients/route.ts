import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getAllClients,
  searchClients,
  getClientsByType,
  createClient,
  getClientStats,
} from "@/lib/services/clients";
import type { ApiResponse, Client } from "@/types";

/**
 * GET /api/clients
 * Get all clients or filtered clients
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
    const query = searchParams.get("query");
    const type = searchParams.get("type");

    // Handle stats endpoint
    if (action === "stats") {
      const stats = await getClientStats();

      return NextResponse.json<ApiResponse<any>>(
        {
          success: true,
          data: stats,
        },
        { status: 200 }
      );
    }

    // Handle search
    if (query) {
      const clients = await searchClients(query);

      return NextResponse.json<ApiResponse<Client[]>>(
        {
          success: true,
          data: clients,
        },
        { status: 200 }
      );
    }

    // Handle type filter
    if (type && (type === "client" || type === "vendor" || type === "both")) {
      const clients = await getClientsByType(type);

      return NextResponse.json<ApiResponse<Client[]>>(
        {
          success: true,
          data: clients,
        },
        { status: 200 }
      );
    }

    // Get all clients
    const clients = await getAllClients();

    return NextResponse.json<ApiResponse<Client[]>>(
      {
        success: true,
        data: clients,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/clients error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to fetch clients",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 * Create a new client
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
    if (!body.name || !body.email) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Create client
    const client = await createClient(
      {
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone || "",
        address: body.address || "",
        city: body.city || "",
        state: body.state || "",
        zipCode: body.zipCode || "",
        country: body.country || "",
        taxId: body.taxId?.trim() || undefined,
        type: body.type || "client",
        notes: body.notes?.trim() || undefined,
      },
      session.user.email
    );

    return NextResponse.json<ApiResponse<Client>>(
      {
        success: true,
        data: client,
        message: "Client created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/clients error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to create client",
      },
      { status: 500 }
    );
  }
}
