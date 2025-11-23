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

        const savingsInvoices = invoices.filter(inv => (inv.analysis?.savingsPotential || 0) > 0);
        const disputedInvoices = invoices.filter(inv => inv.status === 'disputed');
        const totalDisputed = disputedInvoices.reduce((sum, inv) => sum + (inv.analysis?.savingsPotential || 0), 0);

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

        const now = new Date();
        doc.setFontSize(10);
        doc.text(`Generated: ${now.toLocaleDateString()}`, 180, yPos + 10);
        
        yPos = 50;

        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        const title = 'Cost Savings Summary';
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (210 - titleWidth) / 2, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const subtitle = 'AI-Identified Savings Opportunities & ROI Analysis';
        const subtitleWidth = doc.getTextWidth(subtitle);
        doc.text(subtitle, (210 - subtitleWidth) / 2, yPos);
        yPos += 20;

        // Executive Summary
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Executive Summary', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Identified Savings: ${formatCurrency(stats.totalSavings)}`, 20, yPos);
        yPos += 7;
        doc.text(`Total Maintenance Spend: ${formatCurrency(stats.totalSpend)}`, 20, yPos);
        yPos += 7;
        doc.text(`ROI: ${((stats.totalSavings / stats.totalSpend) * 100).toFixed(1)}%`, 20, yPos);
        yPos += 7;
        doc.text(`Flagged Invoices: ${stats.flaggedCount} requiring review`, 20, yPos);
        yPos += 20;

        // Savings Opportunities
        if (savingsInvoices.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Identified Savings Opportunities', 20, yPos);
            yPos += 10;
            
            savingsInvoices.forEach((inv) => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                const vendor = vendors.find(v => v.id === inv.vendorId);
                const property = properties.find(p => p.id === inv.propertyId);
                
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(`Invoice ${inv.invoiceNumber}`, 20, yPos);
                yPos += 7;
                
                doc.setFont('helvetica', 'normal');
                doc.text(`Vendor: ${vendor?.name || 'Unknown'} | Property: ${property?.name || 'Unknown'}`, 20, yPos);
                yPos += 7;
                doc.text(`Potential Savings: ${formatCurrency(inv.analysis?.savingsPotential || 0)}`, 20, yPos);
                yPos += 7;
                doc.text(`Issues: ${inv.analysis?.flags.join(', ') || 'None'}`, 20, yPos);
                yPos += 7;
                doc.text(`Recommendation: ${inv.analysis?.recommendedAction?.toUpperCase() || 'REVIEW'}`, 20, yPos);
                yPos += 10;
            });
        }

        yPos += 10;

        // Disputed Charges
        if (disputedInvoices.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Successfully Disputed Charges', 20, yPos);
            yPos += 10;
            
            disputedInvoices.forEach((inv) => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                const vendor = vendors.find(v => v.id === inv.vendorId);
                
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(`Invoice ${inv.invoiceNumber}`, 20, yPos);
                yPos += 7;
                
                doc.setFont('helvetica', 'normal');
                doc.text(`Vendor: ${vendor?.name || 'Unknown'}`, 20, yPos);
                yPos += 7;
                doc.text(`Disputed Amount: ${formatCurrency(inv.analysis?.savingsPotential || 0)}`, 20, yPos);
                yPos += 10;
            });
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Total Disputed: ${formatCurrency(totalDisputed)}`, 20, yPos);
            yPos += 15;
        }

        // ROI Analysis
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('BrixAI System ROI', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`The BrixAI system has identified ${formatCurrency(stats.totalSavings)} in potential savings`, 20, yPos);
        yPos += 7;
        doc.text(`across ${stats.flaggedCount} flagged invoices.`, 20, yPos);
        yPos += 7;
        doc.text(`By leveraging AI-powered invoice analysis, property management teams can`, 20, yPos);
        yPos += 7;
        doc.text(`reduce maintenance costs and improve vendor relationships through data-driven insights.`, 20, yPos);

        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="cost-savings-summary-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
