# Finance Tracker - Business Finance Management System

A comprehensive business finance tracking application with Google Sheets integration, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### ✅ Completed Features (Phase 1-7)

#### Authentication & Security
- ✅ NextAuth.js v5 with Google OAuth authentication
- ✅ Protected routes with middleware
- ✅ Simplified OAuth-only approach (no service account needed)
- ✅ Secure session management

#### Transaction Management
- ✅ Create, read, update, and delete transactions
- ✅ Income and expense tracking
- ✅ Multiple categories (income & expense)
- ✅ Payment method tracking (cash, credit card, bank transfer, etc.)
- ✅ Client/vendor linking to transactions
- ✅ Tags and notes support
- ✅ Advanced filtering with date ranges, categories, payment methods, and amount ranges
- ✅ CSV export with filtering options
- ✅ Real-time transaction statistics
- ✅ Search functionality

#### Client & Vendor Management
- ✅ Complete client/vendor database
- ✅ Full contact information (name, email, phone, address)
- ✅ Client vs vendor differentiation
- ✅ Tax ID tracking
- ✅ Client statistics and metrics
- ✅ Search and filter capabilities

#### Invoice System
- ✅ Professional invoice creation and editing
- ✅ Automatic invoice numbering (INV-YEAR-####)
- ✅ Dynamic line items with real-time calculations
- ✅ Tax calculation support
- ✅ Invoice status tracking (draft, sent, paid, overdue, cancelled)
- ✅ Automatic overdue detection
- ✅ Payment tracking with balance due
- ✅ PDF generation for invoices
- ✅ CSV export
- ✅ Invoice statistics dashboard

#### Analytics & Dashboard
- ✅ Interactive dashboard with real-time data
- ✅ Income vs expenses line chart
- ✅ Category breakdown pie chart
- ✅ Recent transactions widget
- ✅ Top clients by revenue
- ✅ Upcoming invoices tracker
- ✅ Key financial metrics
- ✅ Month-over-month growth tracking
- ✅ Overdue invoice alerts

#### User Experience
- ✅ Responsive design for all screen sizes
- ✅ Toast notifications for all actions
- ✅ Loading states and skeletons
- ✅ Error handling with user-friendly messages
- ✅ Modern, clean UI with Tailwind CSS
- ✅ Intuitive navigation with sidebar
- ✅ Modal-based forms for better UX

#### Data Management
- ✅ Google Sheets API integration for data storage
- ✅ CSV export functionality
- ✅ PDF invoice generation
- ✅ Advanced filtering and search
- ✅ Real-time data updates

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Google Sheets API
- **Authentication**: NextAuth.js v5 with Google OAuth
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Toast Notifications**: react-hot-toast
- **Date Utilities**: date-fns
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
finance-tracker/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── analytics/            # Analytics endpoint
│   │   ├── auth/                 # NextAuth routes
│   │   ├── clients/              # Client CRUD
│   │   ├── invoices/             # Invoice CRUD
│   │   ├── transactions/         # Transaction CRUD
│   │   └── export/               # CSV export endpoints
│   ├── auth/                     # Authentication pages
│   ├── clients/                  # Client management UI
│   ├── dashboard/                # Dashboard with analytics
│   ├── invoices/                 # Invoice management UI
│   ├── transactions/             # Transaction management UI
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── clients/                  # Client components
│   ├── dashboard/                # Dashboard widgets
│   ├── invoices/                 # Invoice components
│   ├── layout/                   # Layout components
│   ├── transactions/             # Transaction components
│   └── ui/                       # UI primitives
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── constants.ts              # App constants
│   ├── google-sheets.ts          # Google Sheets API client
│   ├── pdf.ts                    # PDF generation utilities
│   ├── utils.ts                  # Helper functions
│   └── services/                 # Service layer
│       ├── clients.ts            # Client business logic
│       ├── invoices.ts           # Invoice business logic
│       └── transactions.ts       # Transaction business logic
├── types/                        # TypeScript definitions
│   └── index.ts                  # All type definitions
├── middleware.ts                 # Route protection
├── .env.example                  # Environment variables template
└── SETUP-GUIDE.md               # Detailed setup instructions
```

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.17 or later
- npm or yarn package manager
- A Google account
- Basic knowledge of React and Next.js

## Quick Start

### 1. Install Dependencies

```bash
cd finance-tracker
npm install
```

### 2. Set Up Google Cloud Project

Follow the detailed instructions in `SETUP-GUIDE.md` to:
1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Set up OAuth 2.0 credentials
4. Create a Google Sheet for data storage

**Note**: This project uses a simplified OAuth-only approach. You do NOT need a service account.

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required values:
   ```env
   # OAuth 2.0 Client (from Google Cloud Console)
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here

   # Google Sheets (create a new Google Sheet and copy its ID from URL)
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here

   # NextAuth Configuration
   # Generate with: openssl rand -base64 32
   NEXTAUTH_SECRET=your_generated_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. First-Time Setup

1. Sign in with your Google account
2. The app will automatically create the necessary sheets in your Google Spreadsheet
3. Start adding transactions, clients, and invoices!

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Guide

### Transaction Management

**Location**: `/transactions`

- **Add Transaction**: Click the "Add Transaction" button to create income or expense entries
- **Edit/Delete**: Use the action buttons on each transaction row
- **Filter**: Click "Filters" to filter by date range, type, category, payment method, client, and amount
- **Export**: Click "Export" to download transactions as CSV
- **Search**: Use the search bar to find transactions by description, category, or amount

### Client Management

**Location**: `/clients`

- **Add Client**: Click "Add Client" to create a new client or vendor
- **Client Types**: Differentiate between clients and vendors
- **Full Contact Info**: Store email, phone, address, and tax ID
- **Search**: Find clients by name, email, phone, or tax ID

### Invoice Management

**Location**: `/invoices`

- **Create Invoice**: Click "Create Invoice" to generate a new invoice
- **Line Items**: Add multiple line items with automatic total calculation
- **Tax Support**: Configure tax rate for automatic tax calculation
- **Status Tracking**: Track invoice status (draft, sent, paid, overdue, cancelled)
- **PDF Download**: Download professional PDF invoices with the download button
- **Export**: Export all invoices to CSV

### Dashboard & Analytics

**Location**: `/dashboard`

- **Financial Overview**: View total income, expenses, net balance, and overdue invoices
- **Charts**: Visualize income vs expenses trends and category breakdowns
- **Recent Activity**: See recent transactions and top clients
- **Upcoming Invoices**: Track invoices due in the next 30 days
- **Growth Metrics**: Monitor month-over-month growth

## Google Sheets Structure

The app automatically creates the following sheets in your Google Spreadsheet:

### Transactions Sheet
Columns: ID, Type, Amount, Date, Category, Description, Payment Method, Client ID, Tags, Notes, Is Recurring, Created By, Created At, Updated At

### Clients Sheet
Columns: ID, Name, Email, Phone, Address, City, State, Zip, Country, Tax ID, Type, Notes, Created By, Created At, Updated At

### Invoices Sheet
Columns: ID, Invoice Number, Client ID, Issue Date, Due Date, Status, Subtotal, Tax Rate, Tax, Total, Paid Amount, Balance Due, Notes, Terms, Created By, Created At, Updated At

### Invoice Items Sheet
Columns: ID, Invoice ID, Description, Quantity, Rate, Amount

## Multi-User Support

This application supports multiple users through Google OAuth:

1. Each user signs in with their Google account
2. Users share access to the same Google Spreadsheet
3. All users can view and modify data (role-based access control can be added in future phases)
4. User email is tracked in "Created By" fields

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production domain)
4. Click "Deploy"

