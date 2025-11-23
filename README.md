# BrixAI: AI Maintenance Verification System

BrixAI is a production-quality web application designed to help property managers cut maintenance spend by 10-30%. It uses AI to ingest invoices, verify scope against work orders, flag overbilling, and recommend cheaper vendors.

## Features

- **AI Invoice Analysis**: Automatically extracts line items, checks pricing against baselines, and flags suspicious charges using Google Gemini AI.
- **Vendor Management**: Track vendor performance, trust scores, and pricing configurations.
- **Portfolio Dashboard**: Real-time view of maintenance spend, savings, and flagged invoices.
- **Interactive Review**: A split-screen interface for reviewing invoices alongside AI insights.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Next.js API Routes.
- **Database**: In-memory mock store (designed for easy swap to PostgreSQL).
- **AI**: Google Gemini 2.0 Flash (with automatic fallback to mock if no API key).

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **(Optional) Enable Real AI Analysis**:
   - Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a `.env.local` file in the project root:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - If you don't add a key, the app will use realistic mock AI responses

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## Demo Walkthrough

1. **Dashboard**: You'll land on the executive dashboard showing key metrics.
2. **New Invoice**: Click "New Invoice Review" or go to Invoices > New.
   - Upload any invoice PDF/Image (JPG, PNG, PDF supported).
   - The AI will analyze it (2-3 seconds with real AI, simulated delay for mock).
   - You'll be redirected to the review page.
3. **Review**:
   - See AI-detected flags like "Excessive Labor Rate" or "Uncontracted Fee".
   - Check the "Vendor Comparison" card to see potential savings.
   - Click "Dispute" or "Approve" to change invoice status.
4. **Vendors**: Check the Vendor Directory to see Trust Scores and pricing.

## AI Analysis Details

When you upload an invoice, the system:
1. **Extracts line items** from the document using vision AI
2. **Compares pricing** against market baselines ($100-150/hr for skilled trades)
3. **Flags suspicious items** (>20% over baseline, duplicate charges, unexpected fees)
4. **Calculates Trust Score** (0-100 based on pricing fairness)
5. **Recommends action** (approve, review, or dispute)
6. **Suggests alternatives** (cheaper vendors for future work)

## Architecture

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components (shadcn-like) and feature-specific components.
- `lib/store.ts`: The in-memory database and seed data.
- `services/ai-service.ts`: The abstraction for the AI analysis pipeline.

## Sample Data

The app comes pre-loaded with:
- 3 properties (Sunset Heights, Highland Park Lofts, The Wilshire)
- 3 vendors with different trust scores and pricing
- 2 sample invoices (one clean, one with overbilling flags)

Upload a new invoice to see the AI in action!
# brix
