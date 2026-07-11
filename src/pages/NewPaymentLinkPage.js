import { useMemo, useState } from 'react';
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

export default function NewPaymentLinkPage() {
  const [client, setClient] = useState('');
  const [region, setRegion] = useState(REGIONS[0]?.code ?? '');
  const [amount, setAmount] = useState('');
  const [service, setService] = useState('');
  const [ref, setRef] = useState('');
  const [copied, setCopied] = useState(false);

  const effectiveRef = ref.trim() || suggestRef(client);

  const link = useMemo(() => {
    if (!region || !amount) return '';
    const q = new URLSearchParams();
    q.set('region', region);
    q.set('amount', amount);
    if (client.trim()) q.set('client', client.trim());
    if (service) q.set('service', service);
    if (effectiveRef) q.set('ref', effectiveRef);
    return `${window.location.origin}/pay?${q.toString()}`;
  }, [region, amount, client, service, effectiveRef]);

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the link is still selectable below */
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
            New Payment Link
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Fill in the quote details, then copy the link and email it to the client.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-brand-tint py-14">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
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
              {link ? (
                <>
                  <p className="font-heading text-xs font-bold uppercase tracking-wide text-gray-400">
                    Payment link
                  </p>
                  <p className="mt-1 break-all rounded-md bg-gray-50 p-3 text-sm text-brand-dark">
                    {link}
                  </p>
                  <button
                    type="button"
                    onClick={copy}
                    className="mt-4 inline-flex items-center gap-2 rounded-sm bg-brand-blue px-7 py-3 font-heading text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-blueDark"
                  >
                    <BoltIcon className="h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Enter an amount to generate the link.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
