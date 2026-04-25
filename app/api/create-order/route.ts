import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { PLANS } from "@/lib/products";

export async function POST(request: Request) {
  try {
    const { planId } = await request.json();

    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: plan.priceInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId: plan.id,
        planName: plan.name,
        durationMonths: plan.durationMonths.toString(),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planName: plan.name,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
