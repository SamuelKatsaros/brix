'use client';

import { LineItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, Check, X } from "lucide-react";

interface LineItemsTableProps {
    items: LineItem[];
}

export function LineItemsTable({ items }: LineItemsTableProps) {
    return (
        <div className="rounded-md border border-border">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b border-border text-left">
                        <th className="p-4 font-medium text-muted-foreground">Description</th>
                        <th className="p-4 font-medium text-muted-foreground w-24">Qty</th>
                        <th className="p-4 font-medium text-muted-foreground w-32">Unit Price</th>
                        <th className="p-4 font-medium text-muted-foreground w-32 text-right">Total</th>
                        <th className="p-4 font-medium text-muted-foreground w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className={`border-b border-border last:border-0 ${item.flagged ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
                            <td className="p-4">
                                <div className="font-medium">{item.description}</div>
                                {item.flagged && (
                                    <div className="flex items-center mt-1 text-xs text-amber-600 font-medium">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        {item.flagReason}
                                    </div>
                                )}
                            </td>
                            <td className="p-4">{item.quantity}</td>
                            <td className="p-4">
                                <div className="flex flex-col">
                                    <span>{formatCurrency(item.unitPrice)}</span>
                                    {item.baselinePrice && (
                                        <span className="text-xs text-muted-foreground line-through">
                                            Base: {formatCurrency(item.baselinePrice)}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 text-right font-medium">
                                {formatCurrency(item.total)}
                            </td>
                            <td className="p-4 text-center">
                                {item.flagged ? (
                                    <div className="h-2 w-2 rounded-full bg-amber-500 mx-auto" />
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 mx-auto" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
