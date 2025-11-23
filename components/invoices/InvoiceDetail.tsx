'use client';

import { Invoice } from "@/types";
import { LineItemsTable } from "./LineItemsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // I'll need to create this or use standard button
import { ArrowLeft, CheckCircle, AlertOctagon, FileText, ShieldCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function InvoiceDetail({ invoice: initialInvoice, vendorName, propertyName }: { invoice: Invoice, vendorName?: string, propertyName?: string }) {
    const [invoice, setInvoice] = useState(initialInvoice);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const handleAction = async (status: 'approved' | 'disputed') => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/invoices/${invoice.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                const updated = await res.json();
                setInvoice(updated);
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsUpdating(false);
        }
    };

    const trustScoreColor = (invoice.analysis?.trustScore || 0) > 80 ? 'text-emerald-600' :
        (invoice.analysis?.trustScore || 0) > 50 ? 'text-amber-600' : 'text-red-600';

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-card px-8 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            {invoice.invoiceNumber}
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${invoice.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                invoice.status === 'review' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                    'bg-gray-50 border-gray-200 text-gray-700'
                                }`}>
                                {invoice.status.toUpperCase()}
                            </span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {formatDate(invoice.date)} • {formatCurrency(invoice.totalAmount)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {invoice.status === 'review' && (
                        <>
                            <button
                                onClick={() => handleAction('disputed')}
                                disabled={isUpdating}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                            >
                                Dispute
                            </button>
                            <button
                                onClick={() => handleAction('approved')}
                                disabled={isUpdating}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm"
                            >
                                Approve Invoice
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Document Viewer */}
                <div className="w-1/2 bg-muted/30 border-r border-border p-6 overflow-y-auto flex flex-col items-center">
                    <div className="bg-white shadow-lg rounded-sm w-full max-w-xl min-h-[800px] p-8 relative">
                        {/* Mock Invoice Document Look */}
                        <div className="flex justify-between mb-8">
                            <div>
                                <div className="text-xl font-bold text-gray-800 mb-2">{vendorName || 'Vendor'}</div>
                                <div className="text-sm text-gray-600">{propertyName || 'Property'}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800">INVOICE</div>
                                <div className="text-gray-500">#{invoice.invoiceNumber}</div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="h-4 w-full bg-gray-50"></div>
                            <div className="h-4 w-3/4 bg-gray-50"></div>
                            <div className="h-4 w-1/2 bg-gray-50"></div>
                        </div>

                        <div className="border-t border-b border-gray-200 py-4 mb-8">
                            <div className="flex justify-between font-bold mb-2">
                                <span>Description</span>
                                <span>Amount</span>
                            </div>
                            {invoice.lineItems.map((item, i) => (
                                <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                    <span className="text-gray-600">{item.description}</span>
                                    <span className="text-gray-800">{formatCurrency(item.total)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <div className="w-48">
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                <div className="flex justify-between py-1 font-bold text-lg border-t border-gray-200 mt-2 pt-2">
                                    <span>Total</span>
                                    <span>{formatCurrency(invoice.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Overlay for "Scanned" effect */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-white/10"></div>
                    </div>
                </div>

                {/* Right: Analysis & Data */}
                <div className="w-1/2 overflow-y-auto p-6 space-y-6 bg-background">

                    {/* AI Summary Card */}
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    AI Analysis Summary
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Trust Score</span>
                                    <span className={`text-2xl font-bold ${trustScoreColor}`}>
                                        {invoice.analysis?.trustScore}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {invoice.analysis?.summary}
                            </p>

                            {invoice.analysis?.flags && invoice.analysis.flags.length > 0 && (
                                <div className="space-y-2">
                                    {invoice.analysis.flags.map((flag, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-md border border-amber-100">
                                            <AlertOctagon className="h-4 w-4" />
                                            {flag}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {invoice.analysis?.savingsPotential ? (
                                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Potential Savings</span>
                                    <span className="text-lg font-bold text-emerald-600">{formatCurrency(invoice.analysis.savingsPotential)}</span>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* Line Items */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Line Items</h3>
                        <LineItemsTable items={invoice.lineItems} />
                    </div>

                    {/* Vendor Comparison (Mock) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Vendor Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-border">
                                            <span className="text-xs font-bold">RR</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Rapid Rooter (Current)</p>
                                            <p className="text-xs text-muted-foreground">Avg. {formatCurrency(150)}/hr</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{formatCurrency(invoice.totalAmount)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 border border-emerald-200 bg-emerald-50/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-border">
                                            <span className="text-xs font-bold">JP</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-emerald-900">Joe's Plumbing (Recommended)</p>
                                            <p className="text-xs text-emerald-700">Avg. {formatCurrency(120)}/hr</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-700">~{formatCurrency(invoice.totalAmount * 0.8)}</p>
                                        <p className="text-xs text-emerald-600">Save 20%</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
