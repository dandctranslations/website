import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BoltIcon } from '../components/ui';

const LANGUAGES = ['Uzbek', 'English', 'Russian'];
const SERVICE_TYPES = [
  'Certified translation',
  'Regular translation',
  'Interpreting',
  'Editing & proofreading',
];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Field({ label, children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block font-heading text-sm font-bold uppercase tracking-wide text-gray-600">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClasses =
  'w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20';

export default function QuotePage() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Interface only — no backend. Just show a confirmation.
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar variant="quote" />

      {/* Header band */}
      <section className="bg-brand-dark py-14 text-center">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
            Free, No-Obligation Quote
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-white sm:text-5xl">
            Get Your Free Quote
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Upload your document(s) and tell us what you need. We&apos;ll review
            them and email you a quote.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-brand-cream py-14">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {submitted ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-lg">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h2 className="mt-6 font-heading text-3xl font-extrabold text-brand-dark">
                Thanks! Your request has been received
              </h2>
              <p className="mx-auto mt-3 max-w-md text-gray-600">
                We&apos;ll review your {files.length > 0 ? `${files.length} ` : ''}
                document{files.length === 1 ? '' : 's'} and email a quote
                shortly.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-sm bg-brand-dark px-7 py-3 font-heading text-sm font-bold uppercase tracking-wide text-white hover:bg-black"
                >
                  Back to Home
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFiles([]);
                  }}
                  className="inline-flex items-center rounded-sm border border-gray-300 px-7 py-3 font-heading text-sm font-bold uppercase tracking-wide text-brand-dark hover:bg-gray-50"
                >
                  Submit Another
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
                  Your documents
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
                      ? 'border-brand-orange bg-brand-orange/5'
                      : 'border-gray-300 hover:border-brand-orange hover:bg-brand-cream/50'
                  }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
                    </svg>
                  </span>
                  <p className="mt-4 font-semibold text-brand-dark">
                    Drag &amp; drop files here, or{' '}
                    <span className="text-brand-orange underline">browse</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    PDF, Word, or image files — you can add several
                  </p>
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
                          <BoltIcon className="h-4 w-4 shrink-0 text-brand-orange" />
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
                          aria-label={`Remove ${f.name}`}
                          className="ml-3 shrink-0 text-gray-400 hover:text-brand-orange"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Details column */}
              <Field label="Full name" htmlFor="name">
                <input id="name" name="name" type="text" required placeholder="Jane Doe" className={inputClasses} />
              </Field>
              <Field label="Email" htmlFor="email">
                <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputClasses} />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <input id="phone" name="phone" type="tel" placeholder="+61 400 000 000" className={inputClasses} />
              </Field>
              <Field label="Service type" htmlFor="service">
                <select id="service" name="service" className={inputClasses} defaultValue="">
                  <option value="" disabled>
                    Select a service
                  </option>
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Translate from" htmlFor="from">
                <select id="from" name="from" className={inputClasses} defaultValue="">
                  <option value="" disabled>
                    Source language
                  </option>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Translate to" htmlFor="to">
                <select id="to" name="to" className={inputClasses} defaultValue="">
                  <option value="" disabled>
                    Target language
                  </option>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="lg:col-span-2">
                <Field label="Additional notes" htmlFor="notes">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Tell us about deadlines, certification requirements, or anything else."
                    className={inputClasses}
                  />
                </Field>
              </div>

              <div className="flex flex-wrap items-center gap-4 lg:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-orange px-9 py-4 font-heading text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-orangeDark"
                >
                  <BoltIcon className="h-5 w-5" /> Get a Quote
                </button>
                <Link
                  to="/"
                  className="font-heading text-sm font-bold uppercase tracking-wide text-gray-500 hover:text-brand-orange"
                >
                  &larr; Back to home
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
