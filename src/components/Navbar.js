import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoMark } from './Logo';
import { useLang } from '../i18n';
import { content } from '../content';

// Small EN | UZ segmented switch. Highlights the active language.
function LangToggle({ className = '' }) {
  const { lang, setLang } = useLang();
  const options = [
    { code: 'en', label: 'EN' },
    { code: 'uz', label: 'UZ' },
  ];
  return (
    <div
      className={`inline-flex overflow-hidden rounded-sm border border-white/25 ${className}`}
      role="group"
      aria-label="Language"
    >
      {options.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLang(o.code)}
          aria-pressed={lang === o.code}
          className={`px-2.5 py-1 font-heading text-xs font-bold tracking-wide transition-colors ${
            lang === o.code
              ? 'bg-brand-blue text-white'
              : 'text-gray-200 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// `variant` = "landing" shows the section-scroll anchor links.
// On the quote page the anchors don't exist, so we route home first.
export default function Navbar({ variant = 'landing' }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = content[lang].nav;

  const handleAnchor = (e, href) => {
    setOpen(false);
    if (variant !== 'landing') {
      e.preventDefault();
      navigate('/' + href); // e.g. /#services — lands on home then scrolls
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur supports-[backdrop-filter]:bg-brand-dark/80">
      <div className="mx-auto flex h-20 max-w-container items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-white">
          <LogoMark className="h-9 w-9" onDark />
          <span className="font-heading text-xl font-extrabold tracking-tight">
            D&amp;C Translations
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 lg:flex">
          {t.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchor(e, l.href)}
              className="font-heading text-[15px] font-semibold text-gray-200 transition-colors hover:text-brand-blue"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LangToggle />
          <Link
            to="/quote"
            className="inline-flex items-center rounded-sm bg-white px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide text-brand-dark transition-colors hover:bg-brand-tint"
          >
            {t.quote}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <LangToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-brand-dark lg:hidden">
          <nav className="mx-auto flex max-w-container flex-col px-5 py-4 sm:px-8">
            {t.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleAnchor(e, l.href)}
                className="border-b border-white/5 py-3 font-heading font-semibold text-gray-200 hover:text-brand-blue"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/quote"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-sm bg-brand-blue px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide text-white"
            >
              {t.quote}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
