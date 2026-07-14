"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import CustomSelect from "../components/CustomSelect";

const CATEGORIE = [
  { value: "", label: "Tutte le categorie" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "sport", label: "Sport" },
  { value: "musica", label: "Musica" },
  { value: "cultura", label: "Cultura" },
  { value: "cibo", label: "Cibo e bevande" },
  { value: "moda", label: "Moda" },
  { value: "altro", label: "Altro" },
];

export default function Esplora() {
  const { data: session } = useSession();
  const [sponsor, setSponsor] = useState([]);
  const [caricando, setCaricando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [modaleAperto, setModaleAperto] = useState(null);
  const [messaggio, setMessaggio] = useState("");
  const [inviando, setInviando] = useState(false);
  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    fetch("/api/sponsors")
      .then((r) => r.json())
      .then((data) => {
        setSponsor(data.sponsor || []);
        setCaricando(false);
      });
  }, []);

  const sponsorFiltrati = filtroCategoria
    ? sponsor.filter((s) => s.categoria === filtroCategoria)
    : sponsor;

  async function inviaRichiesta() {
    setErrore("");
    if (!messaggio.trim()) {
      setErrore("Scrivi un messaggio per lo sponsor");
      return;
    }
    setInviando(true);
    const res = await fetch("/api/richieste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sponsorId: modaleAperto.id, messaggio }),
    });
    const data = await res.json();
    setInviando(false);

    if (!res.ok) {
      setErrore(data.error || "Errore durante l'invio");
      return;
    }

    setInviato(true);
    setTimeout(() => {
      setModaleAperto(null);
      setMessaggio("");
      setInviato(false);
    }, 1800);
  }

  return (
    <main className="min-h-screen bg-[#0f1923] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-1">Esplora Sponsor</h1>
        <p className="text-white/40 mb-8">
          Trova l'azienda giusta per il tuo progetto
        </p>

        <div className="max-w-xs mb-8">
          <CustomSelect
            value={filtroCategoria}
            onChange={setFiltroCategoria}
            placeholder="Tutte le categorie"
            options={CATEGORIE}
          />
        </div>

        {caricando && <p className="text-white/50">Caricamento...</p>}

        {!caricando && sponsorFiltrati.length === 0 && (
          <div className="bg-[#141d29] border border-white/10 rounded-xl p-8 text-center">
            <p className="text-white/50">
              Nessuno sponsor disponibile al momento.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          {sponsorFiltrati.map((s) => (
            <div
              key={s.id}
              className="bg-[#141d29] border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{s.nome}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#f4520a]/10 text-[#f4520a] capitalize">
                    {s.categoria}
                  </span>
                </div>
                {s.budgetNetto !== null && (
                  <div className="text-right">
                    <p className="text-white/30 text-xs">Budget</p>
                    <p className="text-[#f4520a] font-bold">
                      € {s.budgetNetto}
                    </p>
                  </div>
                )}
              </div>

              {s.descrizione && (
                <p className="text-white/50 text-sm mb-4 line-clamp-2">
                  {s.descrizione}
                </p>
              )}

              {s.sede && (
                <p className="text-white/30 text-xs mb-4">📍 {s.sede}</p>
              )}

              {session?.user?.tipo === "sponsee" ? (
                <button
                  onClick={() => setModaleAperto(s)}
                  className="w-full bg-[#f4520a] hover:bg-[#c43d08] py-2.5 rounded-lg font-semibold text-sm transition"
                >
                  Invia richiesta
                </button>
              ) : !session ? (
                <Link
                  href="/registrati"
                  className="block w-full text-center border border-white/20 hover:border-white py-2.5 rounded-lg font-semibold text-sm transition"
                >
                  Registrati per contattare
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Modale invio richiesta */}
      {modaleAperto && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-50"
          onClick={() => !inviando && setModaleAperto(null)}
        >
          <div
            className="bg-[#141d29] border border-white/10 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-1">
              Invia richiesta a {modaleAperto.nome}
            </h3>
            <p className="text-white/40 text-sm mb-5">
              Racconta il tuo progetto e perché vorresti essere sponsorizzato.
            </p>

            {errore && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {errore}
              </div>
            )}

            {inviato ? (
              <div className="text-center py-6">
                <p className="text-green-400 font-semibold text-lg">
                  ✓ Richiesta inviata!
                </p>
              </div>
            ) : (
              <>
                <textarea
                  rows={4}
                  value={messaggio}
                  onChange={(e) => setMessaggio(e.target.value)}
                  placeholder="Scrivi qui il tuo messaggio..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-[#f4520a]"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setModaleAperto(null)}
                    disabled={inviando}
                    className="flex-1 border border-white/20 hover:border-white py-2.5 rounded-lg font-semibold text-sm transition"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={inviaRichiesta}
                    disabled={inviando}
                    className="flex-1 bg-[#f4520a] hover:bg-[#c43d08] py-2.5 rounded-lg font-semibold text-sm transition disabled:opacity-50"
                  >
                    {inviando ? "Invio..." : "Invia richiesta"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
