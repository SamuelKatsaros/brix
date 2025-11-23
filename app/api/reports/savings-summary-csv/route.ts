import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export async function GET() {
    try {
        const invoices = await store.getInvoices();
        const vendors = store.getVendors();
        const properties = store.getProperties();
        const stats = await store.getStats();

        // CSV Header
        let csv = 'Invoice Number,Date,Vendor,Property,Amount,Savings Potential,Status,Flags,Recommendation\n';

        // Filter invoices with savings potential
        const savingsInvoices = invoices.filter(inv => (inv.analysis?.savingsPotential || 0) > 0);

        savingsInvoices.forEach(inv => {
            const vendor = vendors.find(v => v.id === inv.vendorId);
            const property = properties.find(p => p.id === inv.propertyId);
            
            const row = [
                inv.invoiceNumber,
                new Date(inv.date).toLocaleDateString(),
                `"${vendor?.name || 'Unknown'}"`,
                `"${property?.name || 'Unknown'}"`,
                inv.totalAmount,
                inv.analysis?.savingsPotential || 0,
                inv.status,
                `"${inv.analysis?.flags.join('; ') || ''}"`,
                inv.analysis?.recommendedAction || '',
            ].join(',');
            
            csv += row + '\n';
        });

        // Add summary row
        csv += '\n';
        csv += `Total Identified Savings,${stats.totalSavings}\n`;
        csv += `Total Maintenance Spend,${stats.totalSpend}\n`;
        csv += `ROI Percentage,${((stats.totalSavings / stats.totalSpend) * 100).toFixed(1)}%\n`;

        const now = new Date();
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="cost-savings-summary-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.csv"`,
            },
        });
    } catch (error) {
        console.error('Error generating CSV:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}

