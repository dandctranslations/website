// Shared email helpers: Gmail SMTP transport, branded HTML shell, currency
// formatting, and the localized invoice copy. Kept framework-free so it works
// inside any Azure Function.

const nodemailer = require('nodemailer');

const BRAND = {
  blue: '#3B5CE6',
  dark: '#0F1729',
  tint: '#EEF2FE',
  gray: '#6B7280',
};

const SITE_URL = 'https://dandctranslations.com';

// The Gmail account we authenticate and send as. Emails go out FROM this
// address (it shows in the account's "Sent" folder and replies come back here).
function gmailUser() {
  return process.env.GMAIL_USER || 'dandctranslations@gmail.com';
}

// Reusable Gmail SMTP transport, built lazily so a missing App Password surfaces
// at send time with a clear message. Authenticates with a Google "App Password"
// (requires 2-Step Verification on the account) — never the normal login password.
let transporter;
function gmailTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error('GMAIL_USER / GMAIL_APP_PASSWORD are not configured');
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }
  return transporter;
}

// Send an email from the Gmail account. `attachments` use nodemailer's shape:
// { filename, content }. Resolves on success, throws on failure.
async function sendMail({ to, replyTo, subject, html, attachments }) {
  const transport = gmailTransport();
  await transport.sendMail({
    from: `D&C Translations <${gmailUser()}>`,
    to,
    replyTo: replyTo || gmailUser(),
    subject,
    html,
    attachments,
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatAmount(amount, currency) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${amount} ${currency}`;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'UZS' ? 0 : 2,
    }).format(n);
  } catch {
    return `${n.toLocaleString()} ${currency}`;
  }
}

// Wrap body HTML in a branded, email-client-safe shell (inline styles, tables).
function shell(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND.tint};font-family:Inter,Segoe UI,Arial,sans-serif;color:${BRAND.dark};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.tint};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 24px rgba(15,23,41,0.08);">
        <tr><td style="background:${BRAND.dark};padding:28px 32px;">
          <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.3px;">D&amp;C Translations</div>
          <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.blue};margin-top:4px;">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:32px;">${bodyHtml}</td></tr>
        <tr><td style="padding:20px 32px;background:${BRAND.tint};font-size:12px;color:${BRAND.gray};">
          D&amp;C Translations &middot; NAATI Certified Uzbek&ndash;English Translator &amp; Interpreter<br>
          Brisbane, Australia &amp; Tashkent, Uzbekistan
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function button(href, label) {
  return `<a href="${href}" style="display:inline-block;background:${BRAND.blue};color:#ffffff;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;font-size:14px;padding:14px 28px;border-radius:4px;">${escapeHtml(label)}</a>`;
}

function detailRows(pairs) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0;">
    ${pairs
      .map(
        ([label, value]) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #F1F1F4;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.gray};width:45%;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #F1F1F4;font-size:15px;font-weight:600;color:${BRAND.dark};">${escapeHtml(value)}</td>
    </tr>`,
      )
      .join('')}
  </table>`;
}

// Default delivery note (fallback when the invoice tool doesn't supply its own).
// Interpreting jobs don't produce a document, so they get a blank note.
function deliveryNote(lang, serviceType) {
  const isInterpreting = /interpret|og.?zaki/i.test(serviceType || '');
  if (isInterpreting) return '';
  return lang === 'uz'
    ? 'To‘lovingiz qabul qilingach, tarjima qilingan hujjat(lar)ingiz tez orada elektron pochtangizga yuboriladi.'
    : 'Once your payment has been received, your translated document/s will be delivered to your email shortly.';
}

module.exports = { sendMail, gmailUser, escapeHtml, formatAmount, shell, button, detailRows, deliveryNote, BRAND, SITE_URL };
