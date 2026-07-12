const { app } = require('@azure/functions');
const { ACCOUNTS } = require('../../accounts');
const { sendMail, gmailUser, escapeHtml, formatAmount, shell, detailRows, deliveryNote: computeDeliveryNote } = require('../../shared/email');

// Confirm the caller holds the SWA "admin" role. Static Web Apps injects the
// authenticated principal as a base64 JSON header; unauthenticated requests are
// already blocked by staticwebapp.config.json, this is defence in depth.
function isAdmin(request) {
  const header = request.headers.get('x-ms-client-principal');
  if (!header) return process.env.NODE_ENV === 'development'; // allow locally via `swa start`
  try {
    const principal = JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
    return Array.isArray(principal.userRoles) && principal.userRoles.includes('administrator');
  } catch {
    return false;
  }
}

app.http('send-invoice', {
  methods: ['POST'],
  authLevel: 'anonymous', // access control handled by SWA route rules + isAdmin()
  handler: async (request, context) => {
    if (!isAdmin(request)) {
      return { status: 401, jsonBody: { ok: false, error: 'Not authorised.' } };
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { ok: false, error: 'Invalid JSON body.' } };
    }

    const { client = '', email = '', region = '', amount = '', reference = '', serviceType = '', lang = 'en', message = '', preview = false } = body;
    const account = ACCOUNTS[region];

    // Delivery note: use exactly what the tool sends (may be blank to omit it).
    // Only fall back to the computed default when the field is absent entirely,
    // so non-tool callers still get sensible copy.
    const noteText = body.deliveryNote === undefined ? computeDeliveryNote(lang, serviceType) : body.deliveryNote;

    // The live preview renders with whatever's filled in so far, so it only needs
    // a valid region. A real send still requires the customer email and amount.
    if (!account) {
      return { status: 400, jsonBody: { ok: false, error: 'Unknown region.' } };
    }
    if (!preview && (!email || amount === '' || amount == null)) {
      return { status: 400, jsonBody: { ok: false, error: 'Missing customer email or amount.' } };
    }

    const uz = lang === 'uz';
    const heading = uz ? 'To‘lov ma’lumotlari' : 'Your payment details';
    const greeting = uz ? `Hurmatli ${client || 'mijoz'},` : `Dear ${client || 'customer'},`;
    const intro = uz
      ? 'Buyurtmangiz uchun rahmat. Quyida to‘lov tafsilotlari keltirilgan.'
      : 'Thank you for your request. Your payment details are below.';
    const bankHeading = uz ? 'Bank o‘tkazmasi' : 'Bank transfer';
    const amountLabel = uz ? 'Summa' : 'Amount';
    const refLabel = uz ? 'To‘lov ma’lumoti (iltimos, kiriting)' : 'Payment reference (please include)';

    const rows = detailRows([
      [amountLabel, formatAmount(amount, account.currency)],
      ...(reference ? [[refLabel, reference]] : []),
      ...account.fields.map((f) => [f.label, f.value]),
    ]);

    // Optional personal note from the owner, shown above the bank details.
    // Newlines are preserved; the text is escaped so it can't inject HTML.
    const messageHtml = message.trim()
      ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message.trim())}</p>`
      : '';

    const emailBody = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 4px;font-size:15px;">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 20px;font-size:15px;color:#6B7280;">${escapeHtml(intro)}</p>
      ${messageHtml}
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#3B5CE6;">${escapeHtml(bankHeading)} — ${escapeHtml(account.label)}</p>
      ${rows}
      ${
        noteText && noteText.trim()
          ? `<div style="margin-top:24px;padding:16px;background:#EEF2FE;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(noteText.trim())}</div>`
          : ''
      }
    `;

    const html = shell(heading, emailBody);

    // Preview mode: return the rendered email HTML instead of sending, so the
    // admin tool can show a faithful inbox preview (including the server-side
    // bank details, which never ship to the browser otherwise).
    if (preview) {
      return { status: 200, jsonBody: { ok: true, html } };
    }

    try {
      await sendMail({
        to: email,
        replyTo: gmailUser(),
        subject: uz ? 'D&C Translations — to‘lov ma’lumotlari' : 'D&C Translations — your payment details',
        html,
      });
    } catch (err) {
      context.error('Gmail send failed', err);
      return { status: 502, jsonBody: { ok: false, error: 'Could not send the invoice email.' } };
    }

    return { status: 200, jsonBody: { ok: true } };
  },
});
