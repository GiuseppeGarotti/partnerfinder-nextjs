import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1923] text-white">
      <Navbar />

      {/* Hero */}
      <section className="px-6 md:px-12 pt-24 pb-16 text-center max-w-5xl mx-auto">
        <p
          className="text-[#f4520a] font-semibold tracking-widest text-sm mb-6 animate-blur-in"
          style={{ animationDelay: "0ms" }}
        >
          • LA PIATTAFORMA ITALIANA PER LE SPONSORIZZAZIONI
        </p>
        <h1
          className="text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6 animate-blur-in"
          style={{ animationDelay: "100ms" }}
        >
          Trova lo sponsor
          <br />
          giusto per la tua idea.
        </h1>
        <p
          className="text-white/50 text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-blur-in"
          style={{ animationDelay: "250ms" }}
        >
          Partner Finder connette aziende che vogliono sponsorizzare con
          eventi, associazioni e progetti che cercano supporto.
        </p>
        <div
          className="flex flex-wrap gap-4 justify-center animate-blur-in"
          style={{ animationDelay: "400ms" }}
        >
          <Link
            href="/registrati"
            className="bg-[#f4520a] hover:bg-[#c43d08] px-6 py-3 rounded-lg font-semibold transition"
          >
            Registra la tua azienda →
          </Link>
          <Link
            href="/esplora"
            className="border border-white/30 hover:border-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Esplora sponsor
          </Link>
        </div>
      </section>

      {/* Come funziona - card numerate */}
      <section className="px-6 md:px-12 pb-24 max-w-3xl mx-auto space-y-6">
        {[
          {
            numero: "01",
            icona: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4520a" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
            titolo: "Registrati",
            testo: "Crea il tuo profilo come Sponsor o Sponsee in pochi minuti.",
          },
          {
            numero: "02",
            icona: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4520a" strokeWidth="2">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
            ),
            titolo: "Connettiti",
            testo: "Esplora i profili, invia richieste e avvia la conversazione guidata.",
          },
          {
            numero: "03",
            icona: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4520a" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            ),
            titolo: "Accordo sicuro",
            testo: "Definisci i dettagli, conferma e paga in totale sicurezza con Escrow.",
          },
        ].map((step, i) => (
          <div
            key={step.numero}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141d29] p-8 animate-blur-in"
            style={{ animationDelay: `${550 + i * 150}ms` }}
          >
            <span className="absolute top-4 right-6 text-6xl font-extrabold text-white/[0.04] select-none">
              {step.numero}
            </span>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#f4520a]/10 flex items-center justify-center mb-5">
                {step.icona}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.titolo}</h3>
              <p className="text-white/40">{step.testo}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Perché PartnerFinder */}
      <section className="px-6 md:px-12 pb-24 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 animate-blur-in">
          Perché PartnerFinder
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              icona: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4520a" strokeWidth="2">
                  <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
                </svg>
              ),
              titolo: "Pagamenti sicuri",
              testo: "Escrow con Stripe per proteggere entrambe le parti.",
            },
            {
              icona: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4520a" strokeWidth="2">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" />
                  <path d="M17 6h6v6" />
                </svg>
              ),
              titolo: "Commissioni trasparenti",
              testo: "Tariffe chiare e competitive su ogni transazione.",
            },
            {
              icona: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4520a" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
              titolo: "Chat guidata",
              testo: "Conversazioni strutturate per chiudere gli accordi.",
            },
            {
              icona: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4520a" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l3 3 5-6" />
                </svg>
              ),
              titolo: "Verifica identità",
              testo: "Documenti verificati per la massima sicurezza.",
            },
          ].map((item, i) => (
            <div
              key={item.titolo}
              className="bg-[#141d29] border border-white/10 rounded-2xl p-6 animate-blur-in"
              style={{ animationDelay: `${1000 + i * 120}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-[#f4520a]/10 flex items-center justify-center mb-4">
                {item.icona}
              </div>
              <h3 className="font-bold text-lg mb-1">{item.titolo}</h3>
              <p className="text-white/40 text-sm">{item.testo}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA finale */}
      <section className="px-6 md:px-12 pb-24 max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-4 animate-blur-in">
          Pronto a trovare il tuo partner?
        </h2>
        <p className="text-white/50 text-lg mb-8 animate-blur-in" style={{ animationDelay: "100ms" }}>
          Unisciti a PartnerFinder e inizia a creare connessioni di valore.
        </p>
        <Link
          href="/registrati"
          className="inline-block bg-[#f4520a] hover:bg-[#c43d08] px-8 py-4 rounded-lg font-semibold text-lg transition animate-blur-in"
          style={{ animationDelay: "200ms" }}
        >
          Crea il tuo account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#f4520a] flex items-center justify-center font-bold text-xs">
            PF
          </div>
          <span className="font-semibold">PartnerFinder © 2026</span>
        </div>
        <p className="text-white/30 text-sm">
          La piattaforma italiana per le sponsorizzazioni
        </p>
      </footer>
    </main>
  );
}
