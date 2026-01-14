"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Invoice, Client, InvoiceItem } from "@/types";

interface InvoiceModalProps {
  invoice?: Invoice | null;
  onClose: () => void;
}

export function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  const isEditing = !!invoice;

  const [formData, setFormData] = useState({
    clientId: invoice?.clientId || "",
    issueDate: invoice?.issueDate || new Date().toISOString().split("T")[0],
    dueDate: invoice?.dueDate || "",
    status: invoice?.status || "draft",
    taxRate: invoice?.taxRate?.toString() || "0",
    paidAmount: invoice?.paidAmount?.toString() || "0",
    notes: invoice?.notes || "",
    terms: invoice?.terms || "",
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items || [{ id: "", invoiceId: "", description: "", quantity: 1, unitPrice: 0, amount: 0 }]
  );

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      const data = await response.json();
      if (data.success) setClients(data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate amount
    if (field === "quantity" || field === "unitPrice") {
      const qty = field === "quantity" ? Number(value) : newItems[index].quantity;
      const price = field === "unitPrice" ? Number(value) : newItems[index].unitPrice;
      newItems[index].amount = qty * price;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: "", invoiceId: "", description: "", quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = (subtotal * parseFloat(formData.taxRate || "0")) / 100;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.clientId) {
        setError("Please select a client");
        setLoading(false);
        return;
      }

      if (items.some((item) => !item.description || item.quantity <= 0 || item.unitPrice < 0)) {
        setError("Please fill in all line items correctly");
        setLoading(false);
        return;
      }

      const payload = {
        clientId: formData.clientId,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        status: formData.status,
        taxRate: parseFloat(formData.taxRate),
        paidAmount: parseFloat(formData.paidAmount),
        notes: formData.notes.trim() || undefined,
        terms: formData.terms.trim() || undefined,
        items: items.map(({ id, invoiceId, ...item }) => item),
      };

      const url = isEditing ? `/api/invoices/${invoice.id}` : "/api/invoices";
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to save invoice");

      onClose();
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit Invoice" : "Create New Invoice"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="clientId">Client *</Label>
                <Select id="clientId" name="clientId" value={formData.clientId} onChange={handleChange} required className="mt-1">
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input id="issueDate" name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} required className="mt-1" />
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required className="mt-1" />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1">
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input id="taxRate" name="taxRate" type="number" step="0.01" min="0" value={formData.taxRate} onChange={handleChange} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="paidAmount">Paid Amount</Label>
                <Input id="paidAmount" name="paidAmount" type="number" step="0.01" min="0" value={formData.paidAmount} onChange={handleChange} className="mt-1" />
              </div>
            </div>

            {/* Line Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Line Items *</Label>
                <Button type="button" size="sm" variant="outline" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-2 text-sm font-medium text-gray-900">${item.amount.toFixed(2)}</div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeItem(index)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-2 text-right">
                <div className="flex justify-end gap-4">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-end gap-4 text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="terms">Payment Terms</Label>
                <Textarea id="terms" name="terms" value={formData.terms} onChange={handleChange} rows={3} className="mt-1" placeholder="e.g., Net 30" />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1" placeholder="Additional notes..." />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update Invoice" : "Create Invoice"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
