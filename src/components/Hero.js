import { LinkButton, AnchorButton, BoltIcon } from './ui';

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-brand-dark">
      {/* subtle background image wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url(https://picsum.photos/seed/dandc-hero-bg/1600/900)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-container items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
            NAATI Certified Translator &amp; Interpreter
          </p>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Uzbek <span className="text-brand-orange">&harr;</span> English
            <br className="hidden sm:block" /> Translation &amp; Interpreting
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
            Whether you need a birth certificate translated for a visa
            application, an interpreter for an appointment, or help
            communicating across languages, I provide clear, reliable support
            from start to finish.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <LinkButton to="/quote" variant="primary">
              <BoltIcon className="h-4 w-4" /> Request a Quote
            </LinkButton>
            <AnchorButton href="tel:+61494003881" variant="outline">
              +61 494 003 881
            </AnchorButton>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-tl-[6rem] rounded-br-[6rem] shadow-2xl">
            <img
              src="https://picsum.photos/seed/dandc-hero/800/720"
              alt="Professional translator at work"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
