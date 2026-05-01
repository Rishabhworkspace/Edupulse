import { useState, useEffect } from 'react';
import { Tag, PlusCircle, Download, BarChart3, Ticket } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: 10, maxUses: 100, perUserLimit: 1, expiresAt: '' });

  const fetchCoupons = () => { api.get('/coupons').then(({ data }) => { setCoupons(data.data || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', { ...form, code: form.code.toUpperCase(), expiresAt: form.expiresAt || undefined });
      toast.success('Coupon created!'); setShowCreate(false); setForm({ code: '', type: 'percentage', value: 10, maxUses: 100, perUserLimit: 1, expiresAt: '' }); fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await api.patch(`/coupons/${id}`, { isActive: !isActive });
      toast.success(isActive ? 'Coupon deactivated' : 'Coupon activated'); fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Coupon Management</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary btn-sm"><PlusCircle className="w-4 h-4" /> New Coupon</button>
      </div>

      {showCreate && (
        <div className="card p-6 mb-6">
          <h3 className="font-display text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Create Coupon</h3>
          <form onSubmit={handleCreate} className="grid md:grid-cols-3 gap-4">
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Code</label><input required className="input" placeholder="SAVE20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Type</label><select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Value</label><input type="number" required className="input" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} /></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Max Uses</label><input type="number" className="input" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} /></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Per User Limit</label><input type="number" className="input" value={form.perUserLimit} onChange={(e) => setForm({ ...form, perUserLimit: Number(e.target.value) })} /></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Expires At</label><input type="date" className="input" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></div>
            <div className="md:col-span-3 flex gap-2"><button type="submit" className="btn btn-primary btn-sm">Create</button><button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary btn-sm">Cancel</button></div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>{['Code', 'Type', 'Value', 'Used', 'Max', 'Status', 'Expires', 'Actions'].map((h) => <th key={h} className="text-left text-xs font-semibold px-5 py-3" style={{ color: 'var(--text-muted)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? [...Array(3)].map((_, i) => <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}><td colSpan={8} className="px-5 py-3"><div className="skeleton h-4 w-full" /></td></tr>) :
              coupons.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <Ticket className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No coupons yet</p>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>Click "New Coupon" to create your first discount code</p>
                </td></tr>
              ) :
              coupons.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-5 py-3 text-sm font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{c.code}</td>
                  <td className="px-5 py-3 text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>{c.type}</td>
                  <td className="px-5 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.usedCount}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.maxUses || '∞'}</td>
                  <td className="px-5 py-3"><span className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                  <td className="px-5 py-3"><button onClick={() => handleToggle(c._id, c.isActive)} className={`btn btn-sm ${c.isActive ? 'btn-danger' : 'btn-secondary'}`}>{c.isActive ? 'Deactivate' : 'Activate'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
