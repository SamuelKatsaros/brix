import { InvoiceDetail } from "@/components/invoices/InvoiceDetail";
import { store } from "@/lib/store";
import { notFound } from "next/navigation";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const invoice = store.getInvoice(id);

    if (!invoice) {
        notFound();
    }

    const vendor = store.getVendors().find(v => v.id === invoice.vendorId);
    const property = store.getProperties().find(p => p.id === invoice.propertyId);

    return <InvoiceDetail invoice={invoice} vendorName={vendor?.name} propertyName={property?.name} />;
}
