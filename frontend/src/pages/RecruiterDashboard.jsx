import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Briefcase,
  PlusCircle,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Check,
  Building,
  MapPin,
  DollarSign
} from 'lucide-react';

export default function RecruiterDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [postedJobs, setPostedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Job Modal State (Create / Edit)
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    experience: '0-2 years',
    status: 'OPEN',
  });
  const [savingJob, setSavingJob] = useState(false);
  const [jobFormError, setJobFormError] = useState('');

  // Applicant Review Drawer/Modal State
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Fetch posted jobs
  const fetchRecruiterJobs = async () => {
    if (!user?.userId) return;
    setLoadingJobs(true);
    try {
      const response = await api.get(`/jobs/recruiter/${user.userId}`);
      setPostedJobs(response.data);
    } catch (err) {
      console.error('Error fetching recruiter jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, [user?.userId]);

  // Open Create Job Modal
  const handleOpenCreateModal = () => {
    setEditingJobId(null);
    setJobForm({
      title: '',
      description: '',
      location: '',
      salary: '',
      experience: '0-2 years',
      status: 'OPEN',
    });
    setJobFormError('');
    setJobModalOpen(true);
  };

  // Open Edit Job Modal
  const handleOpenEditModal = (job) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary || '',
      experience: job.experience || '0-2 years',
      status: job.status || 'OPEN',
    });
    setJobFormError('');
    setJobModalOpen(true);
  };

  // Handle Create or Update Job
  const handleSaveJob = async (e) => {
    e.preventDefault();
    setSavingJob(true);
    setJobFormError('');

    try {
      const payload = {
        title: jobForm.title,
        description: jobForm.description,
        location: jobForm.location,
        salary: jobForm.salary ? parseFloat(jobForm.salary) : null,
        experience: jobForm.experience,
        status: jobForm.status,
        recruiterId: user.userId,
      };

      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, payload);
      } else {
        await api.post('/jobs', payload);
      }

      setJobModalOpen(false);
      fetchRecruiterJobs();
    } catch (err) {
      setJobFormError(err.response?.data?.message || 'Failed to save job details');
    } finally {
      setSavingJob(false);
    }
  };

  // Handle Delete Job
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job and all its applications?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        fetchRecruiterJobs();
        if (selectedJobForApplicants?.id === jobId) {
          setSelectedJobForApplicants(null);
        }
      } catch (err) {
        alert('Failed to delete job: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Open Applicants Drawer
  const handleViewApplicants = async (job) => {
    setSelectedJobForApplicants(job);
    setLoadingApplicants(true);
    try {
      const response = await api.get(`/applications/job/${job.id}`);
      setApplicants(response.data);
    } catch (err) {
      console.error('Error fetching job applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  // Update applicant status
  const handleUpdateApplicantStatus = async (applicationId, newStatus) => {
    setUpdatingStatusId(applicationId);
    try {
      const response = await api.put(`/applications/${applicationId}/status`, {
        status: newStatus,
      });

      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? response.data : app))
      );
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SHORTLISTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            {t('status.SHORTLISTED')}
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Award className="w-3 h-3 text-emerald-600" />
            {t('status.ACCEPTED')}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            {t('status.REJECTED')}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            {t('status.PENDING')}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('nav.recruiterDashboard')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your posted jobs, monitor candidate submissions, and update hiring statuses.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('nav.postJob')}</span>
        </button>
      </div>

      {/* Posted Jobs Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          {t('dashboard.recruiterJobsTitle')} ({postedJobs.length})
        </h2>

        {loadingJobs ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500">Loading your job postings...</p>
          </div>
        ) : postedJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">{t('dashboard.noPostedJobs')}</h3>
            <p className="text-xs text-slate-500 mt-1">Click the button above to publish your first opening.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        job.status === 'OPEN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {job.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(job)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title={t('actions.edit')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={t('actions.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.location}</span>
                    <span className="mx-1">•</span>
                    <span>{job.salary ? `₹${job.salary.toLocaleString()}` : 'N/A'}</span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleViewApplicants(job)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>{t('actions.viewApplicants')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* APPLICANT REVIEW DRAWER / MODAL */}
      {selectedJobForApplicants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl border border-slate-100 flex flex-col relative overflow-hidden">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t('dashboard.applicantsFor')}: <span className="text-indigo-600">{selectedJobForApplicants.title}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review applicant profiles, inspect resumes, and update recruitment progress.
                </p>
              </div>
              <button
                onClick={() => setSelectedJobForApplicants(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body / Table */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingApplicants ? (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-slate-500">Loading applicants...</p>
                </div>
              ) : applicants.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No applicants yet</p>
                  <p className="text-xs text-slate-400">Applications submitted for this job will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                        <th className="py-3 px-4">{t('dashboard.applicantName')}</th>
                        <th className="py-3 px-4">{t('dashboard.applicantEmail')}</th>
                        <th className="py-3 px-4">{t('dashboard.resume')}</th>
                        <th className="py-3 px-4">{t('job.status')}</th>
                        <th className="py-3 px-4 text-right">{t('dashboard.updateStatus')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {applicants.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {app.seekerName}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{app.seekerEmail}</td>
                          <td className="py-3.5 px-4">
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
                          <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                disabled={updatingStatusId === app.id || app.status === 'SHORTLISTED'}
                                onClick={() => handleUpdateApplicantStatus(app.id, 'SHORTLISTED')}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 transition-colors"
                              >
                                Shortlist
                              </button>
                              <button
                                disabled={updatingStatusId === app.id || app.status === 'ACCEPTED'}
                                onClick={() => handleUpdateApplicantStatus(app.id, 'ACCEPTED')}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                disabled={updatingStatusId === app.id || app.status === 'REJECTED'}
                                onClick={() => handleUpdateApplicantStatus(app.id, 'REJECTED')}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-40 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POST / EDIT JOB MODAL */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 p-6 relative">
            <button
              onClick={() => setJobModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {editingJobId ? 'Edit Job Posting' : t('nav.postJob')}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter the job specifications and candidate requirements.
            </p>

            {jobFormError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{jobFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveJob} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Java Developer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune / Mumbai / Remote"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Annual Salary (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 600000"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1-3 years"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Job Description
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Outline responsibilities, required skills, and benefits..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {t('actions.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingJob}
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-colors disabled:opacity-60"
                >
                  {savingJob ? 'Saving...' : t('actions.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
