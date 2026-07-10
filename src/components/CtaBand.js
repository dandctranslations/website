import { Eyebrow, LinkButton, BoltIcon } from './ui';

export default function CtaBand() {
  return (
    <section className="bg-brand-cream py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Eyebrow>Ready to Get Started?</Eyebrow>
        <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl">
          Get Your Free Quote Today
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
          Contact us for a free consultation and quote. We are here to help with
          all your translation needs.
        </p>
        <div className="mt-9 flex justify-center">
          <LinkButton to="/quote" variant="primary" className="px-9 py-4 text-base">
            <BoltIcon className="h-5 w-5" /> Get My Free Quote
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
