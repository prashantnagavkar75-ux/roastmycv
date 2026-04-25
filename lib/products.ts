export interface Plan {
  id: string;
  name: string;
  description: string;
  priceInPaise: number; // Razorpay uses paise (1 INR = 100 paise)
  displayPrice: string;
  duration: string;
  durationMonths: number;
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Monthly Grind",
    description: "Perfect for job hunters on a budget",
    priceInPaise: 4900, // ₹49
    displayPrice: "₹49",
    duration: "/month",
    durationMonths: 1,
    features: [
      "Unlimited CV roasts",
      "Detailed analysis & score",
      "Personalized improvement tips",
      "Download roast as PDF",
      "Priority roasting queue",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Slay",
    description: "Best value - save ₹48!",
    priceInPaise: 9900, // ₹99
    displayPrice: "₹99",
    duration: "/3 months",
    durationMonths: 3,
    popular: true,
    features: [
      "Everything in Monthly",
      "Resume templates library",
      "LinkedIn roast (coming soon)",
      "Job match suggestions",
      "Early access to new features",
    ],
  },
];

export const FREE_TIER = {
  roastsPerDay: 2,
  features: [
    "2 basic roasts per day",
    "General feedback only",
    "No detailed analysis",
  ],
};
