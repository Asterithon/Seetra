import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark-bg/80 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors">
              Seetra
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') ? 'bg-dark-surface text-white' : 'text-slate-300 hover:bg-dark-surface hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                to="/sandbox"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/sandbox') ? 'bg-dark-surface text-primary' : 'text-slate-300 hover:bg-dark-surface hover:text-primary'
                }`}
              >
                Sandbox
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about') ? 'bg-dark-surface text-white' : 'text-slate-300 hover:bg-dark-surface hover:text-white'
                }`}
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
