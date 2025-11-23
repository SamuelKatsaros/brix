import { InvoiceAnalysis, LineItem } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

export class AIAnalysisService {
    static async analyzeInvoice(file: File | Blob): Promise<{ lineItems: LineItem[], analysis: InvoiceAnalysis }> {
        // If no API key, fall back to mock
        if (!genAI || !process.env.GEMINI_API_KEY) {
            return this.mockAnalyzeInvoice();
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

            // Convert file to base64
            const buffer = Buffer.from(await file.arrayBuffer());
            const base64 = buffer.toString('base64');
            const mimeType = file.type || 'image/jpeg';

            const prompt = `You are an expert property maintenance invoice auditor. Analyze this invoice image and extract structured information.

Return a JSON object with this exact structure:
{
  "lineItems": [
    {
      "description": "description of work",
      "quantity": number,
      "unitPrice": number,
      "total": number,
      "flagged": boolean,
      "flagReason": "reason if flagged (optional)",
      "baselinePrice": number (what this should cost),
      "variancePercent": number (percentage difference from baseline)
    }
  ],
  "trustScore": number (0-100, where 100 is perfectly trustworthy),
  "summary": "plain English summary of findings",
  "flags": ["list of specific concerns"],
  "savingsPotential": number (estimated dollar amount of overbilling),
  "recommendedAction": "approve" | "review" | "dispute"
}

Look for:
- Unreasonably high hourly rates (baseline: $100-150/hr for skilled trades)
- Inflated parts costs
- Duplicate charges
- Services not matching typical scope
- Unexplained fees

Be conservative but thorough. If pricing is within 20% of market rates, don't flag it.`;

            const result = await model.generateContent([
                { text: prompt },
                {
                    inlineData: {
                        mimeType,
                        data: base64
                    }
                }
            ]);

            const response = await result.response;
            const text = response.text();

            // Extract JSON from response (handle markdown code blocks)
            let jsonText = text;
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            }

            const data = JSON.parse(jsonText);

            // Add IDs to line items
            const lineItems: LineItem[] = data.lineItems.map((item: any, i: number) => ({
                id: `li-${Date.now()}-${i}`,
                ...item
            }));

            const analysis: InvoiceAnalysis = {
                trustScore: data.trustScore,
                summary: data.summary,
                flags: data.flags,
                savingsPotential: data.savingsPotential,
                recommendedAction: data.recommendedAction
            };

            return { lineItems, analysis };
        } catch (error) {
            console.error("AI Analysis failed, falling back to mock:", error);
            return this.mockAnalyzeInvoice();
        }
    }

    private static async mockAnalyzeInvoice(): Promise<{ lineItems: LineItem[], analysis: InvoiceAnalysis }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        const lineItems: LineItem[] = [
            {
                id: `li-${Date.now()}-1`,
                description: "Emergency Leak Repair - After Hours",
                quantity: 2,
                unitPrice: 250,
                total: 500,
                flagged: true,
                flagReason: "Rate exceeds market baseline ($150/hr) by 66%",
                baselinePrice: 150,
                variancePercent: 66
            },
            {
                id: `li-${Date.now()}-2`,
                description: "Copper Pipe Fittings (Assorted)",
                quantity: 1,
                unitPrice: 85,
                total: 85,
                flagged: false
            },
            {
                id: `li-${Date.now()}-3`,
                description: "Travel Fee",
                quantity: 1,
                unitPrice: 150,
                total: 150,
                flagged: true,
                flagReason: "Travel fee is not in vendor contract",
                baselinePrice: 0,
                variancePercent: 100
            }
        ];

        const analysis: InvoiceAnalysis = {
            trustScore: 65,
            summary: "We detected potential overbilling on labor rates and an unapproved travel fee. The labor rate of $250/hr is significantly higher than the standard $150/hr for this region.",
            flags: ["Excessive Labor Rate", "Uncontracted Fee"],
            savingsPotential: 350,
            recommendedAction: "review"
        };

        return { lineItems, analysis };
    }
}
