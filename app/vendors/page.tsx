import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
    const vendors = store.getVendors();
    const invoices = await store.getInvoices();

    // Calculate stats per vendor
    const vendorStats = vendors.map(vendor => {
        const vendorInvoices = invoices.filter(inv => inv.vendorId === vendor.id);
        const totalSpend = vendorInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        const flaggedCount = vendorInvoices.filter(inv =>
            inv.analysis?.recommendedAction === 'review' || inv.analysis?.recommendedAction === 'dispute'
        ).length;
        const flaggedRate = vendorInvoices.length > 0 ? (flaggedCount / vendorInvoices.length) * 100 : 0;

        return {
            ...vendor,
            totalSpend,
            invoiceCount: vendorInvoices.length,
            flaggedRate: Math.round(flaggedRate)
        };
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Vendor Directory</h2>
                <p className="text-sm text-muted-foreground">{vendors.length} active vendors</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vendorStats
                    .sort((a, b) => b.totalSpend - a.totalSpend) // Sort by spend
                    .map((vendor) => (
                        <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold">{vendor.name}</CardTitle>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${vendor.trustScore > 80 ? 'bg-emerald-100 text-emerald-800' :
                                    vendor.trustScore > 50 ? 'bg-amber-100 text-amber-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    Trust: {vendor.trustScore}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-muted-foreground capitalize">
                                    {vendor.trade} • {vendor.serviceArea}
                                </div>

                                {/* Vendor Stats */}
                                <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-border">
                                    <div>
                                        <div className="text-xs text-muted-foreground">Total Spend</div>
                                        <div className="text-lg font-bold">{formatCurrency(vendor.totalSpend)}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Invoices</div>
                                        <div className="text-lg font-bold">{vendor.invoiceCount}</div>
                                    </div>
                                </div>

                                {vendor.flaggedRate > 0 && (
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Flagged Rate</span>
                                        <span className={`font-medium ${vendor.flaggedRate > 30 ? 'text-red-600' : 'text-amber-600'}`}>
                                            {vendor.flaggedRate}%
                                        </span>
                                    </div>
                                )}

                                {/* Base Pricing */}
                                <div className="space-y-2">
                                    <div className="text-xs font-medium text-muted-foreground">Base Pricing</div>
                                    {Object.entries(vendor.pricing).slice(0, 2).map(([item, price]) => (
                                        <div key={item} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{item}</span>
                                            <span className="font-medium">{formatCurrency(price)}</span>
                                        </div>
                                    ))}
                                    {Object.keys(vendor.pricing).length > 2 && (
                                        <div className="text-xs text-muted-foreground">+{Object.keys(vendor.pricing).length - 2} more</div>
                                    )}
                                </div>

                                {vendor.isPreferred && (
                                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-center font-medium">
                                        ⭐ Preferred Vendor
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
