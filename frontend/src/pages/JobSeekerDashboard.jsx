import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  Filter,
  RefreshCw,
  Send,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function JobSeekerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'applications'
  
  // Job Search State
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');

  // Seeker Applications State
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Apply Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Fetch Jobs
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const params = {};
      if (searchTitle.trim()) params.title = searchTitle.trim();
      if (searchLocation.trim()) params.location = searchLocation.trim();
      if (minSalary) params.minSalary = minSalary;

      const response = await api.get('/jobs', { params });
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Fetch Seeker's Applications
  const fetchMyApplications = async () => {
    if (!user?.userId) return;
    setLoadingApps(true);
    try {
      const response = await api.get(`/applications/seeker/${user.userId}`);
      setMyApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    if (user?.userId) {
      fetchMyApplications();
    }
  }, [user?.userId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearchTitle('');
    setSearchLocation('');
    setMinSalary('');
    api.get('/jobs').then((res) => setJobs(res.data));
  };

  const handleOpenApplyModal = (job) => {
    setSelectedJob(job);
    setResumeUrl('');
    setModalError('');
    setModalSuccess('');
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeUrl.trim()) {
      setModalError('Please provide a valid resume link (Google Drive, LinkedIn, or Portfolio).');
      return;
    }

    setSubmittingApp(true);
    setModalError('');
    try {
      await api.post('/applications/apply', {
        jobId: selectedJob.id,
        seekerId: user.userId,
        resumeUrl: resumeUrl.trim(),
      });
      setModalSuccess(t('applyModal.success'));
      fetchMyApplications();
      setTimeout(() => {
        setSelectedJob(null);
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || t('applyModal.alreadyApplied');
      setModalError(msg);
    } finally {
      setSubmittingApp(false);
    }
  };

  const isJobApplied = (jobId) => {
    return myApplications.some((app) => app.jobId === jobId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SHORTLISTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            {t('status.SHORTLISTED')}
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            {t('status.ACCEPTED')}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {t('status.REJECTED')}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {t('status.PENDING')}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('nav.welcome')}, <span className="text-indigo-600">{user?.name || 'Job Seeker'}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore verified opportunities across regions and manage your applications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'browse'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{t('nav.jobs')}</span>
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-600">
              {jobs.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('applications');
              fetchMyApplications();
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'applications'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('nav.myApplications')}</span>
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-200 text-slate-700">
              {myApplications.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: BROWSE JOBS */}
      {activeTab === 'browse' && (
        <div className="mt-8 space-y-6">
          {/* Filter Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={t('hero.locationPlaceholder')}
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                placeholder={t('filters.minSalary')}
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-sm"
              >
                <Filter className="w-4 h-4" />
                <span>{t('filters.apply')}</span>
              </button>
              
              <button
                type="button"
                onClick={handleClearFilters}
                className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                title={t('filters.clear')}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Job List Grid */}
          {loadingJobs ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-slate-500">Loading open jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">{t('job.noJobs')}</h3>
              <p className="text-xs text-slate-500 mt-1">Try relaxing your filter parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => {
                const applied = isJobApplied(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Meta */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">
                          {job.experience || 'Entry / Mid'}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600">
                          {t('job.open')}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t('job.postedBy')}: <span className="font-medium text-slate-700">{job.recruiterName}</span>
                      </p>

                      <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{job.salary ? `₹ ${job.salary.toLocaleString()}` : 'Competitive'}</span>
                        </div>
                      </div>

                      {applied ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 text-slate-500 cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>{t('job.applied')}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenApplyModal(job)}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{t('job.applyNow')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="mt-8">
          {loadingApps ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-slate-500">Loading your applications...</p>
            </div>
          ) : myApplications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">{t('dashboard.noApplications')}</h3>
              <p className="text-xs text-slate-500 mt-1">Browse available jobs and apply to track them here.</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl"
              >
                {t('nav.jobs')}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="py-3.5 px-6">Job Title</th>
                      <th className="py-3.5 px-6">{t('job.status')}</th>
                      <th className="py-3.5 px-6">{t('dashboard.appliedDate')}</th>
                      <th className="py-3.5 px-6">{t('dashboard.resume')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {myApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          {app.jobTitle}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {app.appliedDate
                            ? new Date(app.appliedDate).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Recently'}
                        </td>
                        <td className="py-4 px-6">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>{t('dashboard.viewResume')}</span>
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* APPLICATION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 p-6 relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t('applyModal.title', { jobTitle: selectedJob.title })}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedJob.location} • {t('job.postedBy')}: {selectedJob.recruiterName}
              </p>
            </div>

            {modalSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-700">{modalSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {modalError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('applyModal.resumeLabel')}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder={t('applyModal.resumePlaceholder')}
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Provide a public Google Drive / LinkedIn profile link.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    {t('actions.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApp}
                    className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-colors disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {submittingApp ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('applyModal.submitApplication')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
