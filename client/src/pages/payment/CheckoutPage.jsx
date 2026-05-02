import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Tag, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import MockPaymentPopup from '@/components/payment/MockPaymentPopup';
import { useSelector } from 'react-redux';
import { getDashboardUrl } from '@/utils/navigation';

export default function CheckoutPage() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [course, setCourse] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/courses/${courseSlug}`);
        setCourse(data.data);
      } catch (err) {
        console.error('Failed to load course:', err);
        toast.error('Failed to load course details');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    })();
  }, [courseSlug, navigate]);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, courseId: course._id, orderAmount: course.price });
      setDiscount(data.data);
      toast.success(`Coupon applied! ${data.data.discountType === 'percentage' ? `${data.data.discountValue}% off` : `₹${data.data.discountValue} off`}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); setDiscount(null); }
  };

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post('/payments/checkout', { courseId: course._id, couponCode: discount ? couponCode : '' });
      if (data.data.free) { 
        toast.success('Enrolled for free!'); 
        navigate(user?.role === 'student' ? '/dashboard/enrolled' : getDashboardUrl(user?.role)); 
        setProcessing(false);
        return; 
      }
      if (data.data.mockPayment) {
        setPaymentAmount(data.data.amount);
        setShowPaymentPopup(true);
      } else {
        window.location.href = data.data.url;
      }
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Checkout failed'); 
    } finally { 
      setProcessing(false); 
    }
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentPopup(false);
    try {
      await api.post('/payments/mock-complete', { courseId: course._id, couponCode: discount ? couponCode : '' });
      toast.success('Payment successful! You are now enrolled.');
      navigate(user?.role === 'student' ? '/dashboard/enrolled' : getDashboardUrl(user?.role));
    } catch (err) {
      toast.error('Enrollment failed. Please contact support.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /></div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center"><p>Course not found</p></div>;

  const finalPrice = discount ? discount.finalAmount : course.price;

  return (
    <div className="min-h-screen flex items-center justify-center py-12" style={{ background: 'var(--bg)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg px-6">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F4845F10' }}>
            <ShoppingCart className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Checkout</h1>
        </div>

        <div className="card p-6 mb-4">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
            {course.thumbnail ? <img src={course.thumbnail} alt="" className="w-20 h-14 rounded-lg object-cover" /> : <div className="w-20 h-14 rounded-lg bg-primary/10" />}
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>by {course.instructor?.name}</p>
            </div>
          </div>

          {/* Coupon */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
            </div>
            <button onClick={handleValidateCoupon} className="btn btn-secondary btn-sm">Apply</button>
          </div>
          {discount && (
            <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: '#10B981' }}>
              <CheckCircle className="w-4 h-4" /> Discount: -₹{discount.discountAmount}
            </div>
          )}

          {/* Summary */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>Original Price</span><span style={{ color: 'var(--text-primary)' }}>₹{course.price}</span></div>
            {discount && <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>Discount</span><span className="text-success">-₹{discount.discountAmount}</span></div>}
            <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}><span>Total</span><span>₹{finalPrice}</span></div>
          </div>

          <button onClick={handleCheckout} disabled={processing} className="btn btn-primary w-full btn-lg">
            {processing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Pay ₹${finalPrice}`}
          </button>
          <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>Secure payment powered by Stripe</p>
        </div>
      </motion.div>

      <MockPaymentPopup 
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        amount={paymentAmount}
        courseTitle={course?.title}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
