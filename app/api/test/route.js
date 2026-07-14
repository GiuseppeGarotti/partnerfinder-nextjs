import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test_database");
    const collections = await db.listCollections().toArray();

    return Response.json({
      status: "Connesso a MongoDB con successo! 🎉",
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    return Response.json(
      { status: "Errore di connessione", error: error.message },
      { status: 500 }
    );
  }
}
