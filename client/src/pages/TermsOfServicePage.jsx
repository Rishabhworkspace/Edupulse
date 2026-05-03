import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  return (
    <div className="container py-24 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using EduPulse, you agree to be bound by these Terms of Service.</p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">2. User Accounts</h2>
          <p className="mb-4">You are responsible for maintaining the confidentiality of your account and password.</p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">3. Course Content</h2>
          <p className="mb-4">All courses provided on EduPulse are for educational purposes. We do not guarantee specific outcomes.</p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">4. Prohibited Conduct</h2>
          <p className="mb-4">You agree not to use the service for any illegal purpose or in violation of any local, state, national, or international law.</p>
        </div>
      </motion.div>
    </div>
  );
}
