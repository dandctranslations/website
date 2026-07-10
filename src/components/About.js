import { Eyebrow } from './ui';

export default function About() {
  return (
    <section id="about" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Eyebrow>What We Offer</Eyebrow>
        <h2 className="mt-4 font-heading text-4xl font-extrabold text-brand-dark sm:text-5xl">
          Comprehensive Language Services
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          <span className="font-semibold text-brand-dark">NAATI Certified.</span>{' '}
          Professional translations and interpreting support for personal,
          legal, academic, medical, business, and community needs.
        </p>
      </div>
    </section>
  );
}
