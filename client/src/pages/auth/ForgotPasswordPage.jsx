import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-6">
        <div className="card p-8 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: '#5C5FEF10' }}>
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{sent ? 'Check your email' : 'Forgot password?'}</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {sent ? `We've sent a reset link to ${email}` : "Enter your email and we'll send you a reset link."}
          </p>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" required className="input text-center" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
          ) : (
            <Link to="/login" className="btn btn-secondary w-full no-underline"><ArrowLeft className="w-4 h-4" /> Back to login</Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
