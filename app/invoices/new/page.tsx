import { UploadForm } from "@/components/invoices/UploadForm";

export default function NewInvoicePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">New Invoice Review</h2>
                    <p className="text-muted-foreground">Upload a vendor invoice to start the AI verification process.</p>
                </div>
            </div>

            <UploadForm />
        </div>
    );
}
