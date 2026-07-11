import { Link } from 'react-router-dom';

// Small orange uppercase label that sits above section headings.
export function Eyebrow({ children, className = '' }) {
  return (
    <p
      className={`font-heading text-sm font-bold uppercase tracking-[0.2em] text-brand-orange ${className}`}
    >
      {children}
    </p>
  );
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 font-heading font-bold uppercase tracking-wide transition-colors duration-200 rounded-sm px-7 py-3.5 text-sm';

const variants = {
  primary: 'bg-brand-orange text-white hover:bg-brand-orangeDark',
  white: 'bg-white text-brand-dark hover:bg-brand-cream',
  outline:
    'border border-white/40 text-white hover:bg-white hover:text-brand-dark',
  dark: 'bg-brand-dark text-white hover:bg-black',
};

// Internal route button (react-router link styled as a button).
export function LinkButton({ to = '/quote', variant = 'primary', className = '', children }) {
  return (
    <Link to={to} className={`${buttonBase} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

// Plain anchor styled as a button (used for tel: links and form submit-like anchors).
export function AnchorButton({ href, variant = 'outline', className = '', children }) {
  return (
    <a href={href} className={`${buttonBase} ${variants[variant]} ${className}`}>
      {children}
    </a>
  );
}

// Shared input styling for text inputs, selects, and textareas across forms.
export const inputClasses =
  'w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20';

// Labelled form field wrapper used by the quote and payment-builder forms.
export function Field({ label, children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block font-heading text-sm font-bold uppercase tracking-wide text-gray-600">
        {label}
      </span>
      {children}
    </label>
  );
}

// A simple lightning/quote glyph used in card icons and buttons.
export function BoltIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l1-8Z" />
    </svg>
  );
}
