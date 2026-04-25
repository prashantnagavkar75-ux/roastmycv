import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const paymentId = formData.get("payment_id") as string;
    const paymentRequestId = formData.get("payment_request_id") as string;
    const status = formData.get("status") as string;
    const buyerEmail = formData.get("buyer") as string;

    console.log("Instamojo Webhook:", {
      paymentId,
      paymentRequestId,
      status,
      buyerEmail,
    });

    if (status === "Credit") {
      // Payment successful - in production, save to database
      // For now, we'll handle this on the success page
      console.log(`Payment successful for ${buyerEmail}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
