import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Field, inputClasses, BoltIcon } from '../components/ui';
import { REGIONS } from '../paymentConfig';

const SERVICE_TYPES = [
  'Certified translation',
  'Regular translation',
  'Interpreting',
  'Editing & proofreading',
];

// Default text for the tinted delivery-note box at the bottom of the invoice
// email. Prefilled for translation work; blank for interpreting (no document is
// produced), so the owner can type their own note or leave it out.
function defaultDeliveryNote(lang, service) {
  if (/interpret/i.test(service || '')) return '';
  return lang === 'uz'
    ? 'To‘lovingiz qabul qilingach, tarjima qilingan hujjat(lar)ingiz tez orada elektron pochtangizga yuboriladi.'
    : 'Once your payment has been received, your translated document/s will be delivered to your email shortly.';
}

// Build a reference like DC-20260710-JD from today's date + the client's initials.
function suggestRef(client) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const initials = client
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join('')
    .slice(0, 4);
  return `DC-${date}${initials ? `-${initials}` : ''}`;
}

// Internal, auth-protected tool: the owner opens this (pre-filled from the quote
// notification email), sets an amount, writes an optional message, and sends the
// customer a branded invoice email with the bank details. The right-hand pane
// shows a live preview of exactly what will land in the client's inbox.
export default function InvoicePage() {
  const [params] = useSearchParams();
  const [client, setClient] = useState(params.get('client') || '');
  const [email, setEmail] = useState(params.get('email') || '');
  const [region, setRegion] = useState(REGIONS[0]?.code ?? '');
  const [amount, setAmount] = useState('');
  const [service, setService] = useState(params.get('service') || '');
  const [ref, setRef] = useState('');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState(params.get('lang') === 'uz' ? 'uz' : 'en');
  const [deliveryNote, setDeliveryNote] = useState(() =>
    defaultDeliveryNote(params.get('lang') === 'uz' ? 'uz' : 'en', params.get('service') || ''),
  );
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [access, setAccess] = useState('checking'); // checking | ok
  const [previewHtml, setPreviewHtml] = useState('');

  // Gate the tool to the SWA "administrator" role. The page itself is publicly
  // routable (it holds no secrets — bank details live server-side), so we check
  // the role client-side and bounce non-admins to login, preserving this exact
  // prefilled URL as the post-login destination. That's what makes the emailed
  // "Create invoice" deep link survive the auth round-trip.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let data;
      try {
        const res = await fetch('/.auth/me');
        data = await res.json();
      } catch {
        // /.auth/me isn't served outside Static Web Apps (e.g. plain `npm start`):
        // don't gate during local development.
        if (!cancelled) setAccess('ok');
        return;
      }
      const roles = data?.clientPrincipal?.userRoles || [];
      if (roles.includes('administrator')) {
        if (!cancelled) setAccess('ok');
      } else {
        const returnTo = window.location.pathname + window.location.search;
        window.location.replace(
          `/.auth/login/github?post_login_redirect_uri=${encodeURIComponent(returnTo)}`,
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-apply the default delivery note whenever the service or language changes
  // (e.g. switching to interpreting clears it). Manual edits survive changes to
  // the other fields — only these two inputs drive the default.
  useEffect(() => {
    setDeliveryNote(defaultDeliveryNote(lang, service));
  }, [lang, service]);

  const effectiveRef = ref.trim() || suggestRef(client);
  const canSend = email.trim() && region && amount !== '';
  const subject =
    lang === 'uz'
      ? 'D&C Translations — to‘lov ma’lumotlari'
      : 'D&C Translations — your payment details';

  // Live inbox preview: ask the server to render the email HTML (the same code
  // path the real send uses, so the bank details match) whenever the inputs
  // change. Debounced so we don't hammer the endpoint on every keystroke, and
  // skipped once the email has actually been sent.
  useEffect(() => {
    if (access !== 'ok' || status === 'sent' || !region) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/send-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            preview: true,
            client: client.trim(),
            email: email.trim(),
            region,
            amount: amount === '' ? 0 : amount,
            reference: effectiveRef,
            serviceType: service,
            lang,
            message,
            deliveryNote,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (data.ok && data.html) setPreviewHtml(data.html);
      } catch {
        /* preview is best-effort; ignore aborts and transient failures */
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [access, status, client, email, region, amount, effectiveRef, service, lang, message, deliveryNote]);

  const send = async () => {
    if (!canSend || status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: client.trim(),
          email: email.trim(),
          region,
          amount,
          reference: effectiveRef,
          serviceType: service,
          lang,
          message,
          deliveryNote,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong.');
      }
      setStatus('sent');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setStatus('error');
    }
  };

  if (access === 'checking') {
    return (
      <div className="flex min-h-screen flex-col font-sans">
        <Navbar variant="quote" />
        <main className="flex flex-1 items-center justify-center bg-brand-tint py-14">
          <p className="text-sm font-medium text-gray-500">Checking access…</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar variant="quote" />

      <section className="bg-brand-dark py-14 text-center">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-brand-blue">
            Internal Tool
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-white sm:text-5xl">
            Send Invoice
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Fill in the quote details, then email the payment details to the client.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-brand-tint py-14">
        {status === 'sent' ? (
          <div className="mx-auto max-w-2xl px-5 sm:px-8">
            <div className="rounded-xl bg-white p-10 text-center shadow-lg">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h2 className="mt-6 font-heading text-3xl font-extrabold text-brand-dark">
                Invoice sent
              </h2>
              <p className="mx-auto mt-3 max-w-md text-gray-600">
                The payment details were emailed to {email}.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-8 inline-flex items-center rounded-sm border border-gray-300 px-7 py-3 font-heading text-sm font-bold uppercase tracking-wide text-brand-dark hover:bg-gray-50"
              >
                Send another
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:items-start">
            {/* Left: inputs */}
            <div className="grid gap-6 rounded-xl bg-white p-6 shadow-lg sm:p-9">
              <Field label="Client name" htmlFor="client">
                <input
                  id="client"
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Jane Doe"
                  className={inputClasses}
                />
              </Field>

              <Field label="Client email" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className={inputClasses}
                />
              </Field>

              <Field label="Region / account" htmlFor="region">
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className={inputClasses}
                >
                  {REGIONS.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.label} ({r.currency})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Amount" htmlFor="amount">
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="250"
                  className={inputClasses}
                />
              </Field>

              <Field label="Service" htmlFor="service">
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={inputClasses}
                >
                  <option value="">— Optional —</option>
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Email language" htmlFor="lang">
                <select
                  id="lang"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className={inputClasses}
                >
                  <option value="en">English</option>
                  <option value="uz">O‘zbek</option>
                </select>
              </Field>

              <Field label="Payment reference" htmlFor="ref">
                <input
                  id="ref"
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder={suggestRef(client)}
                  className={inputClasses}
                />
                <span className="mt-1 block text-xs text-gray-500">
                  Leave blank to use <span className="font-mono">{suggestRef(client)}</span>.
                </span>
              </Field>

              <Field label="Message to client" htmlFor="message">
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Optional — add a personal note. It appears above the bank details."
                  className={inputClasses}
                />
              </Field>

              <Field label="Delivery note" htmlFor="deliveryNote">
                <textarea
                  id="deliveryNote"
                  rows={3}
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Shown in the highlighted box below the bank details. Leave blank to omit."
                  className={inputClasses}
                />
                <span className="mt-1 block text-xs text-gray-500">
                  Prefilled by default; cleared automatically for interpreting. Editing resets if you change the service or language.
                </span>
              </Field>

              <div className="border-t border-gray-100 pt-6">
                {status === 'error' && (
                  <p className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={send}
                  disabled={!canSend || status === 'sending'}
                  className="inline-flex items-center gap-2 rounded-sm bg-brand-blue px-7 py-3 font-heading text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-blueDark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <BoltIcon className="h-4 w-4" />
                  {status === 'sending' ? 'Sending…' : 'Send invoice email'}
                </button>
                {!canSend && (
                  <p className="mt-3 text-sm text-gray-500">
                    Enter a client email and amount to send.
                  </p>
                )}
              </div>
            </div>

            {/* Right: live inbox preview */}
            <div className="lg:sticky lg:top-6">
              <p className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-gray-500">
                Inbox preview
              </p>
              <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-100">
                <div className="border-b border-gray-100 px-5 py-4">
                  <p className="text-sm font-semibold text-brand-dark">{subject}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    From: D&amp;C Translations &lt;dandctranslations@gmail.com&gt;
                  </p>
                  <p className="text-xs text-gray-500">
                    To: {email.trim() || 'client@example.com'}
                  </p>
                </div>
                {previewHtml ? (
                  <iframe
                    title="Invoice email preview"
                    srcDoc={previewHtml}
                    className="h-[620px] w-full border-0"
                  />
                ) : (
                  <div className="flex h-[620px] items-center justify-center px-6 text-center text-sm text-gray-400">
                    Fill in the details to preview the email.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
