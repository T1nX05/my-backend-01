import { getClientPromise } from "@/lib/mongodb";

export async function ensureIndexes() {
  const client = await getClientPromise();
  const db = client.db("wad-01");
  const user = db.collection("user");

  await user.createIndex({ username: 1 }, { unique: true });
  await user.createIndex({ email: 1 }, { unique: true });
}
