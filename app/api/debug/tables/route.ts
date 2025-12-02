import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Try to query each table
    const results: any = {};

    try {
      const games = await prisma.game.count();
      results.games = { exists: true, count: games };
    } catch (e: any) {
      results.games = { exists: false, error: e.message };
    }

    try {
      const users = await prisma.user.count();
      results.users = { exists: true, count: users };
    } catch (e: any) {
      results.users = { exists: false, error: e.message };
    }

    try {
      const accs = await prisma.acc.count();
      results.accs = { exists: true, count: accs };
    } catch (e: any) {
      results.accs = { exists: false, error: e.message };
    }

    return NextResponse.json({ success: true, tables: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
