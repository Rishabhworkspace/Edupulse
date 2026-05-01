import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Users, BookOpen, Award, Sparkles, TrendingUp, Shield, Zap, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } };
const stagger = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const features = [
  { icon: Sparkles, title: 'AI-Powered Learning Paths', desc: 'Personalized curriculum recommendations based on your skills and goals.' },
  { icon: Shield, title: 'Verified Certificates', desc: 'Industry-recognised certificates to boost your professional credibility.' },
  { icon: Zap, title: 'Interactive Content', desc: 'Quizzes, coding challenges, and hands-on projects in every course.' },
  { icon: Play, title: 'HD Video Lectures', desc: 'Crystal-clear video streaming with adaptive quality and offline access.' },
  { icon: Users, title: 'Community Forums', desc: 'Connect with peers, ask questions, and collaborate on projects.' },
  { icon: TrendingUp, title: 'Progress Analytics', desc: 'Track your learning journey with detailed analytics and insights.' },
];

const DEFAULT_CATEGORIES = [
  { name: 'Web Development', gradient: 'from-indigo-500 to-purple-600' },
  { name: 'Data Science', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Mobile Development', gradient: 'from-orange-500 to-red-500' },
  { name: 'UI/UX Design', gradient: 'from-pink-500 to-rose-600' },
  { name: 'Cloud & DevOps', gradient: 'from-cyan-500 to-blue-600' },
  { name: 'Cybersecurity', gradient: 'from-yellow-500 to-amber-600' },
];

export default function HomePage() {
  const [stats, setStats] = useState({ totalCourses: 0, totalEnrollments: 0, completedEnrollments: 0, avgCompletionRate: 0, categoryCounts: {} });

  useEffect(() => {
    api.get('/courses/stats').then(({ data }) => setStats(data.data)).catch(() => {});
  }, []);

  const statsData = [
    { icon: Users, value: `${(stats.totalEnrollments / 1000).toFixed(1)}K+`, label: 'Active Learners' },
    { icon: BookOpen, value: `${stats.totalCourses}+`, label: 'Expert Courses' },
    { icon: Award, value: `${(stats.completedEnrollments / 1000).toFixed(1)}K+`, label: 'Certificates Issued' },
    { icon: TrendingUp, value: `${stats.avgCompletionRate}%`, label: 'Completion Rate' },
  ];

  const categories = DEFAULT_CATEGORIES.map(c => ({
    ...c,
    count: stats.categoryCounts?.[c.name] || 0
  }));

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #5C5FEF33, transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #F59E0B22, transparent 70%)' }} />
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <span className="badge badge-primary mb-5 px-3 py-1">🚀 New: AI Learning Paths Now Available</span>
            </motion.div>

            <motion.h1 {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6" style={{ color: 'var(--text-primary)' }}>
              Learn Without
              <span className="block mt-1" style={{ background: 'linear-gradient(135deg, #5C5FEF, #7C7FFF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Limits
              </span>
            </motion.h1>

            <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Master in-demand skills with expert-led courses, interactive projects, and a community of lifelong learners. Your career transformation starts here.
            </motion.p>

            <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/courses" className="btn btn-primary btn-lg gap-2 no-underline group">
                Explore Courses <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg no-underline">
                Start Free Trial
              </Link>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-2 mt-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold" style={{ background: ['#EEF0FF', '#D1FAE5', '#FEF3C7', '#DBEAFE'][i], borderColor: 'var(--bg)', color: ['#5C5FEF', '#059669', '#D97706', '#2563EB'][i] }}>
                    {['R', 'S', 'A', 'P'][i]}
                  </div>
                ))}
              </div>
              <div className="stars text-sm">{'★'.repeat(5)}</div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>4.9/5 from 2,000+ reviews</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-secondary)' }}>
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map(({ icon: Icon, value, label }, i) => (
              <motion.div key={label} {...stagger} transition={{ delay: i * 0.1, duration: 0.4 }} className="text-center">
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: '#5C5FEF10' }}>
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-display font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="badge badge-primary mb-3">Browse by Category</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Find Your Perfect Path</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>From beginner to expert, explore courses across the most in-demand fields.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(({ name, count, gradient }, i) => (
              <motion.div key={name} {...stagger} transition={{ delay: i * 0.08 }}>
                <Link to="/courses" className="card p-5 flex items-center gap-4 no-underline group hover:border-primary/20" style={{ borderColor: 'var(--border)' }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{count} Courses</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="badge badge-primary mb-3">Why EduPulse</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Built for Modern Learners</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Every feature is designed to maximise your learning outcomes and career growth.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} {...stagger} transition={{ delay: i * 0.08 }} className="card p-6 group hover:-translate-y-1">
                <div className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center" style={{ background: '#5C5FEF10' }}>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div {...fadeUp} className="relative rounded-2xl overflow-hidden p-12 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, #5C5FEF 0%, #7C3AED 50%, #A78BFA 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Learning?</h2>
              <p className="text-lg text-white/80 max-w-lg mx-auto mb-8">Join thousands of learners who are already advancing their careers with EduPulse.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link to="/register" className="btn btn-lg no-underline" style={{ background: 'white', color: '#5C5FEF', fontWeight: 700 }}>
                  Create Free Account
                </Link>
                <Link to="/courses" className="btn btn-lg no-underline" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>
                  Browse Courses
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-white/70">
                {['No credit card required', 'Cancel anytime', '7-day free trial'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> {t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}