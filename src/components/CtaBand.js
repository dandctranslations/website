import { Eyebrow, LinkButton, BoltIcon } from './ui';
import { useLang } from '../i18n';
import { content } from '../content';

export default function CtaBand() {
  const { lang } = useLang();
  const t = content[lang].cta;

  return (
    <section className="bg-brand-cream py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl">
          {t.heading}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
          {t.body}
        </p>
        <div className="mt-9 flex justify-center">
          <LinkButton to="/quote" variant="primary" className="px-9 py-4 text-base">
            <BoltIcon className="h-5 w-5" /> {t.cta}
          </LinkButton>
        </div>

        {/* Australian immigration acceptance trust badge */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <img
            src="/images/immigration-guarantee.png"
            alt={t.guaranteeAlt}
            className="h-auto w-full max-w-md rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100"
          />
          <p className="max-w-md text-sm font-semibold text-gray-500">
            {t.guarantee}
          </p>
        </div>
      </div>
    </section>
  );
}
