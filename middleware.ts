export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/clients/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    "/api/transactions/:path*",
    "/api/clients/:path*",
    "/api/invoices/:path*",
  ],
};
