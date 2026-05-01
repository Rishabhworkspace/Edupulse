import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, BookOpen, TrendingUp, CreditCard, Tag } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';

const mockChart = [
  { month: 'Jan', revenue: 12000 }, { month: 'Feb', revenue: 18000 }, { month: 'Mar', revenue: 15000 },
  { month: 'Apr', revenue: 22000 }, { month: 'May', revenue: 28000 }, { month: 'Jun', revenue: 35000 },
];

export default function AdminDashboard() {
  const [revenue, setRevenue] = useState({ gmv: 0, orderCount: 0, platformRevenue: 0, refundTotal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/revenue').then(({ data }) => setRevenue(data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: DollarSign, label: 'Total GMV', value: `₹${revenue.gmv?.toLocaleString()}`, color: '#10B981' },
    { icon: CreditCard, label: 'Platform Revenue', value: `₹${Math.round(revenue.platformRevenue || 0).toLocaleString()}`, color: '#F4845F' },
    { icon: TrendingUp, label: 'Total Orders', value: revenue.orderCount, color: '#F59E0B' },
    { icon: Tag, label: 'Refunds', value: `₹${(revenue.refundTotal || 0).toLocaleString()}`, color: '#EF4444' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Admin Overview</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Platform analytics and revenue</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${color}15` }}><Icon className="w-5 h-5" style={{ color }} /></div>
            <p className="font-display text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="font-display text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockChart}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F4845F" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#F4845F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
            <Area type="monotone" dataKey="revenue" stroke="#F4845F" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
