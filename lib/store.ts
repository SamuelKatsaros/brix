import { Invoice, Organization, Property, User, Vendor, WorkOrder } from "@/types";
import { v4 as uuidv4 } from 'uuid';

// --- Seed Data ---

const ORG_ID = 'org-1';

const USERS: User[] = [
    { id: 'user-1', name: 'Sarah Jenkins', email: 'sarah@apexpm.com', role: 'pm', orgId: ORG_ID, avatarUrl: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 'user-2', name: 'Mike Ross', email: 'mike@apexpm.com', role: 'admin', orgId: ORG_ID, avatarUrl: 'https://i.pravatar.cc/150?u=mike' },
];

const PROPERTIES: Property[] = [
    { id: 'prop-1', orgId: ORG_ID, name: 'Sunset Heights', address: '1200 Sunset Blvd, Los Angeles, CA', units: 45, imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80' },
    { id: 'prop-2', orgId: ORG_ID, name: 'Highland Park Lofts', address: '5400 N Figueroa St, Los Angeles, CA', units: 12, imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' },
    { id: 'prop-3', orgId: ORG_ID, name: 'The Wilshire', address: '3000 Wilshire Blvd, Los Angeles, CA', units: 120, imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80' },
];

const VENDORS: Vendor[] = [
    {
        id: 'vend-1', orgId: ORG_ID, name: 'Rapid Rooter Plumbing', trade: 'plumbing', email: 'dispatch@rapidrooter.com', phone: '555-0101',
        trustScore: 88, isPreferred: true, serviceArea: 'Los Angeles',
        pricing: { 'Drain Snake': 150, 'Faucet Replace': 200, 'Toilet Repair': 180 }
    },
    {
        id: 'vend-2', orgId: ORG_ID, name: 'Budget Fixers', trade: 'general', email: 'joe@budgetfix.com', phone: '555-0102',
        trustScore: 45, isPreferred: false, serviceArea: 'East LA',
        pricing: { 'Patch Drywall': 50, 'Paint Room': 200, 'Door Repair': 75 }
    },
    {
        id: 'vend-3', orgId: ORG_ID, name: 'Elite HVAC Systems', trade: 'hvac', email: 'service@elitehvac.com', phone: '555-0103',
        trustScore: 95, isPreferred: true, serviceArea: 'Los Angeles County',
        pricing: { 'AC Tuneup': 120, 'Filter Change': 40, 'Compressor Check': 95 }
    },
];

const SEED_INVOICES: Invoice[] = [
    {
        id: 'inv-1', orgId: ORG_ID, vendorId: 'vend-1', propertyId: 'prop-1', invoiceNumber: 'RR-2023-001',
        date: '2023-10-15T00:00:00Z', subtotal: 350, tax: 0, totalAmount: 350, status: 'approved',
        fileUrl: '/invoices/sample1.pdf',
        lineItems: [
            { id: 'li-1', description: 'Kitchen Sink Clog - Snaked drain', quantity: 1, unitPrice: 150, total: 150, flagged: false },
            { id: 'li-2', description: 'Replaced P-Trap', quantity: 1, unitPrice: 200, total: 200, flagged: false }
        ],
        analysis: {
            trustScore: 92, summary: 'Pricing is within standard range for this type of plumbing work.', flags: [], savingsPotential: 0, recommendedAction: 'approve'
        },
        createdAt: '2023-10-16T10:00:00Z', updatedAt: '2023-10-16T14:00:00Z'
    },
    {
        id: 'inv-2', orgId: ORG_ID, vendorId: 'vend-2', propertyId: 'prop-2', invoiceNumber: 'BF-992',
        date: '2023-11-01T00:00:00Z', subtotal: 850, tax: 50, totalAmount: 900, status: 'review',
        fileUrl: '/invoices/sample2.pdf',
        lineItems: [
            { id: 'li-3', description: 'Patch drywall hole', quantity: 1, unitPrice: 450, total: 450, flagged: true, flagReason: 'Price is 200% above baseline ($150)', baselinePrice: 150, variancePercent: 200 },
            { id: 'li-4', description: 'Paint wall', quantity: 1, unitPrice: 400, total: 400, flagged: true, flagReason: 'Possible duplicate charge', baselinePrice: 200, variancePercent: 100 }
        ],
        analysis: {
            trustScore: 35, summary: 'High risk of overbilling. Drywall patch is significantly overpriced compared to market rates.', flags: ['Excessive Unit Price', 'Possible Duplicate'], savingsPotential: 550, recommendedAction: 'review'
        },
        createdAt: '2023-11-02T09:00:00Z', updatedAt: '2023-11-02T09:05:00Z'
    },
    {
        id: 'inv-3', orgId: ORG_ID, vendorId: 'vend-3', propertyId: 'prop-3', invoiceNumber: 'HVAC-451',
        date: '2023-11-10T00:00:00Z', subtotal: 120, tax: 0, totalAmount: 120, status: 'approved',
        fileUrl: '/invoices/sample3.pdf',
        lineItems: [
            { id: 'li-5', description: 'Annual AC Maintenance & Tuneup', quantity: 1, unitPrice: 120, total: 120, flagged: false }
        ],
        analysis: {
            trustScore: 98, summary: 'Standard preventive maintenance pricing. Vendor pricing matches baseline.', flags: [], savingsPotential: 0, recommendedAction: 'approve'
        },
        createdAt: '2023-11-11T08:00:00Z', updatedAt: '2023-11-11T08:30:00Z'
    },
    {
        id: 'inv-4', orgId: ORG_ID, vendorId: 'vend-1', propertyId: 'prop-2', invoiceNumber: 'RR-2023-045',
        date: '2023-11-15T00:00:00Z', subtotal: 380, tax: 0, totalAmount: 380, status: 'approved',
        fileUrl: '/invoices/sample4.pdf',
        lineItems: [
            { id: 'li-6', description: 'Toilet Tank Repair - Replace flapper', quantity: 1, unitPrice: 180, total: 180, flagged: false },
            { id: 'li-7', description: 'Faucet Cartridge Replacement', quantity: 1, unitPrice: 200, total: 200, flagged: false }
        ],
        analysis: {
            trustScore: 90, summary: 'Standard plumbing repair pricing from preferred vendor.', flags: [], savingsPotential: 0, recommendedAction: 'approve'
        },
        createdAt: '2023-11-16T11:00:00Z', updatedAt: '2023-11-16T11:20:00Z'
    },
    {
        id: 'inv-5', orgId: ORG_ID, vendorId: 'vend-2', propertyId: 'prop-1', invoiceNumber: 'BF-1003',
        date: '2023-11-20T00:00:00Z', subtotal: 325, tax: 0, totalAmount: 325, status: 'disputed',
        fileUrl: '/invoices/sample5.pdf',
        lineItems: [
            { id: 'li-8', description: 'Door Frame Repair', quantity: 1, unitPrice: 225, total: 225, flagged: true, flagReason: 'Price exceeds baseline by 200%', baselinePrice: 75, variancePercent: 200 },
            { id: 'li-9', description: 'Trip Charge', quantity: 1, unitPrice: 100, total: 100, flagged: true, flagReason: 'Unexpected fee not in contract', baselinePrice: 0, variancePercent: 100 }
        ],
        analysis: {
            trustScore: 25, summary: 'Multiple pricing violations detected. Recommend disputing this invoice and considering alternative vendors.', flags: ['Excessive Markup', 'Uncontracted Fee', 'Poor Value'], savingsPotential: 250, recommendedAction: 'dispute'
        },
        createdAt: '2023-11-21T13:00:00Z', updatedAt: '2023-11-21T15:00:00Z'
    }
];

// --- Store Implementation ---

class MockStore {
    users = USERS;
    properties = PROPERTIES;
    vendors = VENDORS;
    invoices: Invoice[] = [...SEED_INVOICES];

    getInvoices() { return this.invoices; }
    getInvoice(id: string) {
        const invoice = this.invoices.find(i => i.id === id);
        if (!invoice) {
            console.log(`[Store] Invoice ${id} not found. Available IDs:`, this.invoices.map(i => i.id));
        }
        return invoice;
    }
    addInvoice(invoice: Invoice) {
        console.log(`[Store] Adding invoice ${invoice.id}`);
        this.invoices.unshift(invoice);
    }
    updateInvoice(id: string, updates: Partial<Invoice>) {
        const idx = this.invoices.findIndex(i => i.id === id);
        if (idx !== -1) {
            this.invoices[idx] = { ...this.invoices[idx], ...updates, updatedAt: new Date().toISOString() };
            console.log(`[Store] Updated invoice ${id}`, updates);
        }
    }

    getVendors() { return this.vendors; }
    getProperties() { return this.properties; }

    getStats() {
        const totalSpend = this.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        const totalSavings = this.invoices.reduce((sum, inv) => sum + (inv.analysis?.savingsPotential || 0), 0);
        const flaggedCount = this.invoices.filter(inv => inv.analysis?.recommendedAction === 'review' || inv.analysis?.recommendedAction === 'dispute').length;

        return { totalSpend, totalSavings, flaggedCount, invoiceCount: this.invoices.length };
    }
}

// Use global singleton pattern to persist across hot reloads in dev mode
const globalForStore = globalThis as unknown as {
    store: MockStore | undefined;
};

export const store = globalForStore.store ?? new MockStore();

if (process.env.NODE_ENV !== 'production') {
    globalForStore.store = store;
}
