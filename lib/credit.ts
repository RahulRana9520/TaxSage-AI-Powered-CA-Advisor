// Credit score utilities: types, mock fetcher, and loan tips generation

export type CreditScoreBand =
  | "Excellent"
  | "Very Good"
  | "Good"
  | "Fair"
  | "Poor";

export type CreditScoreProvider =
  | "mock"
  | "extracted"
  | "experian"
  | "equifax"
  | "transunion"
  | "cibil"; // India (TransUnion CIBIL)

export interface CreditScoreResult {
  score: number; // 300-850 (normalize to FICO-like range for simplicity)
  band: CreditScoreBand;
  provider: CreditScoreProvider;
  retrievedAt: string; // ISO timestamp
  source?: string; // optional human-readable source
  factors?: string[]; // optional reason codes or factors
  fileName?: string; // for PDF uploads
}

export interface CreditScoreRequest {
  userId?: string;
  // Real integrations require strict PII controls and user consent tokens.
  // Add fields like last4SSN, panLast4, dob, consentToken when integrating a real bureau API.
  provider?: CreditScoreProvider;
}

export function toBand(score: number): CreditScoreBand {
  if (score >= 800) return "Excellent";
  if (score >= 740) return "Very Good";
  if (score >= 670) return "Good";
  if (score >= 580) return "Fair";
  return "Poor";
}

// Mock fetcher for development and demos. Replace with real provider calls.
export async function getCreditScore(req: CreditScoreRequest = {}): Promise<CreditScoreResult> {
  const now = new Date().toISOString();
  // More realistic demo score - most people have scores in 650-750 range
  const demoScores = [720, 685, 745, 658, 732, 695, 778, 654, 715, 689];
  const seed = (req.userId ?? "demo").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const score = demoScores[seed % demoScores.length];
  
  return {
    score,
    band: toBand(score),
    provider: req.provider ?? "mock",
    retrievedAt: now,
    source: "Demo Provider (CIBIL-like)",
    factors: [
      "Payment history: 35% impact",
      "Credit utilization: 30% impact", 
      "Length of credit history: 15% impact",
      "Types of credit: 10% impact",
      "New credit inquiries: 10% impact"
    ],
  };
}

// Generate actionable loan tips based on score band and common underwriting signals
export function generateLoanTips(score: number): string[] {
  const band = toBand(score);
  const tips: string[] = [];

  switch (band) {
    case "Excellent":
      tips.push(
        "🏦 Personal: Qualify for premium credit cards with 0% intro APR and best loan rates.",
        "🏢 Business: Access unsecured business lines of credit at prime rates.",
        "💰 Loan Amount: Up to 10-12x monthly income for personal loans.",
        "Tax Strategy: Home loan interest (Section 24b) up to ₹2L + principal (80C) up to ₹1.5L deduction."
      );
      break;
    case "Very Good":
      tips.push(
        "🏦 Personal: Strong approval for most loan products, competitive rates.",
        "🏢 Business: Qualify for equipment financing and business term loans.",
        "💰 Loan Amount: Up to 8-10x monthly income for personal loans.",
        "Tax Strategy: Business loan interest is fully tax-deductible. MSME loans get special rates."
      );
      break;
    case "Good":
      tips.push(
        "🏦 Personal: Good approval odds, standard interest rates apply.", 
        "🏢 Business: Consider secured business loans for better terms.",
        "💰 Loan Amount: Up to 6-8x monthly income for personal loans.",
        "Tax Strategy: Education loans (Section 80E) - unlimited interest deduction for 8 years."
      );
      break;
    case "Fair":
      tips.push(
        "🏦 Personal: May need co-signer or collateral for better rates.",
        "🏢 Business: Focus on improving payment history before major loans.",
        "💰 Loan Amount: Up to 4-6x monthly income, higher rates expected.",
        "Tax Strategy: Focus on credit building. Avoid high-interest personal loans."
      );
      break;
    case "Poor":
      tips.push(
        "🏦 Personal: Consider secured credit cards to rebuild credit history.",
        "🏢 Business: Work with relationship banks, provide strong financials.",
        "💰 Loan Amount: Limited to 2-4x monthly income with collateral.",
        "Tax Strategy: Build emergency fund first, then rebuild credit systematically."
      );
      break;
  }

  // Add general tips
  tips.push("📊 General: Maintain DTI (Debt-to-Income) below 40% for best approval odds.");
  tips.push("⚡ Tip: Use credit utilization below 30% to improve score over 3-6 months.");
  
  return tips;
}

// Notes for real integrations (replace mock):
// - US: Experian Connect API, Equifax B2B, TransUnion, or intermediaries like NovaCredit/Finicity/Plaid (with consumer consent).
// - India: TransUnion CIBIL partner APIs; requires bureau agreement and strict compliance.
// - Always obtain explicit user consent; never store PII unless necessary; encrypt at rest and in transit.
// - Normalize bureau ranges to a standard (e.g., 300–850) to keep logic simple.
