import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getClientPromise } from "@/lib/mongodb";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ⭐ FIX สำคัญ

  const client = await getClientPromise();
  const db = client.db("wad-01");

  await db.collection("item").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json(
    { message: "Item deleted" },
    { status: 200, headers }
  );
}

// ⭐ จำเป็นสำหรับ CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}
