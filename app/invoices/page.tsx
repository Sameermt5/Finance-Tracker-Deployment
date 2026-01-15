"use client";

import { useEffect, useState } from "react";
import { Plus, FileText, DollarSign, Clock, AlertCircle, Download } from "lucide-react";
import toast from "react-hot-toast";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { InvoiceModal } from "@/components/invoices/invoice-modal";
import type { Invoice, Client } from "@/types";
import { downloadInvoicePDF } from "@/lib/pdf";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidAmount: 0,
    outstanding: 0,
    overdueCount: 0,
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const [invoicesRes, statsRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/invoices?action=stats"),
      ]);

      const invoicesData = await invoicesRes.json();
      const statsData = await statsRes.json();

      if (invoicesData.success) setInvoices(invoicesData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      const data = await response.json();
      if (data.success) setClients(data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const response = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        toast.success("Invoice deleted successfully");
        await fetchInvoices();
      } else {
        toast.error(data.error || "Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingInvoice(null);
    fetchInvoices();
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export/invoices");

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoices_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Invoices exported successfully");
    } catch (error) {
      console.error("Error exporting invoices:", error);
      toast.error("Failed to export invoices");
    }
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    try {
      const client = clients.find((c) => c.id === invoice.clientId) || null;

      // You can customize business info here or fetch from settings
      const businessInfo = {
        name: "Your Business Name",
        email: "business@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business St, City, State 12345",
      };

      downloadInvoicePDF(invoice, client, businessInfo);
      toast.success("Invoice PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download invoice PDF");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">Track and manage your invoices</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600 mt-2">${stats.paidAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">${stats.outstanding.toFixed(2)}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{stats.overdueCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Invoice list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No invoices yet</p>
              <Button onClick={() => setShowModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Invoice
              </Button>
            </div>
          ) : (
            <InvoiceList
              invoices={invoices}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownloadPDF={handleDownloadPDF}
            />
          )}
        </div>
      </div>

      {showModal && <InvoiceModal invoice={editingInvoice} onClose={handleModalClose} />}
    </AppLayout>
  );
}
