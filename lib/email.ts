import nodemailer from "nodemailer";
import type { Briefing } from "./types";

const PARIS_TZ = "Europe/Paris";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTargetLabel(b: Briefing): string {
  const d = new Date(b.targetDate);
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: PARIS_TZ
  }).format(d);
  return fmt.charAt(0).toUpperCase() + fmt.slice(1);
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: PARIS_TZ
  }).format(new Date(iso));
}

function pickHero(b: Briefing): { emoji: string; punchline: string } {
  if (b.pivot.heatAlert) return { emoji: "🥵🍦", punchline: "Canicule en vue — full glace, pense aux boissons fraîches !" };
  if (b.pivot.mode === "glace") return { emoji: "🍦☀️", punchline: "Soleil sur la Seine — c'est la journée des glaces." };
  if (b.weather.precipProbPct >= 60) return { emoji: "☔️🥞", punchline: "Pluie probable — crêpes nutella et cocooning au programme." };
  if (b.cardigan.level === "red") return { emoji: "🧥🥞", punchline: "Petit frisson sur le quai — sors le gilet de Mamie !" };
  return { emoji: "🥞🌊", punchline: "Service tout en douceur sur le quai." };
}

function statRow(label: string, value: string, accent: string): string {
  return `
    <td style="padding:8px 12px;border-radius:14px;background:${accent};vertical-align:top;">
      <div style="font:600 11px/1 'Helvetica Neue',Arial,sans-serif;color:#5a5147;letter-spacing:.06em;text-transform:uppercase;">${escapeHtml(label)}</div>
      <div style="margin-top:4px;font:700 18px/1.1 'Helvetica Neue',Arial,sans-serif;color:#2a221a;">${escapeHtml(value)}</div>
    </td>
  `;
}

function eventLine(title: string, time: string, distanceKm: number): string {
  return `
    <tr>
      <td style="padding:6px 0;font:600 13px/1.4 'Helvetica Neue',Arial,sans-serif;color:#2a221a;">
        <span style="display:inline-block;min-width:46px;color:#a06a4a;font-variant-numeric:tabular-nums;">${escapeHtml(time)}</span>
        ${escapeHtml(title)}
        <span style="color:#9b8b78;font-weight:500;">· ${distanceKm.toFixed(1)} km</span>
      </td>
    </tr>
  `;
}

const ICE_CREAM_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
  <defs>
    <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e0a878"/><stop offset="1" stop-color="#a06a4a"/>
    </linearGradient>
    <linearGradient id="scoop1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fce4d6"/><stop offset="1" stop-color="#f4b89b"/>
    </linearGradient>
    <linearGradient id="scoop2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#f3d27a"/>
    </linearGradient>
  </defs>
  <polygon points="60,118 32,58 88,58" fill="url(#cone)"/>
  <path d="M34,60 L86,60 L82,68 L38,68 Z" fill="#7a4b2a" opacity="0.4"/>
  <circle cx="50" cy="46" r="22" fill="url(#scoop1)"/>
  <circle cx="72" cy="46" r="22" fill="url(#scoop2)"/>
  <circle cx="60" cy="32" r="18" fill="#fce4d6"/>
  <circle cx="56" cy="28" r="3" fill="#e87572"/>
  <circle cx="64" cy="36" r="2.5" fill="#88c0a4"/>
  <circle cx="48" cy="40" r="2" fill="#f4b066"/>
  <circle cx="74" cy="38" r="2" fill="#88c0a4"/>
  <circle cx="60" cy="20" r="6" fill="#e87572"/>
  <rect x="58.5" y="8" width="3" height="14" rx="1.5" fill="#7a4b2a"/>
