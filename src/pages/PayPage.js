import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Eyebrow, BoltIcon } from '../components/ui';
import { ACCOUNTS } from '../paymentConfig';
import { useLang } from '../i18n';
import { content } from '../content';

// Format an amount + currency for display, falling back gracefully if the
// amount isn't a clean number.
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

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — client can still read the value */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-3 shrink-0 rounded-sm border border-gray-300 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wide text-brand-dark hover:border-brand-orange hover:text-brand-orange"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// One account detail row: label, value, and an optional copy button.
function DetailRow({ label, value, copy }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 py-3 last:border-0">
      <div className="min-w-0">
        <p className="font-heading text-xs font-bold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="truncate text-lg font-semibold text-brand-dark">{value}</p>
      </div>
      {copy && <CopyButton value={value} />}
    </div>
  );
}

function Invalid({ t }) {
  return (
    <div className="rounded-xl bg-white p-10 text-center shadow-lg">
      <h2 className="font-heading text-2xl font-extrabold text-brand-dark">
        {t.invalidHeading}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-gray-600">{t.invalidBody}</p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center rounded-sm bg-brand-dark px-7 py-3 font-heading text-sm font-bold uppercase tracking-wide text-white hover:bg-black"
        >
          {t.backToHome}
        </Link>
      </div>
    </div>
  );
}

export default function PayPage() {
  const { lang } = useLang();
  const t = content[lang].pay;
  const [params] = useSearchParams();
  const region = params.get('region');
  const amount = params.get('amount');
  const ref = params.get('ref');
  const client = params.get('client');
  const service = params.get('service');

  const account = region ? ACCOUNTS[region] : null;

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar variant="quote" />

      <section className="bg-brand-dark py-14 text-center">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-white sm:text-5xl">
            {account && amount ? formatAmount(amount, account.currency) : t.payment}
          </h1>
          {client && (
            <p className="mt-4 text-lg text-gray-300">
              {t.forClient} {client}
              {service ? ` — ${service}` : ''}
            </p>
          )}
        </div>
      </section>

      <main className="flex-1 bg-brand-cream py-14">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          {!account || !amount ? (
            <Invalid t={t} />
          ) : (
            <div className="rounded-xl bg-white p-6 shadow-lg sm:p-9">
              <Eyebrow>{t.bankTransfer} — {account.label}</Eyebrow>
              <h2 className="mt-2 font-heading text-2xl font-bold text-brand-dark">
                {t.transferHeading}
              </h2>

              <div className="mt-6">
                <DetailRow
                  label={t.amount}
                  value={formatAmount(amount, account.currency)}
                />
                {account.fields.map((f) => (
                  <DetailRow key={f.label} {...f} />
                ))}
                {ref && (
                  <DetailRow
                    label={t.referenceLabel}
                    value={ref}
                    copy
                  />
                )}
              </div>

              <div className="mt-8 flex items-start gap-3 rounded-lg bg-brand-orange/5 p-4">
                <BoltIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <p className="text-sm text-gray-700">{t.note}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
