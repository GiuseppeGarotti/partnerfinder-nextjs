import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

  return Response.json({ success: true });
}