### Important Deployment Notes

- Update `NEXTAUTH_URL` to your production domain
- Add your production domain to Google OAuth authorized redirect URIs
- Share your Google Spreadsheet with all users who need access

## Development Phases

- ✅ **Phase 1**: Project setup and structure
- ✅ **Phase 2**: Authentication & data models
- ✅ **Phase 3**: Transaction management
- ✅ **Phase 4**: Client/vendor management
- ✅ **Phase 5**: Invoice system with line items
- ✅ **Phase 6**: Dashboard & analytics with charts
- ✅ **Phase 7**: Advanced features (filters, export, PDF, toast notifications)
- 🔄 **Phase 8**: Testing & documentation
- 🔄 **Phase 9**: Production deployment

## Troubleshooting

### Common Issues

**"Failed to fetch transactions"**
- Ensure your Google Spreadsheet is shared with your Google account
- Check that GOOGLE_SHEETS_SPREADSHEET_ID is correct
- Verify that Google Sheets API is enabled

**OAuth Errors**
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Check that authorized redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
- Ensure OAuth consent screen is configured

**PDF Download Not Working**
- Check browser console for errors
- Ensure invoice has all required data (client, line items)

For more detailed troubleshooting, see `SETUP-GUIDE.md`.

## Contributing

This is a personal/business project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

---

**Built with** ❤️ **using Next.js, TypeScript, and Tailwind CSS**

For detailed setup instructions, see [SETUP-GUIDE.md](./SETUP-GUIDE.md)
