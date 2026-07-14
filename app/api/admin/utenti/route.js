import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();

  if (!session || session.user.tipo !== "admin") {
    return Response.json({ error: "Accesso negato" }, { status: 403 });
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  const utenti = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json({ utenti });
}
