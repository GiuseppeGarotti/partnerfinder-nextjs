import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function verificaAccesso(db, richiestaId, userId) {
  const richiesta = await db
    .collection("richieste")
    .findOne({ _id: new ObjectId(richiestaId) });

  if (!richiesta) return null;

  const isSponsor = richiesta.sponsorId.toString() === userId;
  const isSponsee = richiesta.sponseeId.toString() === userId;

  if (!isSponsor && !isSponsee) return null;

  return richiesta;
}

export async function GET(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const richiestaId = searchParams.get("richiestaId");

  if (!richiestaId) {
    return Response.json({ error: "richiestaId mancante" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  const richiesta = await verificaAccesso(db, richiestaId, session.user.id);
  if (!richiesta) {
    return Response.json({ error: "Accesso negato" }, { status: 403 });
  }

  const messaggi = await db
    .collection("messaggi")
    .find({ richiestaId: new ObjectId(richiestaId) })
    .sort({ createdAt: 1 })
    .toArray();

  return Response.json({ messaggi });
}

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }

  const { richiestaId, testo } = await request.json();

  if (!richiestaId || !testo) {
    return Response.json({ error: "Dati mancanti" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  const richiesta = await verificaAccesso(db, richiestaId, session.user.id);
  if (!richiesta) {
    return Response.json({ error: "Accesso negato" }, { status: 403 });
  }

  const messaggio = {
    richiestaId: new ObjectId(richiestaId),
    mittenteId: new ObjectId(session.user.id),
    mittenteNome: session.user.name,
    mittenteTipo: session.user.tipo,
    testo,
    createdAt: new Date(),
  };

  await db.collection("messaggi").insertOne(messaggio);

  return Response.json({ success: true });
}
