import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const location = useLocation();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setIsDropdownOpen(false);
  };

  const getLanguageLabel = (lang) => {
    if (lang === 'en') return '🇬🇧 EN';
    if (lang === 'id') return '🇮🇩 ID';
    return lang.toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark-bg/80 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-10">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors">
                Seetra
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') ? 'bg-dark-surface text-white' : 'text-slate-300 hover:bg-dark-surface hover:text-white'
                  }`}
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/sandbox"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/sandbox') ? 'bg-dark-surface text-primary' : 'text-slate-300 hover:bg-dark-surface hover:text-primary'
                  }`}
                >
                  {t('nav.sandbox')}
                </Link>
                <Link
                  to="/about"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/about') ? 'bg-dark-surface text-white' : 'text-slate-300 hover:bg-dark-surface hover:text-white'
                  }`}
                >
                  {t('nav.about')}
                </Link>
              </div>
            </div>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 px-3 py-2 border border-dark-border bg-dark-surface/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-dark-surface hover:text-white transition-colors outline-none"
            >
              <span>{getLanguageLabel(currentLanguage)}</span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-lg bg-dark-surface border border-dark-border shadow-xl z-50 overflow-hidden py-1 animate-fade-in">
                <button
                  onClick={() => selectLanguage('en')}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                    currentLanguage === 'en' ? 'bg-primary/20 text-primary font-medium' : 'text-slate-300 hover:bg-dark-bg hover:text-white'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
                <button
                  onClick={() => selectLanguage('id')}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                    currentLanguage === 'id' ? 'bg-primary/20 text-primary font-medium' : 'text-slate-300 hover:bg-dark-bg hover:text-white'
                  }`}
                >
                  <span>🇮🇩</span>
                  <span>Indonesia</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
