// Instamojo Payment Integration
// Docs: https://docs.instamojo.com/

export const INSTAMOJO_CONFIG = {
  // Use test endpoint for development, production for live
  apiEndpoint: process.env.NODE_ENV === "production" 
    ? "https://api.instamojo.com/v2"
    : "https://test.instamojo.com/v2",
  
  // OAuth endpoint
  authEndpoint: process.env.NODE_ENV === "production"
    ? "https://api.instamojo.com/oauth2/token/"
    : "https://test.instamojo.com/oauth2/token/",
};

export async function getAccessToken(): Promise<string> {
  const clientId = process.env.INSTAMOJO_CLIENT_ID;
  const clientSecret = process.env.INSTAMOJO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Instamojo credentials not configured");
  }

  const response = await fetch(INSTAMOJO_CONFIG.authEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const data = await response.json();
  
  if (!data.access_token) {
    throw new Error("Failed to get Instamojo access token");
  }

  return data.access_token;
}

export interface PaymentRequest {
  purpose: string;
  amount: number;
  buyerName: string;
  email: string;
  phone?: string;
  redirectUrl: string;
  webhookUrl?: string;
}

export async function createPaymentRequest(params: PaymentRequest) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${INSTAMOJO_CONFIG.apiEndpoint}/payment_requests/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      purpose: params.purpose,
      amount: params.amount.toString(),
      buyer_name: params.buyerName,
      email: params.email,
      phone: params.phone || "",
      redirect_url: params.redirectUrl,
      webhook: params.webhookUrl || "",
      allow_repeated_payments: false,
      send_email: true,
    }),
  });

  const data = await response.json();
  return data;
}

export async function getPaymentDetails(paymentRequestId: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${INSTAMOJO_CONFIG.apiEndpoint}/payment_requests/${paymentRequestId}/`,
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  );

  return response.json();
}
