import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const invoices = await store.getInvoices();
        const vendors = store.getVendors();

        // Calculate vendor metrics
        const vendorMetrics = vendors.map(vendor => {
            const vendorInvoices = invoices.filter(inv => inv.vendorId === vendor.id);
            const totalSpend = vendorInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
            const flaggedCount = vendorInvoices.filter(inv => inv.analysis?.recommendedAction === 'review' || inv.analysis?.recommendedAction === 'dispute').length;
            const avgTrustScore = vendorInvoices.length > 0
                ? vendorInvoices.reduce((sum, inv) => sum + (inv.analysis?.trustScore || 0), 0) / vendorInvoices.length
                : vendor.trustScore;
            const totalSavings = vendorInvoices.reduce((sum, inv) => sum + (inv.analysis?.savingsPotential || 0), 0);

            return {
                vendor,
                invoiceCount: vendorInvoices.length,
                totalSpend,
                flaggedCount,
                avgTrustScore: Math.round(avgTrustScore),
                totalSavings,
            };
        });

        vendorMetrics.sort((a, b) => b.avgTrustScore - a.avgTrustScore);

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
        doc.setFont(undefined, 'bold');
        const title = 'Vendor Performance Scorecard';
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (210 - titleWidth) / 2, yPos);
        yPos += 20;

        // Vendor Performance
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Vendor Performance Summary', 20, yPos);
        yPos += 10;

        vendorMetrics.forEach((metric) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(metric.vendor.name, 20, yPos);
            yPos += 7;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Trade: ${metric.vendor.trade} | Service Area: ${metric.vendor.serviceArea}`, 20, yPos);
            yPos += 7;
            doc.text(`Trust Score: ${metric.avgTrustScore}/100 ${metric.vendor.isPreferred ? '(Preferred Vendor)' : ''}`, 20, yPos);
            yPos += 7;
            doc.text(`Total Invoices: ${metric.invoiceCount} | Total Spend: ${formatCurrency(metric.totalSpend)}`, 20, yPos);
            yPos += 7;
            doc.text(`Flagged Invoices: ${metric.flaggedCount} | Potential Savings: ${formatCurrency(metric.totalSavings)}`, 20, yPos);
            yPos += 7;
            
            if (metric.flaggedCount > 0) {
                doc.setTextColor(255, 0, 0);
                doc.text('⚠️ Requires Review', 20, yPos);
                doc.setTextColor(0, 0, 0);
                yPos += 7;
            }
            yPos += 5;
        });

        yPos += 10;

        // Recommendations
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Recommendations', 20, yPos);
        yPos += 10;

        const preferredVendors = vendorMetrics.filter(m => m.vendor.isPreferred && m.avgTrustScore >= 85);
        const reviewVendors = vendorMetrics.filter(m => m.flaggedCount > 0 || m.avgTrustScore < 70);

        if (preferredVendors.length > 0) {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Recommended Vendors:', 20, yPos);
            yPos += 7;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            preferredVendors.forEach(m => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`• ${m.vendor.name} - High trust score (${m.avgTrustScore}/100)`, 20, yPos);
                yPos += 7;
            });
            yPos += 5;
        }

        if (reviewVendors.length > 0) {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Vendors Requiring Review:', 20, yPos);
            yPos += 7;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(255, 0, 0);
            reviewVendors.forEach(m => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`• ${m.vendor.name} - ${m.flaggedCount} flagged invoices, Trust Score: ${m.avgTrustScore}/100`, 20, yPos);
                yPos += 7;
            });
            doc.setTextColor(0, 0, 0);
        }

        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="vendor-performance-scorecard-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
