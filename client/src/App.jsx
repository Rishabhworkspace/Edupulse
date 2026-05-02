import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchMe, markInitialized } from './store/slices/authSlice';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';
import GuestRoute from './components/auth/GuestRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';
import ScrollToTop from './components/shared/ScrollToTop';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CourseCatalogPage = lazy(() => import('./pages/courses/CourseCatalogPage'));
const CourseDetailPage = lazy(() => import('./pages/courses/CourseDetailPage'));
const CheckoutPage = lazy(() => import('./pages/payment/CheckoutPage'));
const PaymentStatusPage = lazy(() => import('./pages/payment/PaymentStatusPage'));
const StudentDashboard = lazy(() => import('./pages/dashboard/StudentDashboard'));
const MyCoursesPage = lazy(() => import('./pages/dashboard/MyCoursesPage'));
const SchedulePage = lazy(() => import('./pages/dashboard/SchedulePage'));
const SavedCoursesPage = lazy(() => import('./pages/dashboard/SavedCoursesPage'));
const AssignmentsPage = lazy(() => import('./pages/dashboard/AssignmentsPage'));
const AchievementsPage = lazy(() => import('./pages/dashboard/AchievementsPage'));
const CommunityPage = lazy(() => import('./pages/dashboard/CommunityPage'));
const InstructorDashboard = lazy(() => import('./pages/dashboard/InstructorDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const CoursePlayerPage = lazy(() => import('./pages/courses/CoursePlayerPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));
const OAuthSuccessPage = lazy(() => import('./pages/auth/OAuthSuccessPage'));
const CourseStudioPage = lazy(() => import('./pages/instructor/CourseStudioPage'));
const QADashboardPage = lazy(() => import('./pages/instructor/QADashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
    <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '4px solid var(--color-coral-light)', borderTopColor: 'var(--color-coral)' }} />
  </div>
);

export default function App() {
  const dispatch = useDispatch();
  const { initialized } = useSelector((s) => s.auth);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchMe());
    } else {
      dispatch(markInitialized());
    }
  }, [dispatch]);

  if (!initialized) return <PageLoader />;

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: "'DM Sans', sans-serif" } }} />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/courses" element={<CourseCatalogPage />} />
              <Route path="/course/:slug" element={<CourseDetailPage />} />

              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/oauth-success" element={<OAuthSuccessPage />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/dashboard/enrolled" element={<MyCoursesPage />} />
                <Route path="/dashboard/schedule" element={<SchedulePage />} />
                <Route path="/dashboard/saved" element={<SavedCoursesPage />} />
                <Route path="/dashboard/assignments" element={<AssignmentsPage />} />
                <Route path="/dashboard/achievements" element={<AchievementsPage />} />
                <Route path="/dashboard/community" element={<CommunityPage />} />
              </Route>
              <Route path="/checkout/:courseSlug" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentStatusPage />} />
              <Route path="/learn/:courseSlug" element={<CoursePlayerPage />} />
            </Route>

            <Route element={<RoleRoute roles={['instructor', 'admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/instructor" element={<InstructorDashboard />} />
                <Route path="/instructor/studio" element={<CourseStudioPage />} />
                <Route path="/instructor/studio/:courseId" element={<CourseStudioPage />} />
                <Route path="/instructor/qa" element={<QADashboardPage />} />
              </Route>
            </Route>

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
    </ErrorBoundary>
  );
}