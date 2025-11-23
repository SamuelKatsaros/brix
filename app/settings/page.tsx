'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, DollarSign, Bell, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const [aiEnabled, setAiEnabled] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [hasApiKey, setHasApiKey] = useState(false);

    useEffect(() => {
        fetch('/api/ai-status')
            .then(res => res.json())
            .then(data => setHasApiKey(data.hasKey))
            .catch(() => setHasApiKey(false));
    }, []);

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground mt-1">Manage your organization and system preferences</p>
            </div>

            {/* Organization Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Organization
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Organization Name</label>
                            <input
                                type="text"
                                defaultValue="Apex Property Management"
                                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Timezone</label>
                            <select className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background">
                                <option>America/Los_Angeles (PST)</option>
                                <option>America/New_York (EST)</option>
                                <option>America/Chicago (CST)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Organization Logo</label>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-2xl">A</span>
                            </div>
                            <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors">
                                Upload New Logo
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AI Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        AI Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Enable AI Invoice Analysis</div>
                            <div className="text-sm text-muted-foreground">
                                Automatically analyze invoices for overbilling and pricing anomalies
                            </div>
                        </div>
                        <button
                            onClick={() => setAiEnabled(!aiEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiEnabled ? 'bg-primary' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="border-t border-border pt-4">
                        <label className="text-sm font-medium">Overbilling Threshold</label>
                        <div className="mt-2 flex items-center gap-4">
                            <input
                                type="range"
                                min="10"
                                max="50"
                                defaultValue="20"
                                className="flex-1"
                            />
                            <span className="text-sm font-medium w-12">20%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Flag line items that exceed baseline by this percentage
                        </p>
                    </div>

                    <div className="bg-muted/50 rounded-md p-4">
                        <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-primary mt-0.5" />
                            <div className="text-sm">
                                <div className="font-medium">API Status</div>
                                <div className="text-muted-foreground mt-1">
                                    {hasApiKey ? (
                                        <span className="text-emerald-600">✓ Gemini AI Connected</span>
                                    ) : (
                                        <span className="text-amber-600">Using mock analysis (Add GEMINI_API_KEY to enable real AI)</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-muted-foreground">
                                Receive alerts for high-risk invoices and flagged items
                            </div>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="space-y-3 border-t border-border pt-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">New high-risk invoices</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Weekly savings summary</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Vendor performance alerts</span>
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* User Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team Members
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between p-3 border border-border rounded-md">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-sm font-medium">SJ</span>
                                </div>
                                <div>
                                    <div className="font-medium">Sarah Jenkins</div>
                                    <div className="text-sm text-muted-foreground">sarah@apexpm.com • Property Manager</div>
                                </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">Active</span>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-border rounded-md">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-sm font-medium">MR</span>
                                </div>
                                <div>
                                    <div className="font-medium">Mike Ross</div>
                                    <div className="text-sm text-muted-foreground">mike@apexpm.com • Admin</div>
                                </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">Active</span>
                        </div>
                    </div>

                    <button className="w-full px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors">
                        + Invite Team Member
                    </button>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
