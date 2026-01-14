# Finance Tracker - Google Cloud & Sheets Setup Guide

This guide will walk you through the **simplified setup** using only Google OAuth (no service account needed).

## Step 1: Create Google Cloud Project (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "**New Project**"
4. Enter project name: `Finance Tracker`
5. Click "**Create**"
6. Wait for the project to be created, then select it

## Step 2: Enable Google Sheets API (2 minutes)

1. In your Google Cloud Project, click the hamburger menu (≡)
2. Go to "**APIs & Services**" > "**Library**"
3. Search for "**Google Sheets API**"
4. Click on it, then click "**ENABLE**"
5. Go back to Library and search for "**Google People API**"
6. Click on it, then click "**ENABLE**"

## Step 3: Configure OAuth Consent Screen (3 minutes)

1. Go to "**APIs & Services**" > "**OAuth consent screen**"
2. Select "**External**" user type
3. Click "**CREATE**"
4. Fill in the required fields:
   - App name: `Finance Tracker`
   - User support email: Your email
   - Developer contact email: Your email
5. Click "**SAVE AND CONTINUE**"
6. On the Scopes page, click "**ADD OR REMOVE SCOPES**"
7. Filter and select these scopes:
   - `openid`
   - `email`
   - `profile`
   - `.../auth/spreadsheets` (Google Sheets API)
8. Click "**UPDATE**" then "**SAVE AND CONTINUE**"
9. On Test users page, click "**ADD USERS**"
10. Add your email and any team members' emails
11. Click "**SAVE AND CONTINUE**"

## Step 4: Create OAuth 2.0 Credentials (3 minutes)

1. Go to "**APIs & Services**" > "**Credentials**"
2. Click "**CREATE CREDENTIALS**" > "**OAuth client ID**"
3. Application type: **Web application**
4. Name: `Finance Tracker Web Client`
5. Under "Authorized redirect URIs", click "**ADD URI**"
6. Add these URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.vercel.app/api/auth/callback/google
   ```
   (For now, just add the localhost one)
7. Click "**CREATE**"
8. **IMPORTANT**: Copy the **Client ID** and **Client Secret** that appear
9. Save them somewhere safe - you'll need them in Step 6

## Step 5: Create Google Sheet (5 minutes)

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click "**Blank**" to create a new spreadsheet
3. Name it: `Finance Tracker Database`
4. Create the following sheet tabs (click + at the bottom):
   - Transactions
   - Clients
   - Invoices
   - InvoiceItems
   - Categories
   - Users
   - RecurringTransactions

### 5.1 Set up Transactions sheet:

In the **Transactions** sheet, add these headers in row 1:

```
id | type | amount | date | category | description | paymentMethod | clientId | invoiceId | tags | attachments | notes | isRecurring | recurringFrequency | createdAt | updatedAt | createdBy
```

### 5.2 Set up Clients sheet:

In the **Clients** sheet, add these headers in row 1:

```
id | name | email | phone | address | city | state | zipCode | country | taxId | type | notes | createdAt | updatedAt | createdBy
```

### 5.3 Set up Invoices sheet:

In the **Invoices** sheet, add these headers in row 1:

```
id | invoiceNumber | clientId | issueDate | dueDate | status | subtotal | tax | taxRate | total | paidAmount | balanceDue | notes | terms | attachments | sentDate | paidDate | createdAt | updatedAt | createdBy
```

### 5.4 Set up InvoiceItems sheet:

In the **InvoiceItems** sheet, add these headers in row 1:

```
id | invoiceId | description | quantity | unitPrice | amount
```

### 5.5 Set up Categories sheet:

In the **Categories** sheet, add these headers in row 1:

```
id | name | type | color | icon | isDefault | createdAt | createdBy
```

Then add some default categories (you can customize these later):

| id | name | type | color | icon | isDefault | createdAt | createdBy |
|---|---|---|---|---|---|---|---|
| cat_income_1 | Sales Revenue | income | #10b981 | 💰 | true | 2025-01-14 | system |
| cat_income_2 | Service Income | income | #059669 | 🛠️ | true | 2025-01-14 | system |
| cat_income_3 | Consulting | income | #14b8a6 | 💼 | true | 2025-01-14 | system |
| cat_expense_1 | Rent | expense | #ef4444 | 🏠 | true | 2025-01-14 | system |
| cat_expense_2 | Utilities | expense | #dc2626 | ⚡ | true | 2025-01-14 | system |
| cat_expense_3 | Salaries & Wages | expense | #f97316 | 👥 | true | 2025-01-14 | system |
| cat_expense_4 | Office Supplies | expense | #f59e0b | 📎 | true | 2025-01-14 | system |
| cat_expense_5 | Marketing | expense | #84cc16 | 📢 | true | 2025-01-14 | system |

### 5.6 Set up Users sheet:

In the **Users** sheet, add these headers in row 1:

```
id | email | name | role | avatar | joinedAt | lastLogin | isActive
```

Then add yourself as the first admin user:

| id | email | name | role | avatar | joinedAt | lastLogin | isActive |
|---|---|---|---|---|---|---|---|
| user_1 | your.email@gmail.com | Your Name | admin | | 2025-01-14 | 2025-01-14 | true |

**Replace `your.email@gmail.com` with your actual Google account email!**

### 5.7 Set up RecurringTransactions sheet:

In the **RecurringTransactions** sheet, add these headers in row 1:

```
id | templateName | type | amount | category | description | paymentMethod | clientId | frequency | startDate | endDate | nextOccurrence | isActive | createdAt | createdBy
```

### 5.8 Copy the Spreadsheet ID:

1. Look at the URL of your Google Sheet
2. It looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`
3. Copy the long string between `/d/` and `/edit`
4. Save this **Spreadsheet ID** - you'll need it in Step 6

