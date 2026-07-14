import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  const { email, codice } = await request.json();

  if (!email || !codice) {
    return Response.json({ error: "Dati mancanti" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  const otp = await db.collection("otp").findOne({ email });

  if (!otp) {
    return Response.json(
      { error: "Nessun codice trovato. Richiedine uno nuovo." },
      { status: 400 }
    );
  }

  if (new Date() > new Date(otp.scadenza)) {
    return Response.json(
      { error: "Il codice è scaduto. Richiedine uno nuovo." },
      { status: 400 }
    );
  }

  if (otp.codice !== codice) {
    return Response.json({ error: "Codice non corretto." }, { status: 400 });
  }

  await db
    .collection("users")
    .updateOne({ email }, { $set: { emailVerificato: true } });

  await db.collection("otp").deleteOne({ email });

  return Response.json({ success: true });
}
