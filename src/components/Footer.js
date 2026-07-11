import { Link } from 'react-router-dom';
import { BoltIcon } from './ui';
import { useLang } from '../i18n';
import { content } from '../content';

export default function Footer() {
  const { lang } = useLang();
  const t = content[lang].footer;

  return (
    <footer className="border-t border-white/10 bg-brand-darker py-8">
      <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-orange">
            <BoltIcon className="h-4 w-4 text-white" />
          </span>
          <span className="font-heading text-lg font-extrabold">
            D&amp;C Translations
          </span>
        </Link>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} D&amp;C Translations. {t.rights}
        </p>
      </div>
    </footer>
  );
}
