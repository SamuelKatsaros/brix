import { store } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
    const properties = store.getProperties();
    const invoices = await store.getInvoices();

    // Calculate invoice count per property
    const propertyStats = properties.map(prop => {
        const propInvoices = invoices.filter(inv => inv.propertyId === prop.id);
        const totalSpend = propInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

        return {
            ...prop,
            invoiceCount: propInvoices.length,
            totalSpend
        };
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
                <p className="text-sm text-muted-foreground">
                    {properties.length} properties • {properties.reduce((sum, p) => sum + p.units, 0)} total units
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {propertyStats
                    .sort((a, b) => b.totalSpend - a.totalSpend)
                    .map((prop) => (
                        <Card key={prop.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            {/* Property Image */}
                            <div className="h-32 w-full relative overflow-hidden">
                                {prop.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={prop.imageUrl}
                                        alt={prop.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-lg">{prop.name}</h3>
                                </div>
                            </div>

                            <CardContent className="pt-4 space-y-4">
                                {/* Address */}
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <p className="text-muted-foreground">{prop.address}</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 py-3 border-t border-border">
                                    <div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                            <Users className="h-3 w-3" />
                                            Units
                                        </div>
                                        <div className="text-2xl font-bold">{prop.units}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Maintenance</div>
                                        <div className="text-2xl font-bold">{prop.invoiceCount}</div>
                                        <div className="text-xs text-muted-foreground">invoices</div>
                                    </div>
                                </div>

                                {/* Spend Summary */}
                                {prop.totalSpend > 0 && (
                                    <div className="bg-muted/50 rounded-md p-3">
                                        <div className="text-xs text-muted-foreground mb-1">Total Maintenance Spend</div>
                                        <div className="text-lg font-bold text-primary">
                                            ${prop.totalSpend.toLocaleString()}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
