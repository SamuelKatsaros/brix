'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvoiceDetail } from './InvoiceDetail';
import { Invoice } from '@/types';

export function UploadForm() {
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<Invoice | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('vendorId', 'vend-2'); // Hardcoded for demo
        formData.append('propertyId', 'prop-1');

        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            // Show summary instead of redirecting
            const invoice = await res.json();
            setAnalysisResult(invoice);
        } catch (error) {
            console.error(error);
            setIsUploading(false);
        }
    };

    if (analysisResult) {
        return (
            <div className="w-full h-full">
                <div className="mb-4">
                </div>
                <InvoiceDetail
                    invoice={analysisResult}
                    vendorName="Budget Fixers" // Hardcoded for demo matching the API default
                    propertyName="Sunset Heights" // Hardcoded for demo matching the API default
                />
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                className={cn(
                    "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
                    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    file ? "bg-muted/30" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <div className="space-y-1">
                            <p className="text-lg font-medium">Analyzing Invoice...</p>
                            <p className="text-sm text-muted-foreground">Our AI is extracting line items and checking pricing.</p>
                        </div>
                    </div>
                ) : file ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                            className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-8"
                        >
                            Start Analysis
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-medium">Drag & Drop Invoice</p>
                            <p className="text-sm text-muted-foreground">or click to browse (PDF, JPG, PNG)</p>
                        </div>
                    </div>
                )}
            </div>

            {!isUploading && !file && (
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-card text-center">
                        <div className="mx-auto h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <span className="text-blue-600 font-bold">1</span>
                        </div>
                        <p className="text-sm font-medium">Upload Invoice</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-card text-center opacity-50">
                        <div className="mx-auto h-8 w-8 rounded-full bg-muted flex items-center justify-center mb-2">
                            <span className="text-muted-foreground font-bold">2</span>
                        </div>
                        <p className="text-sm font-medium">AI Analysis</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-card text-center opacity-50">
                        <div className="mx-auto h-8 w-8 rounded-full bg-muted flex items-center justify-center mb-2">
                            <span className="text-muted-foreground font-bold">3</span>
                        </div>
                        <p className="text-sm font-medium">Review & Save</p>
                    </div>
                </div>
            )}
        </div>
    );
}
