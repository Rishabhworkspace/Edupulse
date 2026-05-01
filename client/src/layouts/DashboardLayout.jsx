import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Users, CreditCard, Tag, User, LogOut, GraduationCap, BarChart3, PlusCircle, ChevronLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const navItems = {
  student: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'Browse Courses' },
    { to: '/profile', icon: User, label: 'Profile' },
  ],
  instructor: [
    { to: '/instructor', icon: BarChart3, label: 'Dashboard' },
    { to: '/instructor/studio', icon: PlusCircle, label: 'Course Studio' },
    { to: '/instructor/qa', icon: MessageCircle, label: 'Q&A Inbox' },
    { to: '/courses', icon: BookOpen, label: 'Browse Courses' },
    { to: '/profile', icon: User, label: 'Profile' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { to: '/admin/orders', icon: CreditCard, label: 'Orders' },
    { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
    { to: '/profile', icon: User, label: 'Profile' },
  ],
};

export default function DashboardLayout() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const items = navItems[user?.role] || navItems.student;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
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
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="font-display text-lg" style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {collapsed ? 'E' : <>Edu<span style={{ color: 'var(--color-coral)' }}>Pulse</span></>}
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard' || to === '/instructor' || to === '/admin'}
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--color-coral-light)' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span className="text-sm font-bold" style={{ color: 'var(--color-coral)' }}>{user?.name?.[0]}</span>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
