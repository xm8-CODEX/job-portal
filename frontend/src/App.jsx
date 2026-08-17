import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginRegister from './pages/LoginRegister';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, ArrowRight, Briefcase, Globe2, ShieldCheck, Zap } from 'lucide-react';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'RECRUITER') return <Navigate to="/recruiter" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/seeker" replace />;
  }

  return children;
}

// Landing Home Page
function Home() {
  const { t } = useTranslation();
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 border-b border-slate-200/60 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold mb-6 border border-indigo-200/60 shadow-sm">
            <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>English • हिंदी • मराठी Multi-Language Support</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {t('hero.title')}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Quick Action Navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <span>{t('hero.searchButton')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <span>{t('nav.register')}</span>
              </Link>
            ) : role === 'RECRUITER' ? (
              <Link
                to="/recruiter"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <span>{t('nav.recruiterDashboard')}</span>
              </Link>
            ) : role === 'ADMIN' ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-amber-700 border border-amber-200 text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <span>{t('nav.adminDashboard')}</span>
              </Link>
            ) : (
              <Link
                to="/seeker"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <span>{t('nav.myApplications')}</span>
              </Link>
            )}
          </div>

          {/* Highlights */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">3 Regional Languages</h3>
                <p className="text-xs text-slate-500 mt-1">Instant UI translation in English, Hindi, and Marathi.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Real-Time Status</h3>
                <p className="text-xs text-slate-500 mt-1">Track shortlist, accept, and reject decisions live.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Role-Based Security</h3>
                <p className="text-xs text-slate-500 mt-1">JWT Bearer authentication and BCrypt password encryption.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <p>© 2026 Multi-Language Job Portal. Developed with Spring Boot 3, React, and i18next.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobSeekerDashboard />} />
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/register" element={<LoginRegister />} />

              {/* Seeker Routes */}
              <Route
                path="/seeker"
                element={
                  <ProtectedRoute allowedRoles={['SEEKER', 'ADMIN']}>
                    <JobSeekerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute allowedRoles={['SEEKER', 'ADMIN']}>
                    <JobSeekerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Routes */}
              <Route
                path="/recruiter"
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
