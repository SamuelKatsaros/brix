import { store } from "@/lib/store";
import { AIAnalysisService } from "@/services/ai-service";
import { Invoice } from "@/types";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const invoices = await store.getInvoices();
    return NextResponse.json(invoices);
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const vendorId = formData.get('vendorId') as string;
        const propertyId = formData.get('propertyId') as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 1. Trigger AI Analysis
        const { lineItems, analysis } = await AIAnalysisService.analyzeInvoice(file);

        // 2. Create Invoice Record
        const newInvoice: Invoice = {
            id: uuidv4(),
            orgId: 'org-1', // Hardcoded for MVP
            vendorId: vendorId || 'vend-2', // Default to "Budget Fixers" if not specified
            propertyId: propertyId || 'prop-1',
            invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString(),
            subtotal: lineItems.reduce((sum, item) => sum + item.total, 0),
            tax: 0,
            totalAmount: lineItems.reduce((sum, item) => sum + item.total, 0),
            status: analysis.recommendedAction === 'approve' ? 'approved' : 'review',
            fileUrl: '/invoices/sample_upload.jpg', // Mocked for MVP since we can't persist file easily in serverless function
            lineItems,
            analysis,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await store.addInvoice(newInvoice);

        return NextResponse.json(newInvoice);
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
