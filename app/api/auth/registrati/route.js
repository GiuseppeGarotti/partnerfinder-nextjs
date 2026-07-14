import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
// import { inviaEmailOtp } from "@/lib/email"; // riattiveremo con Resend

export async function POST(request) {
  try {
    const { tipo, nome, email, password } = await request.json();

    if (!tipo || !nome || !email || !password) {
      return Response.json(
        { error: "Tutti i campi sono obbligatori" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "La password deve avere almeno 6 caratteri" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("test_database");

    const esistente = await db.collection("users").findOne({ email });
    if (esistente) {
      return Response.json(
        { error: "Esiste già un account con questa email" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      tipo,
      nome,
      email,
      password: passwordHash,
      provider: "credentials",
      createdAt: new Date(),
    });

    // Verifica email OTP temporaneamente disattivata - la riattiveremo
    // con Resend più avanti. Il codice resta pronto sotto, commentato.
    //
    // const codice = Math.floor(100000 + Math.random() * 900000).toString();
    // await db.collection("otp").updateOne(
    //   { email },
    //   { $set: { email, codice, scadenza: new Date(Date.now() + 10 * 60 * 1000) } },
    //   { upsert: true }
    // );
    // await inviaEmailOtp(email, codice);

    return Response.json({ success: true, email });
  } catch (error) {
    return Response.json(
      { error: "Errore del server: " + error.message },
      { status: 500 }
    );
  }
}
