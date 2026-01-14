"use client";

import { Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(transaction.date)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="font-medium">{transaction.description}</div>
                {transaction.notes && (
                  <div className="text-gray-500 text-xs mt-1">
                    {transaction.notes}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Badge variant="secondary">{transaction.category}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {transaction.type === "income" ? (
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Income
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Expense
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                <span
                  className={
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
