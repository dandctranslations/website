import { Eyebrow } from './ui';

const points = [
  'NAATI Certified in Uzbek and English translations',
  'Accurate and culturally sensitive translations',
  'Fast turnaround times',
  'Confidential handling of all documents',
  'Personal service from an experienced language professional',
];

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
  return (
    <section id="why-us" className="bg-white py-20 lg:py-24">
      <div className="mx-auto grid max-w-container items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <Eyebrow>Why Choose Us</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl">
            Language expertise backed by professional experience
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            We specialise in Uzbek, English, and Russian, allowing us to deliver
            translations that are not only linguistically accurate but also
            culturally appropriate. Whether you need a certified document
            translated, an interpreter for an important meeting, or assistance
            with academic and business communication, we provide reliable,
            confidential, and personalised service.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-gray-800">
                <CheckIcon />
                <span className="leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Image collage with stat badge overlay */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://picsum.photos/seed/dandc-why1/500/640"
              alt="Translator reviewing documents"
              className="h-full w-full rounded-lg object-cover"
            />
            <img
              src="https://picsum.photos/seed/dandc-why2/500/640"
              alt="Interpreting session"
              className="mt-8 h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 rounded-lg bg-brand-dark p-5 text-white shadow-xl sm:left-1/2 sm:-translate-x-1/2">
            <p className="font-heading text-3xl font-extrabold text-brand-orange">
              NAATI
            </p>
            <p className="text-sm text-gray-300">Certified professional</p>
          </div>
        </div>
      </div>
    </section>
  );
}
