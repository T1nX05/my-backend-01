import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 5);
  const skip = (page - 1) * limit;

  const client = await getClientPromise();
  const db = client.db("wad-01");
  const col = db.collection("item");

  const total = await col.countDocuments();
  const items = await col.find().skip(skip).limit(limit).toArray();

  return new NextResponse(
    JSON.stringify({ page, limit, total, items }),
    { status: 200, headers }
  );
}

export async function POST(req: Request) {
  const body = await req.json();

  const client = await getClientPromise();
  const db = client.db("wad-01");

  await db.collection("item").insertOne({
    itemName: body.itemName,
    itemCategory: body.itemCategory,
    itemPrice: Number(body.itemPrice),
    status: body.status,
    createdAt: new Date(),
  });

  return new NextResponse(
    JSON.stringify({ message: "Item created" }),
    { status: 201, headers }
  );
}

// ⭐ สำคัญมาก ไม่งั้น Add ไม่ทำงาน
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}
