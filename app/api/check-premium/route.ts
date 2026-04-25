import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isPremium = cookieStore.get("premium_user")?.value === "true";
    const expiryStr = cookieStore.get("premium_expiry")?.value;

    if (!isPremium || !expiryStr) {
      return NextResponse.json({ isPremium: false });
    }

    const expiry = new Date(expiryStr);
    const now = new Date();

    if (expiry < now) {
      // Premium expired
      return NextResponse.json({ isPremium: false, expired: true });
    }

    return NextResponse.json({
      isPremium: true,
      expiryDate: expiryStr,
      daysRemaining: Math.ceil(
        (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
    });
  } catch (error) {
    console.error("Error checking premium:", error);
    return NextResponse.json({ isPremium: false });
  }
}
