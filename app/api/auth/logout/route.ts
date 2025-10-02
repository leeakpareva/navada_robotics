import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: true });
    }

    const token = authHeader.substring(7);

    // Try to extract session token from JWT (if needed)
    // For now, just return success

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: true }); // Always return success for logout
  } finally {
    await prisma.$disconnect();
  }
}