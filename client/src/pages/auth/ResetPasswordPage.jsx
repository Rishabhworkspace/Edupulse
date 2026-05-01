import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-6">
        <div className="card p-8 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: '#F4845F10' }}>
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Set new password</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Enter a new secure password for your account.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="password" required minLength={8} className="input text-center" placeholder="New password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
