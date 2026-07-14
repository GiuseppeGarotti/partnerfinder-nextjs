import clientPromise from "@/lib/mongodb";
import { inviaEmailOtp } from "@/lib/email";

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: "Email mancante" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  const utente = await db.collection("users").findOne({ email });
  if (!utente) {
    return Response.json({ error: "Utente non trovato" }, { status: 404 });
  }

  const codice = Math.floor(100000 + Math.random() * 900000).toString();

  await db.collection("otp").updateOne(
    { email },
    {
      $set: {
        email,
        codice,
        scadenza: new Date(Date.now() + 10 * 60 * 1000),
      },
    },
    { upsert: true }
  );

  try {
    await inviaEmailOtp(email, codice);
  } catch (error) {
    return Response.json(
      { error: "Errore nell'invio dell'email" },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}
