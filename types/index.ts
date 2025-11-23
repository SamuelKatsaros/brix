export type UserRole = 'admin' | 'pm' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  avatarUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  timezone: string;
}

export interface Property {
  id: string;
  orgId: string;
  name: string;
  address: string;
  units: number;
  imageUrl?: string;
}

export type Trade = 'plumbing' | 'hvac' | 'electrical' | 'general' | 'landscaping' | 'appliance';

export interface Vendor {
  id: string;
  orgId: string;
  name: string;
  trade: Trade;
  email: string;
  phone: string;
  trustScore: number; // 0-100
  isPreferred: boolean;
  serviceArea: string;
  pricing: Record<string, number>; // Base pricing for common items
}

export type InvoiceStatus = 'new' | 'review' | 'approved' | 'disputed' | 'paid';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
  
  // Analysis fields
  flagged: boolean;
  flagReason?: string;
  baselinePrice?: number;
  variancePercent?: number;
}

export interface InvoiceAnalysis {
  trustScore: number; // 0-100
  summary: string;
  flags: string[];
  savingsPotential: number;
  recommendedAction: 'approve' | 'review' | 'dispute';
}

export interface Invoice {
  id: string;
  orgId: string;
  vendorId: string;
  propertyId: string;
  workOrderId?: string;
  
  invoiceNumber: string;
  date: string; // ISO string
  dueDate?: string;
  
  subtotal: number;
  tax: number;
  totalAmount: number;
  
  status: InvoiceStatus;
  fileUrl: string; // URL to the PDF/Image
  
  lineItems: LineItem[];
  analysis?: InvoiceAnalysis;
  
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrder {
  id: string;
  orgId: string;
  propertyId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  photos: string[]; // URLs
  createdAt: string;
}