</svg>
`;

export function renderBriefingEmail(b: Briefing, siteUrl: string): { subject: string; html: string; text: string } {
  const dateLabel = formatTargetLabel(b);
  const hero = pickHero(b);
  const events = b.events.slice(0, 4);
  const tempRange = `${Math.round(b.weather.tempC)}°C`;
  const modeLabel = b.pivot.mode === "glace" ? "Glace 🍦" : "Crêpe 🥞";
  const cardiganLabel =
    b.cardigan.level === "red" ? "Gilet obligatoire" : b.cardigan.level === "amber" ? "Petit gilet" : "Tee-shirt";
  const batterPct = `${b.recommendation.batterVolumePct}%`;
  const subject = `🍦 Briefing ${dateLabel} · ${modeLabel} · ${tempRange}`;

  const text = [
    `Glaces en Seine — Briefing du ${dateLabel}`,
    ``,
    hero.punchline,
    ``,
    `Météo : ${tempRange} (ressenti ${Math.round(b.weather.feelsLikeC)}°C), vent ${Math.round(b.weather.windKmh)} km/h, pluie ${Math.round(b.weather.precipProbPct)}%`,
    `Mode : ${b.pivot.mode === "glace" ? "Glace" : "Crêpe"}`,
    `Pâte : ${batterPct} · Staffing : ${b.recommendation.staffing}`,
    `Topping du jour : ${b.recommendation.topping}`,
    ``,
    events.length
      ? `Événements alentour :\n${events.map((e) => `  - ${formatTime(e.startISO)} · ${e.title} (${e.distanceKm.toFixed(1)} km)`).join("\n")}`
      : `Aucun gros événement détecté à 10 km.`,
    ``,
    `Briefing complet : ${siteUrl}`
  ].join("\n");

  const eventsHtml = events.length
    ? events.map((e) => eventLine(e.title, formatTime(e.startISO), e.distanceKm)).join("")
    : `<tr><td style="padding:8px 0;font:500 13px/1.4 'Helvetica Neue',Arial,sans-serif;color:#9b8b78;">Aucun gros événement détecté à 10 km.</td></tr>`;

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#fbf6ee;font-family:'Helvetica Neue',Arial,sans-serif;color:#2a221a;">
  <div style="display:none;max-height:0;overflow:hidden;color:transparent;">${escapeHtml(hero.punchline)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fbf6ee;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#fffaf2;border-radius:24px;box-shadow:0 6px 24px rgba(60,40,20,0.08);overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#f7d7b5 0%,#f4b89b 50%,#e8a384 100%);padding:24px;text-align:center;">
            <div style="margin:0 auto 8px;">${ICE_CREAM_SVG}</div>
            <div style="font:800 22px/1.2 'Helvetica Neue',Arial,sans-serif;color:#3b2818;">Glaces en Seine</div>
            <div style="margin-top:4px;font:600 14px/1.3 'Helvetica Neue',Arial,sans-serif;color:#5a3a25;">Briefing · ${escapeHtml(dateLabel)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 22px 6px;">
            <div style="font:700 20px/1.3 'Helvetica Neue',Arial,sans-serif;color:#2a221a;">${escapeHtml(hero.emoji)} ${escapeHtml(hero.punchline)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 18px 18px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="6" border="0">
              <tr>
                ${statRow("Température", tempRange, "#fde9d4")}
                ${statRow("Mode", modeLabel, "#e6f0e1")}
              </tr>
              <tr>
                ${statRow("Pâte à prévoir", batterPct, "#fae3d2")}
                ${statRow("Gilet Mamie", cardiganLabel, "#f6dce1")}
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 22px 8px;">
            <div style="font:700 13px/1 'Helvetica Neue',Arial,sans-serif;color:#5a5147;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">Événements à 10 km</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${eventsHtml}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 22px 14px;">
            <div style="font:700 13px/1 'Helvetica Neue',Arial,sans-serif;color:#5a5147;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">Topping du jour</div>
            <div style="font:600 14px/1.4 'Helvetica Neue',Arial,sans-serif;color:#2a221a;">${escapeHtml(b.recommendation.topping)}</div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:8px 22px 28px;">
            <a href="${escapeHtml(siteUrl)}" style="display:inline-block;padding:14px 26px;border-radius:999px;background:#a06a4a;color:#ffffff;font:700 15px/1 'Helvetica Neue',Arial,sans-serif;text-decoration:none;">Ouvrir le briefing complet →</a>
            <div style="margin-top:14px;font:500 11px/1.4 'Helvetica Neue',Arial,sans-serif;color:#9b8b78;">Données rafraîchies plusieurs fois par semaine — la prévision se précise à mesure que le service approche.</div>
          </td>
        </tr>
      </table>
      <div style="margin-top:14px;font:500 11px/1.4 'Helvetica Neue',Arial,sans-serif;color:#9b8b78;">Quai de Seine · La Frette-sur-Seine · Service 14h–19h Sam/Dim/Fériés</div>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

interface SendConfig {
  user: string;
  pass: string;
  to: string;
  from?: string;
}

function getSendConfig(): SendConfig | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.EMAIL_TO ?? user;
  if (!user || !pass || !to) return null;
  return { user, pass, to, from: process.env.EMAIL_FROM ?? `Glaces en Seine <${user}>` };
}

export async function sendBriefingEmail(b: Briefing, siteUrl: string): Promise<{ ok: true; messageId: string } | { ok: false; reason: string }> {
  const cfg = getSendConfig();
  if (!cfg) {
    return { ok: false, reason: "missing_credentials: set GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_TO" };
  }
  const { subject, html, text } = renderBriefingEmail(b, siteUrl);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: cfg.user, pass: cfg.pass }
  });
  try {
    const info = await transporter.sendMail({
      from: cfg.from,
      to: cfg.to,
      subject,
      html,
      text
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "send_failed" };
  }
}
