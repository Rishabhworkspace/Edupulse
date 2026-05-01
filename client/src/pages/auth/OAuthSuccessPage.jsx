import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMe } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('accessToken', token);
      dispatch(fetchMe())
        .unwrap()
        .then(() => {
          toast.success('Successfully logged in!');
          navigate('/dashboard');
        })
        .catch(() => {
          toast.error('Failed to complete login. Please try again.');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-light border-t-primary animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium">Completing login...</p>
      </div>
    </div>
  );
}
