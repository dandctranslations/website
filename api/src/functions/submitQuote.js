const { app } = require('@azure/functions');
const Busboy = require('busboy');
const { resendClient, escapeHtml, shell, button, detailRows, SITE_URL } = require('../../shared/email');

const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // ~20MB, safely under Gmail's 25MB receive limit after encoding
const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

// Parse a multipart/form-data body (already buffered) into { fields, files }.
// Rejects if the running total of file bytes exceeds MAX_TOTAL_BYTES.
function parseMultipart(buffer, contentType) {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: { 'content-type': contentType }, limits: { files: 20 } });
    const fields = {};
    const files = [];
    let totalBytes = 0;
    let tooLarge = false;

    bb.on('field', (name, val) => {
      fields[name] = val;
    });

    bb.on('file', (name, stream, info) => {
      const chunks = [];
      stream.on('data', (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes > MAX_TOTAL_BYTES) {
          tooLarge = true;
          stream.resume(); // drain without buffering further
          return;
        }
        chunks.push(chunk);
      });
      stream.on('end', () => {
        if (!tooLarge) {
          files.push({ filename: info.filename, content: Buffer.concat(chunks) });
        }
      });
    });

    bb.on('error', reject);
    bb.on('close', () => {
      if (tooLarge) return reject(Object.assign(new Error('TOO_LARGE'), { code: 'TOO_LARGE' }));
      resolve({ fields, files });
    });

    bb.end(buffer);
  });
}

function extOf(name) {
  const m = /\.([^.]+)$/.exec(name || '');
  return m ? m[1].toLowerCase() : '';
}

app.http('submit-quote', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return { status: 400, jsonBody: { ok: false, error: 'Expected multipart/form-data' } };
    }

    let parsed;
    try {
      const buffer = Buffer.from(await request.arrayBuffer());
      parsed = await parseMultipart(buffer, contentType);
    } catch (err) {
      if (err.code === 'TOO_LARGE') {
        return { status: 413, jsonBody: { ok: false, error: 'Attachments exceed the 20 MB limit.' } };
      }
      context.error('Failed to parse upload', err);
      return { status: 400, jsonBody: { ok: false, error: 'Could not read the submitted form.' } };
    }

    const { fields, files } = parsed;
    const { name = '', email = '', phone = '', service = '', from = '', to = '', notes = '', lang = 'en' } = fields;

    if (!name || !email) {
      return { status: 400, jsonBody: { ok: false, error: 'Name and email are required.' } };
    }

    const bad = files.find((f) => !ALLOWED_EXT.includes(extOf(f.filename)));
    if (bad) {
      return { status: 415, jsonBody: { ok: false, error: `File type not allowed: ${bad.filename}` } };
    }

    const invoiceUrl = `${SITE_URL}/invoice/new?${new URLSearchParams({
      client: name,
      email,
      service,
      lang,
    }).toString()}`;

    const rows = detailRows([
      ['Name', name],
      ['Email', email],
      ['Phone', phone || '—'],
      ['Service', service || '—'],
      ['From → To', from || to ? `${from || '?'} → ${to || '?'}` : '—'],
      ['Files', files.length ? files.map((f) => f.filename).join(', ') : 'None'],
    ]);

    const notesHtml = notes
      ? `<p style="margin:20px 0 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6B7280;">Notes</p>
         <p style="margin:6px 0 0;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(notes)}</p>`
      : '';

    const body = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;">New quote request</h1>
      <p style="margin:0 0 20px;color:#6B7280;font-size:14px;">Reply to this email to respond to the customer directly.</p>
      ${rows}
      ${notesHtml}
      <div style="margin-top:28px;">${button(invoiceUrl, 'Create invoice')}</div>
    `;

    try {
      const resend = resendClient();
      const { error } = await resend.emails.send({
        from: process.env.FROM_NOREPLY || 'D&C Translations <noreply@dandctranslations.com>',
        to: process.env.OWNER_EMAIL || 'dandctranslations@gmail.com',
        replyTo: email,
        subject: `New quote request — ${name}${service ? ` (${service})` : ''}`,
        html: shell('New quote request', body),
        attachments: files.map((f) => ({ filename: f.filename, content: f.content })),
      });
      if (error) throw error;
    } catch (err) {
      context.error('Resend send failed', err);
      return { status: 502, jsonBody: { ok: false, error: 'Could not send the request. Please try again or email us directly.' } };
    }

    return { status: 200, jsonBody: { ok: true } };
  },
});
