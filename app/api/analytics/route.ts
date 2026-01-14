import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllTransactions } from "@/lib/services/transactions";
import { getAllClients } from "@/lib/services/clients";
import { getAllInvoices } from "@/lib/services/invoices";
import type { ApiResponse } from "@/types";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";

/**
 * GET /api/analytics
 * Get comprehensive analytics data for dashboard
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

    // Fetch all data
    const [transactions, clients, invoices] = await Promise.all([
      getAllTransactions(),
      getAllClients(),
      getAllInvoices(),
    ]);

    // Calculate financial stats
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    // Monthly data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthKey = format(monthStart, "yyyy-MM");
      const monthLabel = format(monthStart, "MMM yyyy");

      const monthTransactions = transactions.filter((t) =>
        t.date.startsWith(monthKey)
      );

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: monthLabel,
        monthKey,
        income,
        expenses,
        net: income - expenses,
      });
    }

    // Category breakdown
    const categoryBreakdown: Record<string, { amount: number; count: number; type: string }> = {};

    transactions.forEach((t) => {
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = { amount: 0, count: 0, type: t.type };
      }
      categoryBreakdown[t.category].amount += t.amount;
      categoryBreakdown[t.category].count += 1;
    });

    const categoryData = Object.entries(categoryBreakdown)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        type: data.type,
        percentage: totalExpenses > 0 && data.type === "expense"
          ? (data.amount / totalExpenses) * 100
          : totalIncome > 0 && data.type === "income"
          ? (data.amount / totalIncome) * 100
          : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Top clients by revenue
    const clientRevenue: Record<string, { name: string; revenue: number; transactionCount: number }> = {};

    for (const transaction of transactions) {
      if (transaction.clientId && transaction.type === "income") {
        if (!clientRevenue[transaction.clientId]) {
          const client = clients.find((c) => c.id === transaction.clientId);
          clientRevenue[transaction.clientId] = {
            name: client?.name || "Unknown",
            revenue: 0,
            transactionCount: 0,
          };
        }
        clientRevenue[transaction.clientId].revenue += transaction.amount;
        clientRevenue[transaction.clientId].transactionCount += 1;
      }
    }

    const topClients = Object.entries(clientRevenue)
      .map(([clientId, data]) => ({
        clientId,
        clientName: data.name,
        totalRevenue: data.revenue,
        transactionCount: data.transactionCount,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    // Recent transactions (last 10)
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map((t) => {
        const client = t.clientId ? clients.find((c) => c.id === t.clientId) : null;
        return {
          ...t,
          clientName: client?.name,
        };
      });

    // Upcoming invoices (due in next 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const upcomingInvoices = invoices
      .filter((inv) => {
        const dueDate = parseISO(inv.dueDate);
        return dueDate >= today && dueDate <= thirtyDaysFromNow && inv.status !== "paid";
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map((inv) => {
        const client = clients.find((c) => c.id === inv.clientId);
        return {
          ...inv,
          clientName: client?.name || "Unknown",
        };
      });

    // Overdue invoices
    const overdueInvoices = invoices.filter((inv) => inv.status === "overdue").length;

    const analyticsData = {
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
        transactionCount: transactions.length,
        clientCount: clients.length,
        invoiceCount: invoices.length,
        overdueInvoices,
      },
      monthlyData,
      categoryData,
      topClients,
      recentTransactions,
      upcomingInvoices,
    };

    return NextResponse.json<ApiResponse<typeof analyticsData>>(
      {
        success: true,
        data: analyticsData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to fetch analytics",
      },
      { status: 500 }
    );
  }
}
