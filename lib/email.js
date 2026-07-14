import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function inviaEmailOtp(destinatario, codice) {
  await transporter.sendMail({
    from: `"PartnerFinder" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: "Il tuo codice di verifica PartnerFinder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background:#0f1923; padding: 32px; border-radius: 12px;">
        <h2 style="color:#f4520a; margin-bottom: 4px;">PartnerFinder</h2>
        <p style="color:#ffffff;">Ecco il tuo codice di verifica:</p>
        <p style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color:#ffffff; background:#141d29; padding: 16px; text-align:center; border-radius: 8px;">${codice}</p>
        <p style="color:#9ca3af; font-size: 13px;">Il codice scade tra 10 minuti. Se non hai richiesto tu la registrazione, ignora questa email.</p>
      </div>
    `,
  });
}
