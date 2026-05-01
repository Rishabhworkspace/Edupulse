import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PaymentStatusPage() {
  const [params] = useSearchParams();
  const success = params.get('status') === 'success';

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-10 text-center max-w-sm mx-auto">
        {success ? (
          <>
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Payment Successful!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Your enrollment has been confirmed. Start learning now!</p>
            <div className="flex flex-col gap-2">
              <Link to="/dashboard" className="btn btn-primary w-full no-underline">Go to Dashboard</Link>
              <Link to="/courses" className="btn btn-secondary w-full no-underline">Browse More Courses</Link>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Payment Failed</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Something went wrong with your payment. No charges were made.</p>
            <div className="flex flex-col gap-2">
              <Link to="/courses" className="btn btn-primary w-full no-underline">Try Again</Link>
              <Link to="/" className="btn btn-secondary w-full no-underline">Go Home</Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
