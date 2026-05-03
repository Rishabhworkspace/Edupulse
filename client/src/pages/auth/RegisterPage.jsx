import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDashboardUrl } from '@/utils/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate(getDashboardUrl(user.role));
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Please verify your email.');
      navigate(`/verify-email?email=${form.email}`);
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12" style={{ background: 'var(--color-bg)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <Link to="/" className="no-underline inline-block mb-4">
            <span className="font-display text-2xl" style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Edu<span style={{ color: 'var(--color-coral)' }}>Pulse</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Create your account</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-body)' }}>Start your learning journey today — it's free</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div className="grid grid-cols-1 gap-3 mb-6">
            <a href="/api/v1/auth/oauth/google" className="btn btn-ghost justify-center gap-2 no-underline text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </a>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--gray-300)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--gray-300)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--color-text-body)' }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input type="text" required className="input" style={{ paddingLeft: '2.5rem' }} placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--color-text-body)' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input type="email" required className="input" style={{ paddingLeft: '2.5rem' }} placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--color-text-body)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input type={show ? 'text' : 'password'} required minLength={8} className="input" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg mt-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-muted)' }}>
            By creating an account, you agree to our Terms & Privacy Policy.
          </p>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-body)' }}>
          Already have an account? <Link to="/login" className="font-semibold no-underline" style={{ color: 'var(--color-coral)' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
