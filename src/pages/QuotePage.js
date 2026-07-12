import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BoltIcon, Field, inputClasses } from '../components/ui';
import { useLang } from '../i18n';
import { content } from '../content';

// Keep total uploads under Gmail's 25MB receive limit (allowing for encoding).
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function QuotePage() {
  const { lang } = useLang();
  const t = content[lang].quote;
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(lang === 'uz' ? 'UZ' : 'AU');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const tooLarge = totalBytes > MAX_TOTAL_BYTES;

  // Default the phone country code to where the visitor actually is (IP-based),
  // falling back to the language-derived guess set above.
  useEffect(() => {
    let active = true;
    fetch('https://ipwho.is/?fields=country_code')
      .then((r) => r.json())
      .then((d) => {
        if (active && d && d.country_code) setCountry(d.country_code);
      })
      .catch(() => {
        /* geolocation unavailable — keep the language-based default */
      });
    return () => {
      active = false;
    };
  }, []);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList);
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => f.name + f.size));
      const merged = [...prev];
      incoming.forEach((f) => {
        if (!seen.has(f.name + f.size)) merged.push(f);
      });
      return merged;
    });
  };

  const removeFile = (idx) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tooLarge || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('phone', phone || '');
      fd.set('lang', lang);
      files.forEach((f) => fd.append('files', f, f.name));

      const res = await fetch('/api/submit-quote', { method: 'POST', body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t.submitError);
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || t.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar variant="quote" />

      {/* Header band */}
      <section className="bg-brand-dark py-14 text-center">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-brand-blue">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-white sm:text-5xl">
            {t.heading}
          </h1>
          <p className="mt-4 text-lg text-gray-300">{t.intro}</p>
        </div>
      </section>

      <main className="flex-1 bg-brand-tint py-14">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {submitted ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-lg">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h2 className="mt-6 font-heading text-3xl font-extrabold text-brand-dark">
                {t.successHeading}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-gray-600">
                {t.successBodyA}
                {files.length > 0 ? `${files.length} ` : ''}
                {files.length === 1 ? t.successBodyDocOne : t.successBodyDocMany}
                {t.successBodyB}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-sm bg-brand-dark px-7 py-3 font-heading text-sm font-bold uppercase tracking-wide text-white hover:bg-black"
                >
                  {t.backToHome}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFiles([]);
                    setPhone('');
                    setError('');
                  }}
                  className="inline-flex items-center rounded-sm border border-gray-300 px-7 py-3 font-heading text-sm font-bold uppercase tracking-wide text-brand-dark hover:bg-gray-50"
                >
                  {t.submitAnother}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-8 rounded-xl bg-white p-6 shadow-lg sm:p-9 lg:grid-cols-2"
            >
              {/* Upload column */}
              <div className="lg:col-span-2">
                <h2 className="font-heading text-xl font-bold text-brand-dark">
                  {t.documents}
                </h2>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
                    dragging
                      ? 'border-brand-blue bg-brand-blue/5'
                      : 'border-gray-300 hover:border-brand-blue hover:bg-brand-tint/50'
                  }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
                    </svg>
                  </span>
                  <p className="mt-4 font-semibold text-brand-dark">
                    {t.dropLead}
                    <span className="text-brand-blue underline">{t.browse}</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{t.dropHint}</p>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </div>

                {files.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {files.map((f, i) => (
                      <li
                        key={f.name + f.size + i}
                        className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <BoltIcon className="h-4 w-4 shrink-0 text-brand-blue" />
                          <span className="truncate text-sm font-medium text-brand-dark">
                            {f.name}
                          </span>
                          <span className="shrink-0 text-xs text-gray-400">
                            {formatSize(f.size)}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          aria-label={`${t.removeFile} ${f.name}`}
                          className="ml-3 shrink-0 text-gray-400 hover:text-brand-blue"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {tooLarge && (
                  <p className="mt-3 rounded-md bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                    {t.tooLarge} ({formatSize(totalBytes)})
                  </p>
                )}
              </div>

              {/* Details column */}
              <Field label={t.name} htmlFor="name">
                <input id="name" name="name" type="text" required placeholder={t.namePlaceholder} className={inputClasses} />
              </Field>
              <Field label={t.email} htmlFor="email">
                <input id="email" name="email" type="email" required placeholder={t.emailPlaceholder} className={inputClasses} />
              </Field>
              <Field label={t.phone} htmlFor="phone">
                <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 transition-colors focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20">
                  <PhoneInput
                    id="phone"
                    key={country}
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry={country}
                    value={phone}
                    onChange={(v) => setPhone(v || '')}
                    placeholder={t.phonePlaceholder}
                    numberInputProps={{
                      className: 'w-full bg-transparent px-1 py-2.5 text-gray-900 outline-none',
                    }}
                  />
                </div>
              </Field>
              <Field label={t.serviceType} htmlFor="service">
                <select id="service" name="service" className={inputClasses} defaultValue="">
                  <option value="" disabled>
                    {t.selectService}
                  </option>
                  {t.serviceTypes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.from} htmlFor="from">
                <select id="from" name="from" className={inputClasses} defaultValue="">
                  <option value="" disabled>
                    {t.sourceLang}
                  </option>
                  {t.languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.to} htmlFor="to">
                <select id="to" name="to" className={inputClasses} defaultValue="">
                  <option value="" disabled>
                    {t.targetLang}
                  </option>
                  {t.languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="lg:col-span-2">
                <Field label={t.notes} htmlFor="notes">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder={t.notesPlaceholder}
                    className={inputClasses}
                  />
                </Field>
              </div>

              <div className="lg:col-span-2">
                {error && (
                  <p className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                    {error}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={tooLarge || submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-blue px-9 py-4 font-heading text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-blueDark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <BoltIcon className="h-5 w-5" /> {submitting ? t.submitting : t.submit}
                  </button>
                  <Link
                    to="/"
                    className="font-heading text-sm font-bold uppercase tracking-wide text-gray-500 hover:text-brand-blue"
                  >
                    {t.backHome}
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
