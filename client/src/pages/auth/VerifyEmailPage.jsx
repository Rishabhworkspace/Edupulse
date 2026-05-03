import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail, RefreshCw, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) { toast.error('Please enter the OTP'); return; }
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, otp });
      toast.success('Email verified! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) { toast.error('No email provided'); return; }
    setResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('New OTP sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-10 text-center max-w-sm mx-auto">
          <XCircle className="w-14 h-14 text-danger mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Missing Email</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Please register first to get a verification email.</p>
          <Link to="/register" className="btn btn-primary no-underline">Register</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto mb-4 flex items-center justify-center">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Verify your email</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Enter the 6-digit code sent to <strong>{email}</strong></p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>💡 Check spam folders for otp</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleVerify}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="input w-full text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mb-4" disabled={loading || otp.length !== 6}>
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</span> : <>Verify Email <ArrowRight className="w-4 h-4" /></>}
            </button>

            <button type="button" onClick={handleResend} className="btn btn-secondary w-full" disabled={resending}>
              {resending ? <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Sending...</span> : <>Resend OTP <RefreshCw className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Already verified?</p>
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}