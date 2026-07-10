import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BoltIcon } from './ui';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
];

// `variant` = "landing" shows the section-scroll anchor links.
// On the quote page the anchors don't exist, so we route home first.
export default function Navbar({ variant = 'landing' }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-orange">
            <BoltIcon className="h-5 w-5 text-white" />
          </span>
          <span className="font-heading text-xl font-extrabold tracking-tight">
            D&amp;C Translations
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchor(e, l.href)}
              className="font-heading text-[15px] font-semibold text-gray-200 transition-colors hover:text-brand-orange"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/quote"
            className="inline-flex items-center rounded-sm bg-white px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide text-brand-dark transition-colors hover:bg-brand-cream"
          >
            Get Free Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
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

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-brand-dark lg:hidden">
          <nav className="mx-auto flex max-w-container flex-col px-5 py-4 sm:px-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleAnchor(e, l.href)}
                className="border-b border-white/5 py-3 font-heading font-semibold text-gray-200 hover:text-brand-orange"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/quote"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-sm bg-brand-orange px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide text-white"
            >
              Get Free Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
