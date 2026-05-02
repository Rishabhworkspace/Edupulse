import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
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
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const handleLogoClick = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl' : ''}`}
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--gray-300)' : 'none',
        padding: '0',
      }}
    >
      <div className="container flex items-center justify-between" style={{ height: 64, padding: '14px 32px' }}>
        {/* Logo — Fraunces wordmark */}
        <Link to="/" onClick={handleLogoClick} className="no-underline flex items-center gap-1">
          <span className="font-display text-2xl" style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Edu<span style={{ color: 'var(--color-coral)' }}>Pulse</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="relative px-4 py-2 text-sm no-underline group"
              style={({ isActive }) => ({
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                color: isActive ? 'var(--color-coral)' : 'var(--color-text-body)',
              })}
            >
              {({ isActive }) => (
                <>
                  {label}
                  {/* Animated underline */}
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-200"
                    style={{
                      background: 'var(--color-coral)',
                      width: isActive ? '60%' : '0%',
                    }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors"
                style={{ background: 'var(--gray-100)', border: '1px solid var(--gray-300)', cursor: 'pointer', color: 'var(--color-text-primary)' }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--color-coral-light)' }}>
                  {user.avatar ? <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" /> : <span className="text-xs font-bold" style={{ color: 'var(--color-coral)' }}>{user.name?.[0]}</span>}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{user.name?.split(' ')[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-muted)' }} />
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 py-2"
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: 16,
                      border: '1px solid var(--gray-300)',
                      boxShadow: '0 8px 32px rgba(26,26,46,0.12)',
                    }}
                  >
                    <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--gray-300)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user.name}</p>
                      <p className="text-xs capitalize" style={{ color: 'var(--color-text-muted)' }}>{user.role}</p>
                    </div>
                    <Link 
                      to={user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/dashboard'} 
                      onClick={() => setDropOpen(false)} 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors no-underline" 
                      style={{ color: 'var(--color-text-body)' }} 
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'} 
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors no-underline" style={{ color: 'var(--color-text-body)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <div style={{ borderTop: '1px solid var(--gray-300)', margin: '4px 0' }} />
                    <button 
                      onClick={async () => {
                        setDropOpen(false);
                        await dispatch(logoutUser());
                        window.location.href = '/login';
                      }} 
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors" 
                      style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm no-underline">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm no-underline">Get Started</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center" style={{ color: 'var(--color-text-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--gray-300)' }}>
            <div className="container py-4 space-y-2">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium no-underline" style={{ color: 'var(--color-text-body)' }}>{label}</NavLink>
              ))}
              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost btn-sm flex-1 no-underline">Log In</Link>
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
