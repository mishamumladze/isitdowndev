import { NextResponse } from "next/server";
import { SERVICES } from "@/lib/services-config";

export const revalidate = 300;

export async function GET() {
  return NextResponse.json({ services: SERVICES, count: SERVICES.length });
}
