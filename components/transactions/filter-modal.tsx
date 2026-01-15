"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DATE_RANGE_PRESETS, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, PAYMENT_METHODS } from "@/lib/constants";
import { getDateRange } from "@/lib/utils";
import type { TransactionFilter, Client } from "@/types";

interface FilterModalProps {
  onClose: () => void;
  onApply: (filters: TransactionFilter) => void;
  clients: Client[];
  currentFilters?: TransactionFilter;
}

export function FilterModal({ onClose, onApply, clients, currentFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<TransactionFilter>(currentFilters || {});
  const [datePreset, setDatePreset] = useState("custom");

  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);

    if (preset === "custom" || preset === "all_time") {
      setFilters({ ...filters, startDate: undefined, endDate: undefined });
    } else {
      const range = getDateRange(preset);
      setFilters({
        ...filters,
        startDate: range.start.toISOString().split("T")[0],
        endDate: range.end.toISOString().split("T")[0],
      });
    }
  };

  const handleChange = (field: keyof TransactionFilter, value: any) => {
    setFilters({ ...filters, [field]: value || undefined });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
    setDatePreset("custom");
  };

  const allCategories = [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Filter Transactions</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Date Range */}
            <div>
              <Label htmlFor="datePreset">Date Range</Label>
              <Select
                id="datePreset"
                value={datePreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="mt-1"
              >
                {DATE_RANGE_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </Select>
            </div>

            {datePreset === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  id="type"
                  value={filters.type || ""}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="mt-1"
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Select>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={filters.category || ""}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="mt-1"
                >
                  <option value="">All Categories</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Payment Method */}
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  id="paymentMethod"
                  value={filters.paymentMethod || ""}
                  onChange={(e) => handleChange("paymentMethod", e.target.value)}
                  className="mt-1"
                >
                  <option value="">All Methods</option>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Client */}
              <div>
                <Label htmlFor="clientId">Client</Label>
                <Select
                  id="clientId"
                  value={filters.clientId || ""}
                  onChange={(e) => handleChange("clientId", e.target.value)}
                  className="mt-1"
                >
                  <option value="">All Clients</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Amount Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAmount">Min Amount</Label>
                <Input
                  id="minAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.minAmount || ""}
                  onChange={(e) => handleChange("minAmount", parseFloat(e.target.value))}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxAmount">Max Amount</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.maxAmount || ""}
                  onChange={(e) => handleChange("maxAmount", parseFloat(e.target.value))}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between p-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
