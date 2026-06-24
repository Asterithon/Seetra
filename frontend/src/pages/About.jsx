import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="backdrop-blur-xl bg-dark-surface/50 border border-dark-border rounded-2xl p-8 md:p-12 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary">
          {t('about.title')}
        </h1>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>
            {t('about.desc')}
          </p>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">{t('about.stack')}</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>{t('about.frontend')}</li>
              <li>{t('about.backend')}</li>
              <li>{t('about.architecture')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
