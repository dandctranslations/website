const { app } = require('@azure/functions');
const { ACCOUNTS } = require('../../accounts');
const { resendClient, escapeHtml, formatAmount, shell, detailRows, deliveryNote } = require('../../shared/email');

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

    const { client = '', email = '', region = '', amount = '', reference = '', serviceType = '', lang = 'en' } = body;
    const account = ACCOUNTS[region];

    if (!email || !account || amount === '' || amount == null) {
      return { status: 400, jsonBody: { ok: false, error: 'Missing customer email, region, or amount.' } };
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

    const emailBody = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 4px;font-size:15px;">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 20px;font-size:15px;color:#6B7280;">${escapeHtml(intro)}</p>
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#3B5CE6;">${escapeHtml(bankHeading)} — ${escapeHtml(account.label)}</p>
      ${rows}
      <div style="margin-top:24px;padding:16px;background:#EEF2FE;border-radius:8px;font-size:14px;line-height:1.6;">
        ${escapeHtml(deliveryNote(lang, serviceType))}
      </div>
    `;

    try {
      const resend = resendClient();
      const { error } = await resend.emails.send({
        from: process.env.FROM_INVOICES || 'D&C Translations <invoices@dandctranslations.com>',
        to: email,
        replyTo: process.env.OWNER_EMAIL || 'dandctranslations@gmail.com',
        subject: uz ? 'D&C Translations — to‘lov ma’lumotlari' : 'D&C Translations — your payment details',
        html: shell(heading, emailBody),
      });
      if (error) throw error;
    } catch (err) {
      context.error('Resend send failed', err);
      return { status: 502, jsonBody: { ok: false, error: 'Could not send the invoice email.' } };
    }

    return { status: 200, jsonBody: { ok: true } };
  },
});
