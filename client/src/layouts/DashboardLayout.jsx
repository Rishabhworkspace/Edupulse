import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, Users, CreditCard, Tag, User, LogOut, BarChart3, PlusCircle, ChevronLeft, MessageCircle, Library, Calendar, Bookmark, ClipboardList, Award, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import BackToTop from '@/components/shared/BackToTop';

const navItems = {
  student: [
    {
      category: 'Learning',
      items: [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/dashboard/enrolled', icon: Library, label: 'My Courses' },
        { to: '/dashboard/schedule', icon: Calendar, label: 'My Schedule' },
        { to: '/dashboard/saved', icon: Bookmark, label: 'Saved Courses' },
        { to: '/dashboard/assignments', icon: ClipboardList, label: 'Assignments' },
      ],
    },
    {
      category: 'Community & Progress',
      items: [
        { to: '/dashboard/achievements', icon: Award, label: 'Achievements' },
        { to: '/dashboard/community', icon: MessageSquare, label: 'Community' },
      ],
    },
    {
      category: 'Account',
      items: [
        { to: '/profile', icon: Settings, label: 'Settings' },
      ],
    },
  ],
  instructor: [
    {
      category: 'Instructor',
      items: [
        { to: '/instructor', icon: BarChart3, label: 'Dashboard' },
        { to: '/instructor/studio', icon: PlusCircle, label: 'Course Studio' },
        { to: '/instructor/qa', icon: MessageCircle, label: 'Q&A Inbox' },
        { to: '/courses', icon: BookOpen, label: 'Browse Courses' },
        { to: '/profile', icon: Settings, label: 'Settings' },
      ],
    },
  ],
  admin: [
    {
      category: 'Admin',
      items: [
        { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
        { to: '/admin/users', icon: Users, label: 'Users' },
        { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
        { to: '/admin/orders', icon: CreditCard, label: 'Orders' },
        { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
        { to: '/profile', icon: Settings, label: 'Settings' },
      ],
    },
  ],
};

export default function DashboardLayout() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const items = navItems[user?.role] || navItems.student;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    window.location.href = '/login';
  };

  const handleLogoClick = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 bottom-0 z-40 flex flex-col"
        style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--gray-300)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5" style={{ borderBottom: '1px solid var(--gray-300)' }}>
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 no-underline">
            <span className="font-display text-lg" style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {collapsed ? 'E' : <>Edu<span style={{ color: 'var(--color-coral)' }}>Pulse</span></>}
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
          {items.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 mb-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                  {group.category}
                </div>
              )}
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/dashboard' || to === '/instructor' || to === '/admin' || to === '/profile'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                      isActive ? 'font-semibold' : ''
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-coral)' : 'var(--color-text-body)',
                    background: isActive ? 'var(--color-coral-light)' : 'transparent',
                  })}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 space-y-1" style={{ borderTop: '1px solid var(--gray-300)' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <LogOut className="w-[18px] h-[18px]" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--gray-300)', cursor: 'pointer', color: 'var(--color-text-muted)' }}
        >
          <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 transition-all duration-200" style={{ marginLeft: collapsed ? 72 : 260 }}>
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-8 sticky top-0 z-30 backdrop-blur-lg" style={{ background: 'rgba(254,253,246,0.9)', borderBottom: '1px solid var(--gray-300)' }}>
          <div>
            <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--color-text-body)' }}>
              Welcome back, <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{user?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                style={{ background: 'var(--color-coral-light)', border: 'none', cursor: 'pointer' }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-bold" style={{ color: 'var(--color-coral)' }}>{user?.name?.[0]}</span>
                )}
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-10 w-48 py-2 z-50"
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: 12,
                      border: '1px solid var(--gray-300)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Link
                      to="/profile"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm no-underline"
                      style={{ color: 'var(--color-text-body)' }}
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <div style={{ borderTop: '1px solid var(--gray-300)', margin: '4px 0' }} />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left"
                      style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
      <BackToTop />
    </div>
  );
}
