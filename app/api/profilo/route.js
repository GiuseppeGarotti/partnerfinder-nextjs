import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(session.user.id) });

  if (!user) {
    return Response.json({ error: "Utente non trovato" }, { status: 404 });
  }

  delete user.password;

  return Response.json({ user });
}

export async function PATCH(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }

  const data = await request.json();

  const campiConsentiti = [
    "logo",
    "categoria",
    "descrizione",
    "telefono",
    "sitoWeb",
    "budget",
    "sede",
    "interessi",
    "tipologieSponsorizzazione",
  ];

  const update = {};
  for (const campo of campiConsentiti) {
    if (data[campo] !== undefined) update[campo] = data[campo];
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(session.user.id) }, { $set: update });

  return Response.json({ success: true });
}
