import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-24 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us when you create an account, enroll in a course, or communicate with us.</p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, including to process transactions and send you related information.</p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">3. Information Sharing</h2>
          <p className="mb-4">We do not share your personal information with third parties except as described in this policy.</p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">4. Security</h2>
          <p className="mb-4">We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.</p>
        </div>
      </motion.div>
    </div>
  );
}
