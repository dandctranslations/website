import { useState } from 'react';
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
// notification email), sets an amount, and sends the customer a branded invoice
// email with the bank details. No public payment link is generated.
export default function InvoicePage() {
  const [params] = useSearchParams();
  const [client, setClient] = useState(params.get('client') || '');
  const [email, setEmail] = useState(params.get('email') || '');
  const [region, setRegion] = useState(REGIONS[0]?.code ?? '');
  const [amount, setAmount] = useState('');
  const [service, setService] = useState(params.get('service') || '');
  const [ref, setRef] = useState('');
  const [lang, setLang] = useState(params.get('lang') === 'uz' ? 'uz' : 'en');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const effectiveRef = ref.trim() || suggestRef(client);
  const canSend = email.trim() && region && amount !== '';

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
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          {status === 'sent' ? (
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
          ) : (
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
