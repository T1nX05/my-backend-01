import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password required" },
      { status: 400 }
    );
  }

  const client = await getClientPromise();
  const db = client.db("wad-01");
  const user = db.collection("user");

  const exists = await user.findOne({ username });
  if (exists) {
    return NextResponse.json(
      { message: "Username already exists" },
      { status: 409 }
    );
  }

  await user.insertOne({
    username,
    password, // plain text (ตรงกับ DB ที่คุณมี)
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "Register success" });
}
