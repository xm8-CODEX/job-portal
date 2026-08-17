import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Globe,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  PlusCircle,
  FileText,
  LayoutDashboard,
  Shield,
  ChevronDown
} from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिंदी (Hindi)', short: 'HI' },
  { code: 'mr', label: 'मराठी (Marathi)', short: 'MR' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const currentLang = languages.find((l) => l.code === (i18n.language || 'en').substring(0, 2)) || languages[0];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                JobPortal
              </span>
              <span className="text-[10px] font-medium text-indigo-600 -mt-1 tracking-wider uppercase">
                Multi-Language
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('nav.home')}
            </Link>

            <Link
              to="/jobs"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/jobs')
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('nav.jobs')}
            </Link>

            {/* Seeker Links */}
            {isAuthenticated && user?.role === 'SEEKER' && (
              <Link
                to="/my-applications"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/my-applications')
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                {t('nav.myApplications')}
              </Link>
            )}

            {/* Recruiter Links */}
            {isAuthenticated && (user?.role === 'RECRUITER' || user?.role === 'ADMIN') && (
              <>
                <Link
                  to="/post-job"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/post-job')
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  {t('nav.postJob')}
                </Link>

                <Link
                  to="/recruiter-dashboard"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/recruiter-dashboard')
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.recruiterDashboard')}
                </Link>
              </>
            )}

            {/* Admin Links */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin-dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin-dashboard')
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 font-semibold">{t('nav.adminDashboard')}</span>
              </Link>
            )}
          </div>

          {/* Right Action Area (Language Selector & Auth Controls) */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/70"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>{currentLang.short}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition-colors ${
                        currentLang.code === lang.code
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {currentLang.code === lang.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                      {t(`roles.${user?.role}`)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:shadow"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          
          {/* Mobile Language Selector */}
          <div className="pb-3 border-b border-slate-100">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Language / भाषा
            </label>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                    currentLang.code === lang.code
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lang.short} - {lang.code === 'en' ? 'Eng' : lang.code === 'hi' ? 'हिंदी' : 'मराठी'}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t('nav.home')}
            </Link>
            
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/jobs') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t('nav.jobs')}
            </Link>

            {isAuthenticated && user?.role === 'SEEKER' && (
              <Link
                to="/my-applications"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/my-applications') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t('nav.myApplications')}
              </Link>
            )}

            {isAuthenticated && (user?.role === 'RECRUITER' || user?.role === 'ADMIN') && (
              <>
                <Link
                  to="/post-job"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive('/post-job') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.postJob')}
                </Link>
                <Link
                  to="/recruiter-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive('/recruiter-dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.recruiterDashboard')}
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/admin-dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t('nav.adminDashboard')}
              </Link>
            )}
          </div>

          {/* Mobile Auth Area */}
          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-1">
                  <UserIcon className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
                    <div className="text-xs text-slate-500">{user?.email} ({t(`roles.${user?.role}`)})</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-medium text-white bg-indigo-600 rounded-lg"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
