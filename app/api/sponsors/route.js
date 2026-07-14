import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("test_database");

  const sponsor = await db
    .collection("users")
    .find(
      { tipo: "sponsor", categoria: { $exists: true, $ne: "" } },
      {
        projection: {
          password: 0,
        },
      }
    )
    .sort({ createdAt: -1 })
    .toArray();

  const risultato = sponsor.map((s) => {
    let budgetNetto = null;
    if (s.budget) {
      const budget = parseFloat(s.budget);
      const percentuale = budget <= 100 ? 0.05 : 0.1;
      budgetNetto = Math.round(budget * (1 - percentuale) * 100) / 100;
    }
    return {
      id: s._id,
      nome: s.nome,
      categoria: s.categoria,
      descrizione: s.descrizione || "",
      sede: s.sede || "",
      interessi: s.interessi || "",
      budgetNetto,
    };
  });

  return Response.json({ sponsor: risultato });
}
