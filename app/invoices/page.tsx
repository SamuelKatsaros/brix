import { InvoiceList } from "@/components/invoices/InvoiceList";
import { store } from "@/lib/store";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
    const invoices = await store.getInvoices();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/invoices/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                        <Plus className="mr-2 h-4 w-4" /> New Invoice
                    </Link>
                </div>
            </div>

            <InvoiceList invoices={invoices} />
        </div>
    );
}
