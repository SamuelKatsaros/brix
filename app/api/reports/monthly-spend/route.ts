import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const invoices = await store.getInvoices();
        const stats = await store.getStats();
        const vendors = store.getVendors();
        const properties = store.getProperties();

        // Filter invoices for current month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.date);
            return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
        });

        // Create PDF
        const doc = new jsPDF();
        let yPos = 20;

        // Header with Logo
        const logoPath = path.join(process.cwd(), 'public', 'brix.png');
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            const logoBase64 = logoBuffer.toString('base64');
            doc.addImage(logoBase64, 'PNG', 20, yPos, 60, 20);
        } else {
            doc.setFontSize(24);
            doc.text('BRIX', 20, yPos + 15);
        }

        doc.setFontSize(10);
        doc.text(`Generated: ${now.toLocaleDateString()}`, 180, yPos + 10);
        
        yPos = 50;

        // Title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        const title = 'Monthly Maintenance Spend Report';
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (210 - titleWidth) / 2, yPos);
        
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        const monthText = `${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
        const monthWidth = doc.getTextWidth(monthText);
        doc.text(monthText, (210 - monthWidth) / 2, yPos);
        
        yPos += 20;

        // Executive Summary
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Executive Summary', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Total Spend: ${formatCurrency(stats.totalSpend)}`, 20, yPos);
        yPos += 7;
        doc.text(`Identified Savings: ${formatCurrency(stats.totalSavings)}`, 20, yPos);
        yPos += 7;
        doc.text(`Invoices Processed: ${stats.invoiceCount}`, 20, yPos);
        yPos += 7;
        doc.text(`Flagged for Review: ${stats.flaggedCount}`, 20, yPos);
        yPos += 15;

        // Spend by Property
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Spend by Property', 20, yPos);
        yPos += 10;
        
        const propertySpend: Record<string, number> = {};
        monthlyInvoices.forEach(inv => {
            const prop = properties.find(p => p.id === inv.propertyId);
            const propName = prop?.name || 'Unknown';
            propertySpend[propName] = (propertySpend[propName] || 0) + inv.totalAmount;
        });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        Object.entries(propertySpend).forEach(([prop, amount]) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${prop}: ${formatCurrency(amount)}`, 20, yPos);
            yPos += 7;
        });
        yPos += 10;

        // Spend by Vendor
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Spend by Vendor', 20, yPos);
        yPos += 10;
        
        const vendorSpend: Record<string, number> = {};
        monthlyInvoices.forEach(inv => {
            const vendor = vendors.find(v => v.id === inv.vendorId);
            const vendorName = vendor?.name || 'Unknown';
            vendorSpend[vendorName] = (vendorSpend[vendorName] || 0) + inv.totalAmount;
        });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        Object.entries(vendorSpend).forEach(([vendor, amount]) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${vendor}: ${formatCurrency(amount)}`, 20, yPos);
            yPos += 7;
        });
        yPos += 10;

        // Detailed Invoice List
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Detailed Invoice List', 20, yPos);
        yPos += 10;
        
        monthlyInvoices.forEach((inv) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            const vendor = vendors.find(v => v.id === inv.vendorId);
            const property = properties.find(p => p.id === inv.propertyId);
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text(`Invoice ${inv.invoiceNumber}`, 20, yPos);
            yPos += 7;
            
            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.text(`Vendor: ${vendor?.name || 'Unknown'} | Property: ${property?.name || 'Unknown'}`, 20, yPos);
            yPos += 7;
            doc.text(`Date: ${new Date(inv.date).toLocaleDateString()} | Amount: ${formatCurrency(inv.totalAmount)} | Status: ${inv.status}`, 20, yPos);
            yPos += 7;
            
            if (inv.analysis?.flags.length) {
                doc.setTextColor(255, 0, 0);
                doc.text(`Flags: ${inv.analysis.flags.join(', ')}`, 20, yPos);
                doc.setTextColor(0, 0, 0);
                yPos += 7;
            }
            yPos += 5;
        });

        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="monthly-maintenance-spend-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
