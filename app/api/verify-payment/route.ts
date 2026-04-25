import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      durationMonths,
    } = await request.json();

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(durationMonths));

    // Store premium status in a cookie (in production, use a database)
    const cookieStore = await cookies();
    cookieStore.set("premium_user", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiryDate,
    });

    cookieStore.set("premium_expiry", expiryDate.toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiryDate,
    });

    cookieStore.set("payment_id", razorpay_payment_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiryDate,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully!",
      expiryDate: expiryDate.toISOString(),
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
