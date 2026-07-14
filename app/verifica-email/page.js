"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerificaEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [codice, setCodice] = useState("");
  const [errore, setErrore] = useState("");
  const [caricando, setCaricando] = useState(false);
  const [inviatoNuovo, setInviatoNuovo] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore("");
    setCaricando(true);

    const res = await fetch("/api/auth/verifica-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, codice }),
    });
    const data = await res.json();
    setCaricando(false);

    if (!res.ok) {
      setErrore(data.error || "Errore durante la verifica");
      return;
    }

    router.push("/login?verificato=1");
  }

  async function rinviaCodice() {
    setErrore("");
    setInviatoNuovo(false);
    const res = await fetch("/api/auth/invia-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setInviatoNuovo(true);
      setTimeout(() => setInviatoNuovo(false), 4000);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="text-white/60 hover:text-white text-base">
          ← Torna alla home
        </Link>

        <h1 className="text-4xl font-bold mt-6 mb-2">Verifica la tua email</h1>
        <p className="text-white/60 text-lg mb-8">
          Abbiamo inviato un codice a{" "}
          <span className="text-white font-semibold">{email}</span>
        </p>

        {errore && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-base">
            {errore}
          </div>
        )}

        {inviatoNuovo && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6 text-base">
            Nuovo codice inviato!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-base mb-2 text-white/80">
              Codice a 6 cifre
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={codice}
              onChange={(e) =>
                setCodice(e.target.value.replace(/\D/g, ""))
              }
              placeholder="123456"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-2xl tracking-[0.3em] text-center focus:outline-none focus:border-[#f4520a]"
            />
          </div>

          <button
            type="submit"
            disabled={caricando || codice.length !== 6}
            className="w-full bg-[#f4520a] hover:bg-[#c43d08] py-3 rounded-lg font-semibold text-lg transition disabled:opacity-50"
          >
            {caricando ? "Verifica in corso..." : "Verifica"}
          </button>
        </form>

        <button
          onClick={rinviaCodice}
          className="w-full text-center text-white/50 hover:text-white text-sm mt-5 transition"
        >
          Non hai ricevuto il codice? Invialo di nuovo
        </button>
      </div>
    </main>
  );
}

export default function VerificaEmail() {
  return (
    <Suspense fallback={null}>
      <VerificaEmailContent />
    </Suspense>
  );
}
