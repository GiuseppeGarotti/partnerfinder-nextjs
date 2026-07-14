"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user.tipo === "sponsor") router.push("/dashboard/sponsor");
      else if (session.user.tipo === "admin") router.push("/admin");
      else router.push("/dashboard/sponsee");
    }
  }, [status, session, router]);

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex items-center justify-center">
      <p className="text-white/50">Caricamento...</p>
    </main>
  );
}
