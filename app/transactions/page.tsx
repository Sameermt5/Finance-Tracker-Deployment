"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Download } from "lucide-react";
import toast from "react-hot-toast";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { FilterModal } from "@/components/transactions/filter-modal";
import type { Transaction, TransactionFilter, Client } from "@/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<TransactionFilter>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  );

  // Fetch transactions with filters
  const fetchTransactions = async (filters?: TransactionFilter) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.type) params.append("type", filters.type);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.paymentMethod) params.append("paymentMethod", filters.paymentMethod);
      if (filters?.clientId) params.append("clientId", filters.clientId);
      if (filters?.minAmount) params.append("minAmount", filters.minAmount.toString());
      if (filters?.maxAmount) params.append("maxAmount", filters.maxAmount.toString());

      const response = await fetch(`/api/transactions?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTransactions(data.data);
      } else {
        toast.error(data.error || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      const data = await response.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchTransactions(activeFilters);
    fetchClients();
  }, []);

  // Filter transactions by search query
  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query)
    );
  });

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Transaction deleted successfully");
        await fetchTransactions(activeFilters);
      } else {
        toast.error(data.error || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  // Handle edit
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setEditingTransaction(null);
    fetchTransactions(activeFilters);
  };

  // Handle filter apply
  const handleFilterApply = (filters: TransactionFilter) => {
    setActiveFilters(filters);
    fetchTransactions(filters);
    toast.success("Filters applied successfully");
  };

  // Handle export
  const handleExport = async () => {
    try {
      const params = new URLSearchParams();

      if (activeFilters?.startDate) params.append("startDate", activeFilters.startDate);
      if (activeFilters?.endDate) params.append("endDate", activeFilters.endDate);
      if (activeFilters?.type) params.append("type", activeFilters.type);

      const response = await fetch(`/api/export/transactions?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Transactions exported successfully");
    } catch (error) {
      console.error("Error exporting transactions:", error);
      toast.error("Failed to export transactions");
    }
  };

  // Get active filter count
  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">
              Manage your income and expenses
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              $
              {transactions
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              $
              {transactions
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Net Balance</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              $
              {(
                transactions
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0) -
                transactions
                  .filter((t) => t.type === "expense")
                  .reduce((sum, t) => sum + t.amount, 0)
              ).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilterModal(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2">{activeFilterCount}</Badge>
            )}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.type && (
              <Badge variant="outline">
                Type: {activeFilters.type}
              </Badge>
            )}
            {activeFilters.category && (
              <Badge variant="outline">
                Category: {activeFilters.category}
              </Badge>
            )}
            {activeFilters.paymentMethod && (
              <Badge variant="outline">
                Payment: {activeFilters.paymentMethod}
              </Badge>
            )}
            {activeFilters.clientId && (
              <Badge variant="outline">
                Client: {clients.find((c) => c.id === activeFilters.clientId)?.name}
              </Badge>
            )}
            {activeFilters.startDate && (
              <Badge variant="outline">
                From: {activeFilters.startDate}
              </Badge>
            )}
            {activeFilters.endDate && (
              <Badge variant="outline">
                To: {activeFilters.endDate}
              </Badge>
            )}
            {activeFilters.minAmount && (
              <Badge variant="outline">
                Min: ${activeFilters.minAmount}
              </Badge>
            )}
            {activeFilters.maxAmount && (
              <Badge variant="outline">
                Max: ${activeFilters.maxAmount}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveFilters({});
                fetchTransactions({});
              }}
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Transaction list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading transactions...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "No transactions found matching your search"
                  : "No transactions yet"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Transaction
                </Button>
              )}
            </div>
          ) : (
            <TransactionList
              transactions={filteredTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={handleModalClose}
        />
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          onApply={handleFilterApply}
          clients={clients}
          currentFilters={activeFilters}
        />
      )}
    </AppLayout>
  );
}
