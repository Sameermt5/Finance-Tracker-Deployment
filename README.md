# Finance Tracker - Business Finance Management System

A comprehensive business finance tracking application with Google Sheets integration, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Current Features (Phase 1-2 Complete)
- ✅ Modern Next.js 14+ project structure
- ✅ TypeScript for type safety and comprehensive data models
- ✅ Tailwind CSS for responsive design
- ✅ ESLint configuration
- ✅ NextAuth.js v5 with Google OAuth authentication
- ✅ Google Sheets API integration layer
- ✅ Complete TypeScript interfaces for all data models
- ✅ Utility functions for formatting, dates, and calculations
- ✅ Protected routes with middleware
- ✅ Beautiful sign-in page
- ✅ Comprehensive setup guide (SETUP-GUIDE.md)

### Planned Features
- 🔄 **Transaction Management** - Track income and expenses with detailed categorization
- 🔄 **Client/Vendor Database** - Manage business relationships and contacts
- 🔄 **Invoice Tracking** - Monitor invoice status, due dates, and payments
- 🔄 **Document Management** - Upload and attach receipts/invoices via Google Drive
- 🔄 **Analytics Dashboard** - Visualize financial data with charts and insights
- 🔄 **Google Sheets Integration** - Automatic sync with Google Sheets for data storage
- 🔄 **Multi-User Support** - Role-based access (Admin, Editor, Viewer)
- 🔄 **Recurring Transactions** - Automate regular income/expense entries
- 🔄 **PDF Generation** - Create professional invoices as PDFs
- 🔄 **Export Functionality** - Export data to CSV/Excel

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Google Sheets API
- **File Storage**: Google Drive API
- **Authentication**: NextAuth.js v5 with Google OAuth
- **Charts**: Recharts
- **PDF Generation**: jsPDF or react-pdf (to be implemented)
- **Date Utilities**: date-fns
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
finance-tracker/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard pages
│   ├── transactions/         # Transaction management
│   ├── clients/              # Client/vendor management
│   ├── invoices/             # Invoice tracking
│   ├── settings/             # App settings
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/               # Reusable React components
├── lib/                      # Utility libraries
│   ├── google-sheets.ts      # Google Sheets API client
│   └── auth.ts               # NextAuth configuration
├── utils/                    # Helper functions
├── public/                   # Static assets
└── types/                    # TypeScript type definitions
```

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.17 or later
- npm or yarn package manager
- A Google account
- Basic knowledge of React and Next.js

## Setup Instructions

### 1. Install Dependencies

```bash
cd finance-tracker
npm install
```

### 2. Set Up Google Cloud Project (Required for Phase 2+)

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" and give it a name (e.g., "Finance Tracker")
3. Wait for project creation to complete

#### Step 2: Enable Required APIs
1. In your Google Cloud Project, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Google Sheets API**
   - **Google Drive API**
   - **Google People API** (for user info)

#### Step 3: Create OAuth 2.0 Credentials (for NextAuth)
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure consent screen if prompted:
   - User Type: External
   - App name: Finance Tracker
   - User support email: your email
   - Developer contact: your email
4. Application type: Web application
5. Name: Finance Tracker Web Client
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Click "Create" and save the **Client ID** and **Client Secret**

#### Step 4: Create Service Account (for Google Sheets API)
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Service account name: finance-tracker-service
4. Click "Create and Continue"
5. Grant role: "Editor" (or custom role with Sheets access)
6. Click "Done"
7. Click on the created service account
8. Go to "Keys" tab > "Add Key" > "Create New Key"
9. Choose JSON format and download the key file
10. Save the **service account email** and **private key** from the JSON file

#### Step 5: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet named "Finance Tracker Database"
3. Share the sheet with your **service account email** (with Editor access)
4. Copy the **Spreadsheet ID** from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

#### Step 6: Create Google Drive Folder (for document uploads)
1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder named "Finance Tracker Documents"
3. Share the folder with your **service account email** (with Editor access)
4. Copy the **Folder ID** from the URL:
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID`

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the values in `.env`:
   ```env
   # From OAuth 2.0 Client
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here

   # From Service Account JSON
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email_here
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

   # From Google Sheets
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here

   # From Google Drive
   GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here

   # Generate a random secret: openssl rand -base64 32
   NEXTAUTH_SECRET=your_generated_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Git Workflow

This project uses clear commit messages at each milestone:

```bash
git add .
git commit -m "Phase 1: Initial project setup with Next.js and Tailwind"
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables from your `.env` file
6. Click "Deploy"

### Environment Variables on Vercel

Make sure to add all environment variables from `.env` in Vercel's project settings under "Environment Variables".

## Development Phases

- ✅ **Phase 1**: Project setup and structure
- ✅ **Phase 2**: Authentication & data models
- 🔄 **Phase 3**: Transaction management UI
- 🔄 **Phase 4**: Client/vendor management
- 🔄 **Phase 5**: Invoice system
- 🔄 **Phase 6**: Document management
- 🔄 **Phase 7**: Dashboard & analytics
- 🔄 **Phase 8**: Filtering & search
- 🔄 **Phase 9**: Advanced features
- 🔄 **Phase 10**: Multi-user & access control
- 🔄 **Phase 11**: Polish & UX
- 🔄 **Phase 12**: Testing & documentation
- 🔄 **Phase 13**: Production deployment

## Current Status

**Phase 1 & 2 Complete!** 🎉

- ✅ Project structure with Next.js, TypeScript, and Tailwind CSS
- ✅ Authentication with NextAuth.js and Google OAuth
- ✅ Google Sheets API integration layer
- ✅ Complete data models and TypeScript interfaces
- ✅ Utility functions and constants
- ✅ Comprehensive setup guide

**What's Working:**
- Sign in with Google account
- Protected routes with middleware
- Google Sheets API client ready to use

**Next Steps:**
You need to complete the Google Cloud setup (see SETUP-GUIDE.md) before we can test the full integration.

**Next Development Phase:**
Phase 3 - Transaction management CRUD operations and UI

## Support

For issues or questions, refer to the `CLAUDE.md` file for detailed technical documentation (to be created in Phase 12).

## License

ISC

---

Built with Next.js, TypeScript, and Tailwind CSS
