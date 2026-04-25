import { NextResponse } from "next/server";
import { createPaymentRequest } from "@/lib/instamojo";
import { PLANS } from "@/lib/products";

export async function POST(request: Request) {
  try {
    const { planId, email, name, phone } = await request.json();

    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const paymentRequest = await createPaymentRequest({
      purpose: `RoastMyCV ${plan.name} - ${plan.duration}`,
      amount: plan.price,
      buyerName: name,
      email: email,
      phone: phone,
      redirectUrl: `${baseUrl}/payment/success`,
      webhookUrl: `${baseUrl}/api/instamojo/webhook`,
    });

    if (paymentRequest.payment_request) {
      return NextResponse.json({
        success: true,
        paymentUrl: paymentRequest.payment_request.longurl,
        paymentRequestId: paymentRequest.payment_request.id,
      });
    } else {
      return NextResponse.json(
        { error: paymentRequest.message || "Failed to create payment" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Instamojo error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
