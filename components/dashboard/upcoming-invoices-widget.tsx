"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface UpcomingInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  dueDate: string;
  total: number;
  status: string;
}

interface UpcomingInvoicesWidgetProps {
  invoices: UpcomingInvoice[];
}

export function UpcomingInvoicesWidget({ invoices }: UpcomingInvoicesWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Invoices</CardTitle>
        <Link
          href="/invoices"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No upcoming invoices
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{invoice.clientName}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3" />
                    Due {formatDate(invoice.dueDate)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(invoice.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
