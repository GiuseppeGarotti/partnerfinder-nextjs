const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

// Carica le variabili da .env.local manualmente (senza dipendenze extra)
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((riga) => {
  const trimmed = riga.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const idx = trimmed.indexOf("=");
  if (idx === -1) return;
  const chiave = trimmed.slice(0, idx).trim();
  const valore = trimmed.slice(idx + 1).trim();
  process.env[chiave] = valore;
});

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("test_database");
  const users = db.collection("users");

  const passwordHash = await bcrypt.hash("Password123", 10);

  const sponsorDemo = [
    {
      tipo: "sponsor",
      nome: "TechNova Srl",
      email: "demo.technova@partnerfinder.it",
      password: passwordHash,
      categoria: "tecnologia",
      descrizione:
        "Azienda di soluzioni cloud e software per PMI italiane.",
      telefono: "011 1234567",
      sitoWeb: "https://technova.it",
      budget: "600",
      sede: "Torino",
      interessi: "hackathon, eventi tech, community sviluppatori",
      provider: "credentials",
      createdAt: new Date(),
    },
    {
      tipo: "sponsor",
      nome: "Caffè Milano SpA",
      email: "demo.caffemilano@partnerfinder.it",
      password: passwordHash,
      categoria: "cibo",
      descrizione:
        "Torrefazione storica milanese, sponsor di eventi locali dal 1962.",
      telefono: "02 7654321",
      sitoWeb: "https://caffemilano.it",
      budget: "350",
      sede: "Milano",
      interessi: "eventi culturali, fiere, associazioni di quartiere",
      provider: "credentials",
      createdAt: new Date(),
    },
    {
      tipo: "sponsor",
      nome: "SportPiù",
      email: "demo.sportpiu@partnerfinder.it",
      password: passwordHash,
      categoria: "sport",
      descrizione:
        "Catena di negozi sportivi, da sempre vicina alle società dilettantistiche.",
      telefono: "079 998877",
      sitoWeb: "https://sportpiu.it",
      budget: "800",
      sede: "Cagliari",
      interessi: "sport giovanile, tornei, ASD",
      provider: "credentials",
      createdAt: new Date(),
    },
    {
      tipo: "sponsor",
      nome: "Studio Legale Ferretti & Associati",
      email: "demo.ferretti@partnerfinder.it",
      password: passwordHash,
      categoria: "altro",
      descrizione:
        "Studio legale che sostiene iniziative culturali e sociali del territorio.",
      telefono: "051 445566",
      sitoWeb: "",
      budget: "150",
      sede: "Bologna",
      interessi: "cultura, associazioni no-profit",
      provider: "credentials",
      createdAt: new Date(),
    },
  ];

  const sponseeDemo = [
    {
      tipo: "sponsee",
      nome: "Il Rossignolo - Ensemble Barocco",
      email: "demo.rossignolo@partnerfinder.it",
      password: passwordHash,
      categoria: "musica",
      descrizione:
        "Gruppo specializzato in musica antica su strumenti storici.",
      telefono: "333 1122334",
      provider: "credentials",
      createdAt: new Date(),
    },
    {
      tipo: "sponsee",
      nome: "Tech Meetup Torino",
      email: "demo.techmeetup@partnerfinder.it",
      password: passwordHash,
      categoria: "tecnologia",
      descrizione:
        "Community di sviluppatori, meetup mensile gratuito a Torino.",
      telefono: "345 6677889",
      provider: "credentials",
      createdAt: new Date(),
    },
    {
      tipo: "sponsee",
      nome: "ASD Corsa Solidale",
      email: "demo.corsasolidale@partnerfinder.it",
      password: passwordHash,
      categoria: "sport",
      descrizione:
        "Associazione sportiva dilettantistica, organizza corse benefiche.",
      telefono: "347 1231231",
      provider: "credentials",
      createdAt: new Date(),
    },
    {
      tipo: "sponsee",
      nome: "Festival Fotografia Bologna",
      email: "demo.festivalfoto@partnerfinder.it",
      password: passwordHash,
      categoria: "cultura",
      descrizione: "Festival annuale di fotografia contemporanea.",
      telefono: "051 9988776",
      provider: "credentials",
      createdAt: new Date(),
    },
  ];

  for (const utente of [...sponsorDemo, ...sponseeDemo]) {
    const esistente = await users.findOne({ email: utente.email });
    if (esistente) {
      console.log("Già presente, salto:", utente.email);
      continue;
    }
    await users.insertOne(utente);
    console.log("Creato:", utente.nome);
  }

  console.log("\nFatto! Password per tutti gli account demo: Password123");
  await client.close();
}

main().catch(console.error);
