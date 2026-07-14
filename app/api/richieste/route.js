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

  const campo =
    session.user.tipo === "sponsor" ? "sponsorId" : "sponseeId";

  const richieste = await db
    .collection("richieste")
    .find({ [campo]: new ObjectId(session.user.id) })
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json({ richieste });
}

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }
  if (session.user.tipo !== "sponsee") {
    return Response.json(
      { error: "Solo gli sponsee possono inviare richieste" },
      { status: 403 }
    );
  }

  const { sponsorId, messaggio } = await request.json();

  if (!sponsorId || !messaggio) {
    return Response.json(
      { error: "Dati mancanti" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  const sponsor = await db
    .collection("users")
    .findOne({ _id: new ObjectId(sponsorId) });

  if (!sponsor) {
    return Response.json({ error: "Sponsor non trovato" }, { status: 404 });
  }

  await db.collection("richieste").insertOne({
    sponsorId: new ObjectId(sponsorId),
    sponseeId: new ObjectId(session.user.id),
    sponsorNome: sponsor.nome,
    sponseeNome: session.user.name,
    messaggio,
    stato: "in attesa",
    createdAt: new Date(),
  });

  return Response.json({ success: true });
}
