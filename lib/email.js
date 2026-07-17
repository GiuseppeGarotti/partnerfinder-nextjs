export async function inviaEmailOtp(destinatario, codice) {
  await inviaEmail(
    destinatario,
    "Il tuo codice di verifica PartnerFinder",
    `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background:#0f1923; padding: 32px; border-radius: 12px;">
        <h2 style="color:#f4520a; margin-bottom: 4px;">PartnerFinder</h2>
        <p style="color:#ffffff;">Ecco il tuo codice di verifica:</p>
        <p style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color:#ffffff; background:#141d29; padding: 16px; text-align:center; border-radius: 8px;">${codice}</p>
        <p style="color:#9ca3af; font-size: 13px;">Il codice scade tra 10 minuti. Se non hai richiesto tu la registrazione, ignora questa email.</p>
      </div>
    `
  );
}

export async function inviaNotificaNuovaRichiesta(
  destinatario,
  sponsorNome,
  sponseeNome,
  messaggio,
  richiestaId
) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  await inviaEmail(
    destinatario,
    `${sponseeNome} ti ha inviato una richiesta di sponsorizzazione`,
    `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background:#0f1923; padding: 32px; border-radius: 12px;">
        <h2 style="color:#f4520a; margin-bottom: 4px;">PartnerFinder</h2>
        <p style="color:#ffffff;">Ciao ${sponsorNome},</p>
        <p style="color:#ffffff;"><strong>${sponseeNome}</strong> ti ha inviato una nuova richiesta di sponsorizzazione:</p>
        <p style="color:#9ca3af; background:#141d29; padding: 16px; border-radius: 8px; font-style: italic;">"${messaggio}"</p>
        <a href="${baseUrl}/chat/${richiestaId}" style="display:inline-block; background:#f4520a; color:#ffffff; padding: 12px 24px; border-radius: 8px; text-decoration:none; font-weight:bold; margin-top: 12px;">Rispondi ora</a>
      </div>
    `
  );
}

export async function inviaNotificaRispostaRichiesta(
  destinatario,
  sponseeNome,
  sponsorNome,
  stato,
  richiestaId
) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const esito = stato === "approvata" ? "approvato ✅" : "rifiutato ❌";
  await inviaEmail(
    destinatario,
    `${sponsorNome} ha ${esito === "approvato ✅" ? "approvato" : "rifiutato"} la tua richiesta`,
    `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background:#0f1923; padding: 32px; border-radius: 12px;">
        <h2 style="color:#f4520a; margin-bottom: 4px;">PartnerFinder</h2>
        <p style="color:#ffffff;">Ciao ${sponseeNome},</p>
        <p style="color:#ffffff;"><strong>${sponsorNome}</strong> ha ${esito} la tua richiesta di sponsorizzazione.</p>
        <a href="${baseUrl}/chat/${richiestaId}" style="display:inline-block; background:#f4520a; color:#ffffff; padding: 12px 24px; border-radius: 8px; text-decoration:none; font-weight:bold; margin-top: 12px;">Vai alla chat</a>
      </div>
    `
  );
}

async function inviaEmail(destinatario, oggetto, html) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "PartnerFinder <onboarding@resend.dev>",
      to: destinatario,
      subject: oggetto,
      html,
    }),
  });

  if (!res.ok) {
    const errore = await res.text();
    throw new Error("Errore invio email: " + errore);
  }
}
