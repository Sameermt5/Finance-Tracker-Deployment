import {
  readSheet,
  appendToSheet,
  updateSheet,
  deleteRow,
  createSheetIfNotExists,
} from "@/lib/google-sheets";
import { SHEET_NAMES } from "@/lib/constants";
import { generateId, objectToRow, rowToObject } from "@/lib/utils";
import type { Client } from "@/types";

const CLIENT_HEADERS = [
  "id",
  "name",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "zipCode",
  "country",
  "taxId",
  "type",
  "notes",
  "createdAt",
  "updatedAt",
  "createdBy",
];

/**
 * Initialize Clients sheet with headers
 */
export async function initializeClientsSheet() {
  await createSheetIfNotExists(SHEET_NAMES.CLIENTS);

  // Check if headers exist
  const rows = await readSheet(SHEET_NAMES.CLIENTS, "A1:O1");

  if (rows.length === 0) {
    // Add headers
    await appendToSheet(SHEET_NAMES.CLIENTS, [CLIENT_HEADERS]);
  }
}

/**
 * Convert row array to Client object
 */
function rowToClient(row: any[]): Client {
  const obj = rowToObject<any>(row, CLIENT_HEADERS);

  return {
    id: obj.id || "",
    name: obj.name || "",
    email: obj.email || "",
    phone: obj.phone || "",
    address: obj.address || "",
    city: obj.city || "",
    state: obj.state || "",
    zipCode: obj.zipCode || "",
    country: obj.country || "",
    taxId: obj.taxId || undefined,
    type: obj.type || "client",
    notes: obj.notes || undefined,
    createdAt: obj.createdAt || "",
    updatedAt: obj.updatedAt || "",
    createdBy: obj.createdBy || "",
  };
}

/**
 * Convert Client object to row array
 */
function clientToRow(client: Client): any[] {
  return objectToRow(client, CLIENT_HEADERS);
}

/**
 * Get all clients
 */
export async function getAllClients(): Promise<Client[]> {
  try {
    const rows = await readSheet(SHEET_NAMES.CLIENTS);

    if (rows.length <= 1) {
      return []; // No data, only headers
    }

    // Skip header row and convert to Client objects
    return rows.slice(1).map(rowToClient);
  } catch (error) {
    console.error("Error getting clients:", error);
    throw error;
  }
}

/**
 * Get client by ID
 */
export async function getClientById(id: string): Promise<Client | null> {
  const clients = await getAllClients();
  return clients.find((c) => c.id === id) || null;
}

/**
 * Search clients by query
 */
export async function searchClients(query: string): Promise<Client[]> {
  const clients = await getAllClients();
  const lowerQuery = query.toLowerCase();

  return clients.filter(
    (client) =>
      client.name.toLowerCase().includes(lowerQuery) ||
      client.email.toLowerCase().includes(lowerQuery) ||
      client.phone.includes(query) ||
      (client.taxId && client.taxId.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get clients by type
 */
export async function getClientsByType(
  type: "client" | "vendor" | "both"
): Promise<Client[]> {
  const clients = await getAllClients();
  return clients.filter((c) => c.type === type || c.type === "both");
}

/**
 * Create a new client
 */
export async function createClient(
  data: Omit<Client, "id" | "createdAt" | "updatedAt">,
  userEmail: string
): Promise<Client> {
  try {
    await initializeClientsSheet();

    const now = new Date().toISOString();
    const client: Client = {
      ...data,
      id: generateId("client"),
      createdAt: now,
      updatedAt: now,
      createdBy: userEmail,
    };

    const row = clientToRow(client);
    await appendToSheet(SHEET_NAMES.CLIENTS, [row]);

    return client;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}

/**
 * Update an existing client
 */
export async function updateClient(
  id: string,
  data: Partial<Client>
): Promise<Client> {
  try {
    const clients = await getAllClients();
    const index = clients.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error("Client not found");
    }

    const updated: Client = {
      ...clients[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    const row = clientToRow(updated);
    const rowNumber = index + 2; // +1 for header, +1 for 1-indexed

    await updateSheet(SHEET_NAMES.CLIENTS, `A${rowNumber}:O${rowNumber}`, [row]);

    return updated;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
}

/**
 * Delete a client
 */
export async function deleteClient(id: string): Promise<void> {
  try {
    const clients = await getAllClients();
    const index = clients.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error("Client not found");
    }

    const rowNumber = index + 1; // +1 for header row (0-indexed for deleteRow)
    await deleteRow(SHEET_NAMES.CLIENTS, rowNumber);
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
}

/**
 * Get client statistics
 */
export async function getClientStats() {
  const clients = await getAllClients();

  const clientCount = clients.filter((c) => c.type === "client").length;
  const vendorCount = clients.filter((c) => c.type === "vendor").length;
  const bothCount = clients.filter((c) => c.type === "both").length;

  return {
    totalClients: clients.length,
    clientCount,
    vendorCount,
    bothCount,
  };
}
