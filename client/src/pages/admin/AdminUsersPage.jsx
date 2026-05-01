import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Ban, ChevronDown, Users, UserCog } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (roleFilter) q.set('role', roleFilter);
      const { data } = await api.get(`/users?${q}`);
      setUsers(data.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load users');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const handleBan = async (id, ban) => {
    try {
      await api.patch(`/users/${id}/ban`, { isBanned: ban });
      toast.success(ban ? 'User banned' : 'User unbanned');
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  const handleRole = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, { role });
      toast.success(`Role updated to ${role}`);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>User Management</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 'auto' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold px-5 py-3" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}><td colSpan={5} className="px-5 py-3"><div className="skeleton h-4 w-full" /></td></tr>
              )) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <UserCog className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No users found</p>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or role filter</p>
                </td></tr>
              ) : users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-xs font-bold text-primary">{u.name?.[0]}</span></div>
                      <div><p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="badge badge-primary capitalize">{u.role}</span></td>
                  <td className="px-5 py-3"><span className={`badge ${u.isBanned ? 'badge-danger' : 'badge-success'}`}>{u.isBanned ? 'Banned' : 'Active'}</span></td>
                  <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <select className="input text-xs" style={{ width: 'auto', padding: '0.25rem 0.5rem' }} value={u.role} onChange={(e) => handleRole(u._id, e.target.value)}>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button onClick={() => handleBan(u._id, !u.isBanned)} className={`btn btn-sm ${u.isBanned ? 'btn-secondary' : 'btn-danger'}`}>
                        {u.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
