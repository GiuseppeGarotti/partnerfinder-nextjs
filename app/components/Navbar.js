"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuAperto, setMenuAperto] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10 bg-[#0f1923] text-white relative">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#f4520a] flex items-center justify-center font-bold text-sm">
          PF
        </div>
        <span className="text-xl font-bold">
          Partner<span className="text-[#f4520a]">Finder</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {status === "loading" && (
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
        )}

        {status === "unauthenticated" && (
          <>
            <Link href="/login" className="text-white/80 hover:text-white">
              Accedi
            </Link>
            <Link
              href="/registrati"
              className="bg-[#f4520a] hover:bg-[#c43d08] px-5 py-2 rounded-lg font-semibold transition"
            >
              Inizia ora
            </Link>
          </>
        )}

        {status === "authenticated" && (
          <div className="relative">
            <button
              onClick={() => setMenuAperto(!menuAperto)}
              className="flex items-center gap-3 hover:bg-white/5 px-3 py-2 rounded-lg transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#f4520a] flex items-center justify-center font-bold text-sm">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-sm text-white/80 hidden sm:block">
                {session.user.name}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-white/50"
              >
                <path d="M6 9l6 6 6-6" strokeWidth="2" />
              </svg>
            </button>

            {menuAperto && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1a2535] border border-white/10 rounded-lg shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-sm text-white/50">Accesso come</p>
                  <p className="font-semibold capitalize">
                    {session.user.tipo || "utente"}
                  </p>
                </div>
                <Link
                  href={
                    session.user.tipo === "sponsor"
                      ? "/dashboard/sponsor"
                      : session.user.tipo === "admin"
                      ? "/admin"
                      : "/dashboard/sponsee"
                  }
                  className="block px-4 py-2 hover:bg-white/5 text-sm"
                  onClick={() => setMenuAperto(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-4 py-2 hover:bg-white/5 text-sm text-red-400"
                >
                  Esci
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
