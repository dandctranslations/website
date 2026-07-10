import { Eyebrow, LinkButton } from './ui';

function InfoRow({ icon, label, value, href }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-orange/10 text-brand-orange">
        {icon}
      </span>
      <div>
        <p className="font-heading text-sm font-bold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        {href ? (
          <a href={href} className="text-lg font-semibold text-brand-dark hover:text-brand-orange">
            {value}
          </a>
        ) : (
          <p className="text-lg font-semibold text-brand-dark">{value}</p>
        )}
      </div>
    </div>
  );
}

const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const PhoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);
const PinIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function Contact() {
  return (
    <section id="contact" className="bg-brand-dark py-20 lg:py-24">
      <div className="mx-auto grid max-w-container items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <Eyebrow>Contact Us</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-extrabold text-white sm:text-5xl">
            Get a Free Quote
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-300">
            Reach out with your documents or questions and I&apos;ll get back to
            you with a free, no-obligation quote.
          </p>
          <div className="mt-8">
            <LinkButton to="/quote" variant="primary">
              Upload &amp; Get a Quote
            </LinkButton>
          </div>
        </div>

        <div className="space-y-7 rounded-xl bg-white p-8 shadow-2xl">
          <InfoRow
            icon={MailIcon}
            label="Email"
            value="bigchungus@ligma.com"
            href="mailto:bigchungus@ligma.com"
          />
          <InfoRow
            icon={PhoneIcon}
            label="Australian Phone"
            value="+61 494 003 881"
            href="tel:+61494003881"
          />
          <InfoRow
            icon={PhoneIcon}
            label="Uzbek Phone"
            value="+998 50 576 79 06"
            href="tel:+998505767906"
          />
          <InfoRow
            icon={PinIcon}
            label="Based In"
            value="Brisbane, Australia & Tashkent, Uzbekistan"
          />
        </div>
      </div>
    </section>
  );
}
