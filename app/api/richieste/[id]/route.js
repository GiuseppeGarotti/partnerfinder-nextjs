import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { inviaNotificaRispostaRichiesta } from "@/lib/email";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }

  const { id } = await params;
  const client = await clientPromise;
  const db = client.db("test_database");

  const richiesta = await db
    .collection("richieste")
    .findOne({ _id: new ObjectId(id) });

  if (!richiesta) {
    return Response.json({ error: "Richiesta non trovata" }, { status: 404 });
  }

  const isSponsor = richiesta.sponsorId.toString() === session.user.id;
  const isSponsee = richiesta.sponseeId.toString() === session.user.id;

  if (!isSponsor && !isSponsee) {
    return Response.json({ error: "Accesso negato" }, { status: 403 });
  }

  // Se l'utente è lo sponsor, includiamo anche le tipologie che offre
  let tipologieSponsorizzazione = [];
  if (isSponsor) {
    const sponsor = await db
      .collection("users")
      .findOne({ _id: richiesta.sponsorId });
    tipologieSponsorizzazione = sponsor?.tipologieSponsorizzazione || [];
  } else {
    const sponsor = await db
      .collection("users")
      .findOne({ _id: richiesta.sponsorId });
    tipologieSponsorizzazione = sponsor?.tipologieSponsorizzazione || [];
  }

  return Response.json({ richiesta, tipologieSponsorizzazione });
}

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session || session.user.tipo !== "sponsor") {
    return Response.json({ error: "Accesso negato" }, { status: 403 });
  }

  const { id } = await params;
  const { stato } = await request.json();

  if (!["approvata", "rifiutata"].includes(stato)) {
    return Response.json({ error: "Stato non valido" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  const richiesta = await db
    .collection("richieste")
    .findOne({ _id: new ObjectId(id) });

  if (!richiesta) {
    return Response.json({ error: "Richiesta non trovata" }, { status: 404 });
  }

  if (richiesta.sponsorId.toString() !== session.user.id) {
    return Response.json({ error: "Accesso negato" }, { status: 403 });
  }

  await db
    .collection("richieste")
    .updateOne({ _id: new ObjectId(id) }, { $set: { stato } });

  try {
    const sponsee = await db
      .collection("users")
      .findOne({ _id: richiesta.sponseeId });
    if (sponsee) {
      await inviaNotificaRispostaRichiesta(
        sponsee.email,
        sponsee.nome,
        richiesta.sponsorNome,
        stato,
        id
      );
    }
  } catch (err) {
    console.error("Errore notifica email risposta richiesta:", err);
  }

  return Response.json({ success: true });
}
