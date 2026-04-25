import { NextResponse } from "next/server";

// Simulated stats - in production, this would come from a database
let roastCount = 18742;

export async function GET() {
  // Increment with some randomness for fun
  roastCount += Math.floor(Math.random() * 3);
  
  return NextResponse.json({
    totalRoasts: roastCount,
    todayRoasts: Math.floor(Math.random() * 200) + 100,
    avgRating: 2.4, // savage
  });
}

export async function POST() {
  roastCount += 1;
  return NextResponse.json({ totalRoasts: roastCount });
}
