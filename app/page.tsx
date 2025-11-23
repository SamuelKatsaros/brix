import { StatsCards } from "@/components/dashboard/StatsCards";
import { SpendChart } from "@/components/dashboard/SpendChart";
import { store } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await store.getStats();
  const recentInvoices = (await store.getInvoices()).slice(0, 5);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/invoices/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
            New Invoice Review
          </Link>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SpendChart />

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {store.getVendors().find(v => v.id === invoice.vendorId)?.name || 'Unknown Vendor'}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {formatCurrency(invoice.totalAmount)}
                  </div>
                  <div className={`ml-4 text-xs px-2 py-1 rounded-full ${invoice.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    invoice.status === 'review' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {invoice.status}
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Link href="/invoices" className="text-sm text-primary hover:underline flex items-center">
                  View all invoices <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
