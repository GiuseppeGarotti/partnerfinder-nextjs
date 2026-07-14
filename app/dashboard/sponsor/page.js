"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import CustomSelect from "../../components/CustomSelect";

export default function DashboardSponsor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profilo, setProfilo] = useState(null);
  const [richieste, setRichieste] = useState([]);
  const [caricando, setCaricando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [salvato, setSalvato] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session.user.tipo !== "sponsor") {
      router.push(
        session.user.tipo === "admin" ? "/admin" : "/dashboard/sponsee"
      );
      return;
    }
    if (status === "authenticated") {
      fetch("/api/profilo")
        .then((r) => r.json())
        .then((data) => {
          setProfilo(data.user);
          setCaricando(false);
        });
      fetch("/api/richieste")
        .then((r) => r.json())
        .then((data) => setRichieste(data.richieste || []));
    }
  }, [status, session, router]);

  async function gestisciRichiesta(id, stato) {
    await fetch(`/api/richieste/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stato }),
    });
    setRichieste((prev) =>
      prev.map((r) => (r._id === id ? { ...r, stato } : r))
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    setSalvato(false);
    await fetch("/api/profilo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profilo),
    });
    setSalvando(false);
    setSalvato(true);
    setTimeout(() => setSalvato(false), 2500);
  }

  if (status === "loading" || caricando) {
    return (
      <main className="min-h-screen bg-[#0f1923] text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <p className="text-white/50">Caricamento...</p>
        </div>
      </main>
    );
  }

  const campi = ["categoria", "descrizione", "telefono", "budget", "sede"];
  const completati = campi.filter((c) => profilo?.[c]).length;
  const percentuale = Math.round((completati / campi.length) * 100);

  return (
    <main className="min-h-screen bg-[#0f1923] text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-1">
          Ciao, {session.user.name} 👋
        </h1>
        <p className="text-white/40 mb-8">Dashboard Sponsor</p>

        {/* Completamento profilo */}
        <div className="bg-[#141d29] border border-white/10 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">
              Profilo completato
            </span>
            <span className="text-[#f4520a] text-sm font-semibold">
              {percentuale}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f4520a] rounded-full transition-all"
              style={{ width: `${percentuale}%` }}
            ></div>
          </div>
          {percentuale < 100 && (
            <p className="text-white/40 text-sm mt-2">
              Completa il profilo per essere visibile agli sponsee.
            </p>
          )}
        </div>

        {/* Form profilo */}
        <div className="bg-[#141d29] border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-5">Profilo azienda</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-white/70">
                Categoria
              </label>
              <CustomSelect
                value={profilo?.categoria || ""}
                onChange={(v) => setProfilo({ ...profilo, categoria: v })}
                placeholder="Seleziona categoria"
                options={[
                  { value: "tecnologia", label: "Tecnologia" },
                  { value: "sport", label: "Sport" },
                  { value: "musica", label: "Musica" },
                  { value: "cultura", label: "Cultura" },
                  { value: "cibo", label: "Cibo e bevande" },
                  { value: "moda", label: "Moda" },
                  { value: "altro", label: "Altro" },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-white/70">
                Descrizione
              </label>
              <textarea
                rows={3}
                value={profilo?.descrizione || ""}
                onChange={(e) =>
                  setProfilo({ ...profilo, descrizione: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f4520a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-white/70">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={profilo?.telefono || ""}
                  onChange={(e) =>
                    setProfilo({ ...profilo, telefono: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f4520a]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-white/70">
                  Sito web
                </label>
                <input
                  type="url"
                  value={profilo?.sitoWeb || ""}
                  onChange={(e) =>
                    setProfilo({ ...profilo, sitoWeb: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f4520a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-white/70">
                  Budget (€)
                </label>
                <input
                  type="number"
                  value={profilo?.budget || ""}
                  onChange={(e) =>
                    setProfilo({ ...profilo, budget: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f4520a]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-white/70">
                  Sede
                </label>
                <input
                  type="text"
                  value={profilo?.sede || ""}
                  onChange={(e) =>
                    setProfilo({ ...profilo, sede: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f4520a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-white/70">
                Interessi di sponsorizzazione
              </label>
              <input
                type="text"
                placeholder="Es. sport, musica, eventi locali"
                value={profilo?.interessi || ""}
                onChange={(e) =>
                  setProfilo({ ...profilo, interessi: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f4520a]"
              />
            </div>

            <button
              type="submit"
              disabled={salvando}
              className="bg-[#f4520a] hover:bg-[#c43d08] px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {salvando ? "Salvataggio..." : "Salva profilo"}
            </button>
            {salvato && (
              <span className="ml-3 text-green-400 text-sm">✓ Salvato</span>
            )}
          </form>
        </div>

        {/* Richieste ricevute */}
        <div className="bg-[#141d29] border border-white/10 rounded-xl p-6 mb-4">
          <h2 className="font-bold text-lg mb-4">Richieste ricevute</h2>
          {richieste.length === 0 && (
            <p className="text-white/40 text-sm">
              Nessuna richiesta ricevuta per ora.
            </p>
          )}
          <div className="space-y-3">
            {richieste.map((r) => (
              <div
                key={r._id}
                className="border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{r.sponseeNome}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      r.stato === "approvata"
                        ? "bg-green-500/10 text-green-400"
                        : r.stato === "rifiutata"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {r.stato}
                  </span>
                </div>
                <p className="text-white/50 text-sm mb-3">{r.messaggio}</p>
                {r.stato === "in attesa" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => gestisciRichiesta(r._id, "approvata")}
                      className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Approva
                    </button>
                    <button
                      onClick={() => gestisciRichiesta(r._id, "rifiutata")}
                      className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Rifiuta
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141d29] border border-white/10 rounded-xl p-5 opacity-50">
          <p className="font-semibold mb-1">Messaggi</p>
          <p className="text-white/40 text-sm">Presto disponibile</p>
        </div>
      </div>
    </main>
  );
}
