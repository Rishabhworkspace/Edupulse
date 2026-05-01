import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchMe } from './store/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Route guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// Eager pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Lazy pages
const CourseCatalogPage = lazy(() => import('./pages/courses/CourseCatalogPage'));
const CourseDetailPage = lazy(() => import('./pages/courses/CourseDetailPage'));
const CheckoutPage = lazy(() => import('./pages/payment/CheckoutPage'));
const PaymentStatusPage = lazy(() => import('./pages/payment/PaymentStatusPage'));
const StudentDashboard = lazy(() => import('./pages/dashboard/StudentDashboard'));
const InstructorDashboard = lazy(() => import('./pages/dashboard/InstructorDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const CoursePlayerPage = lazy(() => import('./pages/courses/CoursePlayerPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));
const CourseStudioPage = lazy(() => import('./pages/instructor/CourseStudioPage'));
const QADashboardPage = lazy(() => import('./pages/instructor/QADashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-4 border-primary-light border-t-primary animate-spin" />
  </div>
);

export default function App() {
  const dispatch = useDispatch();
  const { initialized } = useSelector((s) => s.auth);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchMe());
    } else {
      // Mark as initialized even if not logged in
      dispatch({ type: 'auth/fetchMe/rejected' });
    }
  }, [dispatch]);

  if (!initialized) return <PageLoader />;

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: "'DM Sans', sans-serif" } }} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CourseCatalogPage />} />
            <Route path="/course/:slug" element={<CourseDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Route>

          {/* Protected — any auth */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<Navigate to="/dashboard" replace />} />
            </Route>
            <Route path="/checkout/:courseId" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentStatusPage />} />
            <Route path="/learn/:courseSlug" element={<CoursePlayerPage />} />
          </Route>

          {/* Instructor */}
          <Route element={<RoleRoute roles={['instructor', 'admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/instructor/studio" element={<CourseStudioPage />} />
              <Route path="/instructor/studio/:courseId" element={<CourseStudioPage />} />
              <Route path="/instructor/qa" element={<QADashboardPage />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/coupons" element={<AdminCouponsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
