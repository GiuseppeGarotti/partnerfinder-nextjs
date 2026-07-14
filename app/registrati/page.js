"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Registrati() {
  const router = useRouter();
  const [tipo, setTipo] = useState("sponsee");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [caricando, setCaricando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore("");
    setCaricando(true);

    try {
      const res = await fetch("/api/auth/registrati", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, nome, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrore(data.error || "Errore durante la registrazione");
        setCaricando(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setCaricando(false);

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setErrore("Errore di connessione. Riprova.");
      setCaricando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="text-white/60 hover:text-white text-base">
          ← Torna alla home
        </Link>

        <h1 className="text-4xl font-bold mt-6 mb-2">Crea account</h1>
        <p className="text-white/60 text-lg mb-8">
          Hai già un account?{" "}
          <Link href="/login" className="text-[#f4520a] hover:underline">
            Accedi
          </Link>
        </p>

        {errore && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-base">
            {errore}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-base mb-3 text-white/80">
            Tipo di account
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipo("sponsor")}
              className={`border rounded-lg p-4 text-left transition ${
                tipo === "sponsor"
                  ? "border-[#f4520a] bg-[#f4520a]/10"
                  : "border-white/20"
              }`}
            >
              <div className="font-semibold text-lg">Sponsor</div>
              <div className="text-base text-white/50">
                Voglio sponsorizzare
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTipo("sponsee")}
              className={`border rounded-lg p-4 text-left transition ${
                tipo === "sponsee"
                  ? "border-[#f4520a] bg-[#f4520a]/10"
                  : "border-white/20"
              }`}
            >
              <div className="font-semibold text-lg">Sponsee</div>
              <div className="text-base text-white/50">Cerco sponsor</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-base mb-2 text-white/80">
              Nome / Ragione sociale
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-[#f4520a]"
            />
          </div>

          <div>
            <label className="block text-base mb-2 text-white/80">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-[#f4520a]"
            />
          </div>

          <div>
            <label className="block text-base mb-2 text-white/80">
              Password (min 6 caratteri)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-[#f4520a]"
            />
          </div>

          <button
            type="submit"
            disabled={caricando}
            className="w-full bg-[#f4520a] hover:bg-[#c43d08] py-3 rounded-lg font-semibold text-lg transition disabled:opacity-50"
          >
            {caricando ? "Registrazione in corso..." : "Crea account"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-white/40 text-base">oppure</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full border border-white/30 hover:border-white py-3 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continua con Google
        </button>
      </div>
    </main>
  );
}
