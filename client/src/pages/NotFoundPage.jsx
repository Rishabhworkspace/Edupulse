import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-6">
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="font-display text-[8rem] font-extrabold leading-none mb-2"
          style={{ background: 'linear-gradient(135deg, #F4845F, #8DB580)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          404
        </motion.div>
        <h2 className="font-display text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Page not found</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn btn-primary no-underline"><Home className="w-4 h-4" /> Home</Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary"><ArrowLeft className="w-4 h-4" /> Go Back</button>
        </div>
      </motion.div>
    </div>
  );
}
