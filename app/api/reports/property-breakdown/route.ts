import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export async function GET() {
    try {
        const invoices = await store.getInvoices();
        const properties = store.getProperties();
        const vendors = store.getVendors();

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        
        // Add logo (if possible) - ExcelJS doesn't directly support images in headers easily
        // We'll add it as a comment or in the first row
        
        // Property Breakdown Sheet
        const propertySheet = workbook.addWorksheet('Property Breakdown');
        
        // Header row
        propertySheet.addRow(['Property', 'Address', 'Units', 'Total Spend', 'Invoice Count', 'Avg per Unit']);
        propertySheet.getRow(1).font = { bold: true };
        propertySheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Calculate property metrics
        const propertyMetrics = properties.map(property => {
            const propertyInvoices = invoices.filter(inv => inv.propertyId === property.id);
            const totalSpend = propertyInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
            const avgPerUnit = property.units > 0 ? totalSpend / property.units : 0;

            return {
                name: property.name,
                address: property.address,
                units: property.units,
                totalSpend,
                invoiceCount: propertyInvoices.length,
                avgPerUnit,
            };
        });

        // Add data rows
        propertyMetrics.forEach(metric => {
            propertySheet.addRow([
                metric.name,
                metric.address,
                metric.units,
                metric.totalSpend,
                metric.invoiceCount,
                metric.avgPerUnit.toFixed(2),
            ]);
        });

        // Format columns
        propertySheet.columns.forEach((column, index) => {
            column.width = index === 1 ? 40 : 15;
        });

        // Detailed Invoice Data Sheet
        const invoiceSheet = workbook.addWorksheet('Detailed Invoices');
        
        invoiceSheet.addRow([
            'Invoice #',
            'Date',
            'Vendor',
            'Property',
            'Amount',
            'Status',
            'Trust Score',
            'Savings Potential',
            'Flags'
        ]);
        invoiceSheet.getRow(1).font = { bold: true };
        invoiceSheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        invoices.forEach(inv => {
            const vendor = vendors.find(v => v.id === inv.vendorId);
            const property = properties.find(p => p.id === inv.propertyId);
            
            invoiceSheet.addRow([
                inv.invoiceNumber,
                new Date(inv.date).toLocaleDateString(),
                vendor?.name || 'Unknown',
                property?.name || 'Unknown',
                inv.totalAmount,
                inv.status,
                inv.analysis?.trustScore || 0,
                inv.analysis?.savingsPotential || 0,
                inv.analysis?.flags.join('; ') || '',
            ]);
        });

        invoiceSheet.columns.forEach((column, index) => {
            column.width = index === 2 || index === 3 ? 25 : 15;
        });

        // Generate Excel buffer
        const buffer = await workbook.xlsx.writeBuffer();

        const now = new Date();
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="property-maintenance-breakdown-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.xlsx"`,
            },
        });
    } catch (error) {
        console.error('Error generating Excel:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}

