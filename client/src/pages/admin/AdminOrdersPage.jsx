import { useState, useEffect } from 'react';
import { CreditCard, Receipt } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => { api.get('/payments/orders').then(({ data }) => { setOrders(data.data || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchOrders(); }, []);

  const handleRefund = async (id) => {
    if (!confirm('Are you sure you want to refund this order?')) return;
    try { await api.post(`/payments/orders/${id}/refund`, { reason: 'Admin initiated' }); toast.success('Refund initiated'); fetchOrders(); }
    catch (err) { toast.error(err.response?.data?.message || 'Refund failed'); }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Order Management</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>{['Order', 'Student', 'Course', 'Amount', 'Status', 'Date', 'Actions'].map((h) => <th key={h} className="text-left text-xs font-semibold px-5 py-3" style={{ color: 'var(--text-muted)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}><td colSpan={7} className="px-5 py-3"><div className="skeleton h-4 w-full" /></td></tr>) :
              orders.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <Receipt className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No orders yet</p>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>Orders will appear here once students make purchases</p>
                </td></tr>
              ) :
              orders.map((o) => (
                <tr key={o._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-5 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{o._id.slice(-8)}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{o.user?.name || '—'}</td>
                  <td className="px-5 py-3 text-sm truncate" style={{ color: 'var(--text-secondary)', maxWidth: 180 }}>{o.course?.title || '—'}</td>
                  <td className="px-5 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>₹{o.amount}</td>
                  <td className="px-5 py-3"><span className={`badge capitalize ${o.status === 'paid' ? 'badge-success' : o.status === 'refunded' ? 'badge-danger' : 'badge-warning'}`}>{o.status}</span></td>
                  <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">{o.status === 'paid' && <button onClick={() => handleRefund(o._id)} className="btn btn-danger btn-sm">Refund</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
