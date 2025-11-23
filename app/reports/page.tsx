'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, TrendingDown, Users, Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function ReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                setStats(data.stats);
                setLoading(false);
            });
    }, []);

    const downloadReport = async (type: string, format: 'pdf' | 'excel' | 'csv' = 'pdf') => {
        try {
            let endpoint = '';
            let filename = '';

            switch (type) {
                case 'Monthly Spend':
                    endpoint = '/api/reports/monthly-spend';
                    filename = 'monthly-maintenance-spend.pdf';
                    break;
                case 'Vendor Performance':
                    endpoint = '/api/reports/vendor-performance';
                    filename = 'vendor-performance-scorecard.pdf';
                    break;
                case 'Savings Summary':
                    if (format === 'csv') {
                        endpoint = '/api/reports/savings-summary-csv';
                        filename = 'cost-savings-summary.csv';
                    } else {
                        endpoint = '/api/reports/savings-summary';
                        filename = 'cost-savings-summary.pdf';
                    }
                    break;
                case 'Property Breakdown':
                    endpoint = '/api/reports/property-breakdown';
                    filename = 'property-maintenance-breakdown.xlsx';
                    break;
                default:
                    alert('Unknown report type');
                    return;
            }

            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to generate report. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
                    <p className="text-muted-foreground mt-1">Owner-ready reports and analytics</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalSpend)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total Maintenance Spend</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalSavings)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Identified Savings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{stats.invoiceCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Invoices Processed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-amber-600">{stats.flaggedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Flagged for Review</p>
                    </CardContent>
                </Card>
            </div>

            {/* Available Reports */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => downloadReport('Monthly Spend', 'pdf')}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Monthly Maintenance Spend
                                </CardTitle>
                            </div>
                            <Download className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Detailed breakdown of spend by property, trade, and vendor for the current month.
                                Includes charts, trend analysis, and cost comparisons.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>• PDF Format</span>
                                <span>• Owner-Ready</span>
                                <span>• 8-12 pages</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => downloadReport('Vendor Performance', 'pdf')}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Vendor Performance Scorecard
                                </CardTitle>
                            </div>
                            <Download className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Analysis of vendor overbilling rates, response times, and quality flags.
                                Includes recommended vendors and those requiring review.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>• PDF Format</span>
                                <span>• Internal Use</span>
                                <span>• 5-7 pages</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingDown className="h-5 w-5 text-emerald-600" />
                                    Cost Savings Summary
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                AI-identified savings opportunities and successfully disputed charges.
                                Shows ROI of the BrixAI system in dollar terms.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                <span>• PDF/CSV</span>
                                <span>• Executive Summary</span>
                                <span>• 3-4 pages</span>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => downloadReport('Savings Summary', 'pdf')}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Download PDF
                                </button>
                                <button 
                                    onClick={() => downloadReport('Savings Summary', 'csv')}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Download CSV
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => downloadReport('Property Breakdown', 'excel')}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Property Maintenance Breakdown
                                </CardTitle>
                            </div>
                            <Download className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Per-property and per-unit maintenance costs, trends, and budget variance.
                                Identify high-cost properties and optimize spending.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>• Excel/CSV</span>
                                <span>• Detailed Data</span>
                                <span>• Data Export</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Export Options */}
            <Card>
                <CardHeader>
                    <CardTitle>Custom Report Builder</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Need a custom report? Contact support to schedule a one-time export or recurring report delivery.
                    </p>
                    <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        Request Custom Report
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
