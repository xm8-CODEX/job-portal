import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Shield,
  Users,
  Briefcase,
  FileCheck,
  Trash2,
  AlertCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user: currentAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [alertMsg, setAlertMsg] = useState({ text: '', type: '' });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (userId === currentAdmin?.userId) {
      alert('You cannot delete your own active administrator account.');
      return;
    }

    if (window.confirm(t('admin.deleteConfirm'))) {
      setDeleteLoadingId(userId);
      try {
        await api.delete(`/admin/users/${userId}`);
        setAlertMsg({ text: 'User account removed successfully.', type: 'success' });
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        // Refresh stats
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);
      } catch (err) {
        setAlertMsg({
          text: err.response?.data?.message || 'Failed to remove user account',
          type: 'error',
        });
      } finally {
        setDeleteLoadingId(null);
        setTimeout(() => setAlertMsg({ text: '', type: '' }), 4000);
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('admin.title')}</h1>
            <p className="text-sm text-slate-500">
              Overview of portal activity, account management, and database records.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Alert Banner */}
      {alertMsg.text && (
        <div
          className={`mt-6 p-4 rounded-xl flex items-center gap-2.5 text-sm ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {alertMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">{t('admin.stats')}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats ? stats.totalUsers : '-'}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{t('admin.totalUsers')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats ? stats.totalSeekers : '-'}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{t('admin.totalSeekers')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats ? stats.totalRecruiters : '-'}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{t('admin.totalRecruiters')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats ? stats.totalJobs : '-'}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{t('admin.totalJobs')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats ? stats.openJobs : '-'}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{t('admin.openJobs')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats ? stats.totalApplications : '-'}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{t('admin.totalApplications')}</div>
          </div>
        </div>
      </div>

      {/* USERS MANAGEMENT TABLE */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h2 className="text-lg font-bold text-slate-900">{t('admin.usersList')}</h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500">Loading user records...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="py-3.5 px-6">User ID</th>
                    <th className="py-3.5 px-6">{t('auth.fullName')}</th>
                    <th className="py-3.5 px-6">{t('auth.email')}</th>
                    <th className="py-3.5 px-6">{t('nav.role')}</th>
                    <th className="py-3.5 px-6">Registered On</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 text-xs text-slate-500 font-mono">#{u.id}</td>
                      <td className="py-4 px-6 font-semibold text-slate-900">{u.name}</td>
                      <td className="py-4 px-6 text-xs text-slate-600">{u.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === 'ADMIN'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : u.role === 'RECRUITER'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {t(`roles.${u.role}`)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Recent'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u.id !== currentAdmin?.userId && (
                          <button
                            disabled={deleteLoadingId === u.id}
                            onClick={() => handleDeleteUser(u.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors disabled:opacity-50"
                            title={t('admin.deleteUser')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t('actions.delete')}</span>
                          </button>
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
    </div>
  );
}
