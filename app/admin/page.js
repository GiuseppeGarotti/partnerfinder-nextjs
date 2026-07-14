"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [utenti, setUtenti] = useState([]);
  const [caricando, setCaricando] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session.user.tipo !== "admin") {
      router.push(
        session.user.tipo === "sponsor"
          ? "/dashboard/sponsor"
          : "/dashboard/sponsee"
      );
      return;
    }
    if (status === "authenticated") {
      fetch("/api/admin/utenti")
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            setErrore(data.error);
          } else {
            setUtenti(data.utenti);
          }
          setCaricando(false);
        });
    }
  }, [status, session, router]);

  if (status === "loading" || caricando) {
    return (
      <main className="min-h-screen bg-[#0f1923] text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-white/50">Caricamento...</p>
        </div>
      </main>
    );
  }

  const sponsor = utenti.filter((u) => u.tipo === "sponsor").length;
  const sponsee = utenti.filter((u) => u.tipo === "sponsee").length;

  return (
    <main className="min-h-screen bg-[#0f1923] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-1">Pannello Admin</h1>
        <p className="text-white/40 mb-8">
          Gestione utenti di PartnerFinder
        </p>

        {errore && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {errore}
          </div>
        )}

        {/* Statistiche */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#141d29] border border-white/10 rounded-xl p-5">
            <p className="text-white/40 text-sm mb-1">Totale utenti</p>
            <p className="text-3xl font-bold">{utenti.length}</p>
          </div>
          <div className="bg-[#141d29] border border-white/10 rounded-xl p-5">
            <p className="text-white/40 text-sm mb-1">Sponsor</p>
            <p className="text-3xl font-bold text-[#f4520a]">{sponsor}</p>
          </div>
          <div className="bg-[#141d29] border border-white/10 rounded-xl p-5">
            <p className="text-white/40 text-sm mb-1">Sponsee</p>
            <p className="text-3xl font-bold text-[#f4520a]">{sponsee}</p>
          </div>
        </div>

        {/* Tabella utenti */}
        <div className="bg-[#141d29] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/50 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Registrato</th>
              </tr>
            </thead>
            <tbody>
              {utenti.map((u) => (
                <tr key={u._id} className="border-t border-white/5">
                  <td className="px-5 py-3">{u.nome}</td>
                  <td className="px-5 py-3 text-white/60">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        u.tipo === "sponsor"
                          ? "bg-[#f4520a]/10 text-[#f4520a]"
                          : u.tipo === "admin"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {u.tipo}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-white/40">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("it-IT")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
