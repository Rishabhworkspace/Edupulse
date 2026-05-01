import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/themeSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, Sun, Moon, ChevronDown, LogOut, User, LayoutDashboard, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const { mode } = useSelector((s) => s.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = async () => { await dispatch(logoutUser()); navigate('/login'); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl shadow-sm' : ''}`}
      style={{ background: scrolled ? 'var(--bg-card)' : 'transparent', borderBottom: scrolled ? '1px solid var(--border)' : 'none' }}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Eru<span className="text-primary">dex</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${isActive ? 'text-primary bg-primary/8' : ''}`
              }
              style={({ isActive }) => ({ color: isActive ? '#5C5FEF' : 'var(--text-secondary)' })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {user.avatar ? <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" /> : <span className="text-xs font-bold text-primary">{user.name?.[0]}</span>}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{user.name?.split(' ')[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 py-2 rounded-xl border shadow-lg"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                  >
                    <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                      <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-secondary)] no-underline" style={{ color: 'var(--text-secondary)' }}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-secondary)] no-underline" style={{ color: 'var(--text-secondary)' }}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-danger/5" style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm no-underline">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm no-underline">Get Started</Link>
            </div>
          )}

          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center" style={{ color: 'var(--text-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="container py-4 space-y-2">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium no-underline" style={{ color: 'var(--text-secondary)' }}>{label}</NavLink>
              ))}
              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary btn-sm flex-1 no-underline">Sign in</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm flex-1 no-underline">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
