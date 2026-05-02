import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center border-none cursor-pointer"
          style={{ 
            background: 'var(--color-coral)',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(244, 132, 95, 0.4)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-coral-dark)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-coral)'}
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6 stroke-[3px]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}