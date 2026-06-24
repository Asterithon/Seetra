import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center animate-fade-in relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="z-10 max-w-3xl space-y-8 animate-slide-up">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          {t('home.headline')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('home.headline.highlight')}</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300">
          {t('home.subtitle')}
        </p>
        <div className="pt-8">
          <Link
            to="/sandbox"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-hover shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300 transform hover:scale-105"
          >
            {t('home.cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
