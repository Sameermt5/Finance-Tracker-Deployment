import { google } from "googleapis";
import { auth } from "./auth";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

/**
 * Get authenticated Google Sheets client using user's access token
 */
export async function getSheetsClient() {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("No access token available. Please sign in.");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  return google.sheets({ version: "v4", auth: oauth2Client });
}

/**
 * Read data from a specific sheet range
 */
export async function readSheet(sheetName: string, range?: string) {
  try {
    const sheets = await getSheetsClient();
    const fullRange = range ? `${sheetName}!${range}` : sheetName;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: fullRange,
    });

    return response.data.values || [];
  } catch (error) {
    console.error("Error reading sheet:", error);
    throw new Error("Failed to read from Google Sheets");
  }
}

/**
 * Append rows to a sheet
 */
export async function appendToSheet(sheetName: string, values: any[][]) {
  try {
    const sheets = await getSheetsClient();

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    throw new Error("Failed to write to Google Sheets");
  }
}

/**
 * Update specific cells in a sheet
 */
export async function updateSheet(
  sheetName: string,
  range: string,
  values: any[][]
) {
  try {
    const sheets = await getSheetsClient();
    const fullRange = `${sheetName}!${range}`;

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: fullRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating sheet:", error);
    throw new Error("Failed to update Google Sheets");
  }
}

/**
 * Delete a row from a sheet
 */
export async function deleteRow(sheetName: string, rowIndex: number) {
  try {
    const sheets = await getSheetsClient();

    // Get the sheet ID first
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === sheetName
    );

    if (!sheet || !sheet.properties?.sheetId) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting row:", error);
    throw new Error("Failed to delete row from Google Sheets");
  }
}

/**
 * Clear a range in a sheet
 */
export async function clearSheet(sheetName: string, range?: string) {
  try {
    const sheets = await getSheetsClient();
    const fullRange = range ? `${sheetName}!${range}` : sheetName;

    const response = await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: fullRange,
    });

    return response.data;
  } catch (error) {
    console.error("Error clearing sheet:", error);
    throw new Error("Failed to clear Google Sheets range");
  }
}

/**
 * Create a new sheet tab if it doesn't exist
 */
export async function createSheetIfNotExists(sheetName: string) {
  try {
    const sheets = await getSheetsClient();

    // Check if sheet exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      (s) => s.properties?.title === sheetName
    );

    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error creating sheet:", error);
    throw new Error("Failed to create sheet in Google Sheets");
  }
}
