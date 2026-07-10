import { Link } from 'react-router-dom';
import { Eyebrow, BoltIcon } from './ui';

const services = [
  {
    title: 'Certified Document Translations',
    img: 'https://picsum.photos/seed/dandc-certified/600/400',
    desc: 'Official translations for immigration, education, legal, and other documents.',
    bullets: [
      'Birth & Marriage Certificates',
      'Academic Transcripts & Diplomas',
      'Driver Licences',
      'Passports & Identity Documents',
    ],
  },
  {
    title: 'Regular Translations',
    img: 'https://picsum.photos/seed/dandc-regular/600/400',
    desc: 'Translations to and from English, Uzbek, and Russian.',
    bullets: ['Plain text', 'Commercial text', 'Educational assignments'],
  },
  {
    title: 'Interpreting',
    img: 'https://picsum.photos/seed/dandc-interpret/600/400',
    desc: 'Interpreting to and from Uzbek, English, and Russian.',
    bullets: [
      'Over the phone',
      'Zoom, Telegram & Skype calls',
      'On site (Brisbane & Tashkent)',
    ],
  },
  {
    title: 'Editing & Proofreading',
    img: 'https://picsum.photos/seed/dandc-editing/600/400',
    desc: 'Polishing your work so it reads clearly and correctly.',
    bullets: ['Assignments', 'Final papers', 'Diploma work', 'Homework help'],
  },
];

function ServiceCard({ service }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-gray-100 transition-shadow hover:shadow-xl">
      <div className="relative h-44 overflow-hidden">
        <img
          src={service.img}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-brand-orange/10 text-brand-orange">
          <BoltIcon className="h-5 w-5" />
        </span>
        <h3 className="font-heading text-xl font-bold text-brand-dark">
          {service.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{service.desc}</p>
        <ul className="mt-4 space-y-1.5">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
              <BoltIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange" />
              {b}
            </li>
          ))}
        </ul>
        <Link
          to="/quote"
          className="mt-6 inline-flex items-center gap-1 font-heading text-sm font-bold uppercase tracking-wide text-brand-orange transition-colors hover:text-brand-orangeDark"
        >
          Request a Quote &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="bg-brand-cream py-20 lg:py-24">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Our Services</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-extrabold text-brand-dark sm:text-5xl">
            Translation &amp; Interpreting Services
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            From certified documents to live interpreting, I provide reliable
            language support across Uzbek, English, and Russian.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
