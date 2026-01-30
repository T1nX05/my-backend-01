import { ensureIndexes } from "@/lib/ensureIndexes";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pass = searchParams.get("pass");

  if (!pass) {
    return NextResponse.json(
      { message: "Invalid usage" },
      { status: 400 }
    );
  }

  if (pass !== process.env.ADMIN_SETUP_PASS) {
    return NextResponse.json(
      { message: "Admin password incorrect" },
      { status: 400 }
    );
  }

  await ensureIndexes();
  return NextResponse.json({ message: "Indexes ensured" });
}
