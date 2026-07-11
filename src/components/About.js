import { Eyebrow } from './ui';
import { useLang } from '../i18n';
import { content } from '../content';

export default function About() {
  const { lang } = useLang();
  const t = content[lang].about;

  return (
    <section id="about" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-heading text-4xl font-extrabold text-brand-dark sm:text-5xl">
          {t.heading}
        </h2>
        {t.body.map((p, i) => (
          <p
            key={i}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600"
          >
            {p.lead && (
              <span className="font-semibold text-brand-dark">{p.lead}</span>
            )}
            {p.text}
          </p>
        ))}
      </div>
    </section>
  );
}