### 5.9 Share the Sheet with Team Members:

1. Click the "**Share**" button in the top right
2. Add email addresses of team members who need access
3. Set their permission level:
   - **Editor**: Can view and edit (maps to Editor/Admin role in app)
   - **Viewer**: Can only view (maps to Viewer role in app)

## Step 6: Configure Environment Variables (2 minutes)

1. Open your project folder in a terminal
2. Copy the example environment file:
   ```bash
   cd finance-tracker
   cp .env.example .env
   ```
3. Open `.env` in a text editor
4. Fill in the values:

```env
# From Step 4 (OAuth credentials)
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here

# From Step 5.8 (Spreadsheet ID)
GOOGLE_SHEETS_SPREADSHEET_ID=your_long_spreadsheet_id_here

# Generate a random secret (run this command in terminal):
# openssl rand -base64 32
NEXTAUTH_SECRET=paste_generated_secret_here

# Keep this as is for local development
NEXTAUTH_URL=http://localhost:3000

NODE_ENV=development
```

5. To generate the NEXTAUTH_SECRET, run this in your terminal:
   ```bash
   openssl rand -base64 32
   ```
6. Copy the output and paste it as the `NEXTAUTH_SECRET` value

## Step 7: Test the Setup (3 minutes)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. You should see the Finance Tracker home page

4. Click "**Go to Dashboard**" or navigate to http://localhost:3000/dashboard

5. You'll be redirected to the sign-in page

6. Click "**Continue with Google**"

7. Sign in with your Google account (the one you added in Step 3.10)

8. Grant permissions when asked

9. You should be redirected to the dashboard!

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"

**Solution**: Make sure you've added your email as a test user in Step 3.10

### Error: "Redirect URI mismatch"

**Solution**: Double-check that you've added the exact redirect URI in Step 4.6:
```
http://localhost:3000/api/auth/callback/google
```

### Error: "Failed to read from Google Sheets"

**Solutions**:
1. Make sure the Spreadsheet ID in `.env` is correct
2. Make sure you've enabled Google Sheets API in Step 2
3. Make sure you've granted the `spreadsheets` scope in Step 3.7

### Error: "Invalid credentials"

**Solution**: Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env` match what you got in Step 4.8

## Next Steps

Once setup is complete, you're ready to start using the application! The next development phase will add:

- Transaction CRUD operations
- Client/vendor management
- Invoice tracking
- Dashboard with analytics
- And much more!

## Support

If you encounter any issues during setup, refer to:
- [Google Cloud Console Documentation](https://cloud.google.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)

---

**Estimated Total Setup Time**: 20-25 minutes

**Setup Difficulty**: Beginner-Friendly ✅
