"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-blue-600">Finance Tracker</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={cn(
                              isActive
                                ? "text-blue-600"
                                : "text-gray-400 group-hover:text-blue-600",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Finance Tracker
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="relative z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/80"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <h1 className="text-xl font-bold text-blue-600">
                    Finance Tracker
                  </h1>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <item.icon
                                  className={cn(
                                    isActive
                                      ? "text-blue-600"
                                      : "text-gray-400 group-hover:text-blue-600",
                                    "h-6 w-6 shrink-0"
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Sign Out
                      </Button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
