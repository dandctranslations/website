import { LinkButton, AnchorButton, BoltIcon } from './ui';
import { useLang } from '../i18n';
import { content } from '../content';

export default function Hero() {
  const { lang } = useLang();
  const t = content[lang].hero;

  return (
    <section id="home" className="relative overflow-hidden bg-brand-dark">
      <div className="relative mx-auto grid max-w-container items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-brand-blue">
            {t.eyebrow}
          </p>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {t.titleA} <span className="text-brand-blue">&harr;</span> {t.titleB}
            <br className="hidden sm:block" /> {t.titleTail}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
            {t.body}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <LinkButton to="/quote" variant="primary">
              <BoltIcon className="h-4 w-4" /> {t.cta}
            </LinkButton>
            <AnchorButton href={t.phoneHref} variant="outline">
              {t.phone}
            </AnchorButton>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-tl-[6rem] rounded-br-[6rem] shadow-2xl">
            <img
              src="/images/hero.jpg"
              alt={t.imgAlt}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
