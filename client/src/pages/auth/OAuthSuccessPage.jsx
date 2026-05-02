import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMe } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getDashboardUrl } from '@/utils/navigation';

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const completeLogin = async () => {
      try {
        const { data } = await api.get('/auth/oauth-exchange');
        const token = data.data.accessToken;
        
        localStorage.setItem('accessToken', token);
        const user = await dispatch(fetchMe()).unwrap();
        
        toast.success('Successfully logged in!');
        navigate(getDashboardUrl(user.role));
      } catch (err) {
        toast.error('Failed to complete login. Please try again.');
        navigate('/login');
      }
    };

    completeLogin();
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-light border-t-primary animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium">Completing login...</p>
      </div>
    </div>
  );
}
