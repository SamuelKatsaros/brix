import { store } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
    const stats = store.getStats();
    // Also return recent activity (just the latest 5 invoices for now)
    const recentInvoices = store.getInvoices().slice(0, 5);

    return NextResponse.json({
        stats,
        recentInvoices
    });
}
