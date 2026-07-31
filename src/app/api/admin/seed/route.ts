import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
}
