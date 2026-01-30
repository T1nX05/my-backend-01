import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const client = await getClientPromise();
  const db = client.db("wad-01");
  const user = db.collection("user");

  const found = await user.findOne({ username, password });

  if (!found) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Login success",
    user: {
      id: found._id,
      username: found.username,
    },
  });
}
