"use client";

import { useEffect, useState, useRef, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function Chat({ params }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [richiesta, setRichiesta] = useState(null);
  const [tipologie, setTipologie] = useState([]);
  const [messaggi, setMessaggi] = useState([]);
  const [testo, setTesto] = useState("");
  const [caricando, setCaricando] = useState(true);
  const [errore, setErrore] = useState("");
  const fineChatRef = useRef(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function caricaMessaggi() {
    const res = await fetch(`/api/messaggi?richiestaId=${id}`);
    const data = await res.json();
    if (res.ok) setMessaggi(data.messaggi);
  }

  useEffect(() => {
    if (status !== "authenticated") return;

    async function init() {
      const res = await fetch(`/api/richieste/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setErrore(data.error || "Errore nel caricamento");
        setCaricando(false);
        return;
      }
      setRichiesta(data.richiesta);
      setTipologie(data.tipologieSponsorizzazione || []);
      await caricaMessaggi();
      setCaricando(false);
    }
    init();

    const intervallo = setInterval(caricaMessaggi, 4000);
    return () => clearInterval(intervallo);
  }, [status, id]);

  useEffect(() => {
    fineChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messaggi]);

  async function inviaMessaggio(testoDaInviare) {
    const contenuto = testoDaInviare ?? testo;
    if (!contenuto.trim()) return;

    setMessaggi((prev) => [
      ...prev,
      {
        _id: "temp-" + Date.now(),
        mittenteId: session.user.id,
        mittenteNome: session.user.name,
        testo: contenuto,
        createdAt: new Date(),
      },
    ]);
    setTesto("");

    await fetch("/api/messaggi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ richiestaId: id, testo: contenuto }),
    });
    caricaMessaggi();
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

  if (errore) {
    return (
      <main className="min-h-screen bg-[#0f1923] text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <p className="text-red-400">{errore}</p>
        </div>
      </main>
    );
  }

  const altroNome =
    session.user.tipo === "sponsor"
      ? richiesta.sponseeNome
      : richiesta.sponsorNome;

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col px-6 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold">{altroNome}</h1>
          <span
            className={`text-xs px-2 py-1 rounded-full capitalize ${
              richiesta.stato === "approvata"
                ? "bg-green-500/10 text-green-400"
                : richiesta.stato === "rifiutata"
                ? "bg-red-500/10 text-red-400"
                : "bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {richiesta.stato}
          </span>
        </div>

        {/* Messaggi */}
        <div className="flex-1 bg-[#141d29] border border-white/10 rounded-xl p-5 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto custom-scroll space-y-3">
          {messaggi.length === 0 && (
            <div className="text-white/40 text-sm text-center py-8">
              Nessun messaggio ancora. Inizia la conversazione!
            </div>
          )}
          {messaggi.map((m) => {
            const mio = m.mittenteId === session.user.id;
            return (
              <div
                key={m._id}
                className={`flex ${mio ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    mio
                      ? "bg-[#f4520a] text-white rounded-br-sm"
                      : "bg-white/10 text-white rounded-bl-sm"
                  }`}
                >
                  {m.testo}
                </div>
              </div>
            );
          })}
          <div ref={fineChatRef}></div>
        </div>

        {/* Opzioni rapide sponsor */}
        {session.user.tipo === "sponsor" && tipologie.length > 0 && (
          <div className="mb-3">
            <p className="text-white/40 text-xs mb-2">
              Offri rapidamente:
            </p>
            <div className="flex flex-wrap gap-2">
              {tipologie.map((t) => (
                <button
                  key={t}
                  onClick={() => inviaMessaggio(`Ti offro: ${t}`)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#f4520a]/40 text-[#f4520a] hover:bg-[#f4520a]/10 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input messaggio */}
        <div className="flex gap-2">
          <input
            type="text"
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") inviaMessaggio();
            }}
            placeholder="Scrivi un messaggio..."
            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f4520a]"
          />
          <button
            onClick={() => inviaMessaggio()}
            className="bg-[#f4520a] hover:bg-[#c43d08] px-5 py-3 rounded-lg font-semibold transition"
          >
            Invia
          </button>
        </div>
      </div>
    </main>
  );
}
