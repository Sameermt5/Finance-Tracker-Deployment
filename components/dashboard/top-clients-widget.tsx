"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface TopClient {
  clientId: string;
  clientName: string;
  totalRevenue: number;
  transactionCount: number;
}

interface TopClientsWidgetProps {
  clients: TopClient[];
}

export function TopClientsWidget({ clients }: TopClientsWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Clients</CardTitle>
        <Link
          href="/clients"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No client data yet
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client, index) => (
              <div
                key={client.clientId}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.clientName}</p>
                    <p className="text-sm text-gray-500">
                      {client.transactionCount}{" "}
                      {client.transactionCount === 1 ? "transaction" : "transactions"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatCurrency(client.totalRevenue)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    Revenue
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
