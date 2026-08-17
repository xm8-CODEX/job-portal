import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, Lock, Mail, UserCheck, AlertCircle, ArrowRight, Check } from 'lucide-react';

export default function LoginRegister() {
  const { t } = useTranslation();
  const { login, register, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterInitial = location.pathname === '/register';
  const [isRegister, setIsRegister] = useState(isRegisterInitial);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SEEKER',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      if (role === 'RECRUITER') navigate('/recruiter');
      else if (role === 'ADMIN') navigate('/admin');
      else navigate('/seeker');
    }
  }, [isAuthenticated, role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        if (!formData.name.trim()) {
          throw new Error('Please enter your full name');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        const user = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        );
        if (user.role === 'RECRUITER') navigate('/recruiter');
        else if (user.role === 'ADMIN') navigate('/admin');
        else navigate('/seeker');
      } else {
        const user = await login(formData.email, formData.password);
        if (user.role === 'RECRUITER') navigate('/recruiter');
        else if (user.role === 'ADMIN') navigate('/admin');
        else navigate('/seeker');
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email ||
        err.response?.data?.errors?.password ||
        err.message ||
        'Authentication failed. Please check your credentials.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-4">
            <Briefcase className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isRegister ? t('auth.registerTitle') : t('auth.loginTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isRegister ? t('auth.registerSubtitle') : t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/70 rounded-2xl border border-slate-200/80 sm:px-10">
          {/* Mode Switch Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                !isRegister
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('nav.login')}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                isRegister
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('nav.register')}
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field (Register only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('auth.fullName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            {/* Role Selector (Register only) */}
            {isRegister && (
              <div className="pt-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  {t('auth.selectRole')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'SEEKER' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      formData.role === 'SEEKER'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-900">{t('roles.SEEKER')}</span>
                      {formData.role === 'SEEKER' && (
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Apply to jobs & track status
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      formData.role === 'RECRUITER'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-900">{t('roles.RECRUITER')}</span>
                      {formData.role === 'RECRUITER' && (
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Post jobs & hire talent
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{isRegister ? t('auth.registerButton') : t('auth.loginButton')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch Prompt */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {isRegister ? (
              <span>
                {t('auth.alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                  }}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  {t('nav.login')}
                </button>
              </span>
            ) : (
              <span>
                {t('auth.dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                  }}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  {t('nav.register')}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
