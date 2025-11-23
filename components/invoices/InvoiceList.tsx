'use client';

import { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
    const [vendors, setVendors] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/vendors')
            .then(res => res.json())
            .then(setVendors);
    }, []);

    const getVendorName = (vendorId: string) => {
        const vendor = vendors.find(v => v.id === vendorId);
        return vendor?.name || 'Unknown Vendor';
    };

    if (invoices.length === 0) {
        return (
            <div className="rounded-md border border-border bg-card p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Upload your first invoice to start analyzing maintenance costs
                </p>
                <Link
                    href="/invoices/new"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                >
                    Upload Invoice
                </Link>
            </div>
        );
    }

    return (
        <div className="rounded-md border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b border-border text-left">
                        <th className="p-4 font-medium text-muted-foreground">Invoice #</th>
                        <th className="p-4 font-medium text-muted-foreground">Date</th>
                        <th className="p-4 font-medium text-muted-foreground">Vendor</th>
                        <th className="p-4 font-medium text-muted-foreground">Amount</th>
                        <th className="p-4 font-medium text-muted-foreground">Status</th>
                        <th className="p-4 font-medium text-muted-foreground">Trust Score</th>
                        <th className="p-4 font-medium text-muted-foreground"></th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                            <td className="p-4 font-medium">{invoice.invoiceNumber}</td>
                            <td className="p-4 text-muted-foreground">{formatDate(invoice.date)}</td>
                            <td className="p-4">{getVendorName(invoice.vendorId)}</td>
                            <td className="p-4 font-medium">{formatCurrency(invoice.totalAmount)}</td>
                            <td className="p-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${invoice.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                        invoice.status === 'review' ? 'bg-amber-100 text-amber-800' :
                                            invoice.status === 'disputed' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                    {invoice.status}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${(invoice.analysis?.trustScore || 0) > 80 ? 'bg-emerald-500' :
                                                    (invoice.analysis?.trustScore || 0) > 50 ? 'bg-amber-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${invoice.analysis?.trustScore || 0}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{invoice.analysis?.trustScore}%</span>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <Link href={`/invoices/${invoice.id}`} className="text-primary hover:underline font-medium">
                                    Review
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
