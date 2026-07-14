import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: "Email mancante" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("test_database");

  const utente = await db.collection("users").findOne({ email });

  if (!utente) {
    return Response.json({ emailVerificato: null });
  }

  return Response.json({ emailVerificato: utente.emailVerificato !== false });
}
