import { Eyebrow } from './ui';
import { useLang } from '../i18n';
import { content } from '../content';

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function WhyUs() {
  const { lang } = useLang();
  const t = content[lang].whyUs;

  return (
    <section id="why-us" className="bg-white py-20 lg:py-24">
      <div className="mx-auto grid max-w-container items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl">
            {t.heading}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">{t.body}</p>
          <ul className="mt-8 space-y-3">
            {t.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-gray-800">
                <CheckIcon />
                <span className="leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Image collage with NAATI certification badge overlay */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/whyus-1.png"
              alt={t.img1Alt}
              className="h-full w-full rounded-lg object-cover"
            />
            <img
              src="/images/hero.jpg"
              alt={t.img2Alt}
              className="mt-8 h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-lg bg-brand-dark p-4 text-white shadow-xl sm:left-1/2 sm:-translate-x-1/2">
            <img
              src="/images/naati-badge.png"
              alt="NAATI certified translator badge"
              className="h-12 w-auto rounded bg-white p-1"
            />
            <div>
              <p className="font-heading text-2xl font-extrabold leading-none text-brand-orange">
                {t.badge}
              </p>
              <p className="text-sm text-gray-300">{t.badgeSub}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
