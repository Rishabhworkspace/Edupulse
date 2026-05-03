import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import api from '@/lib/api';
import CourseCard from '@/components/shared/CourseCard';
import SectionHeading from '@/components/shared/SectionHeading';
import StatsBar from '@/components/shared/StatsBar';
import TestimonialCarousel from '@/components/shared/TestimonialCarousel';
import FAQAccordion from '@/components/shared/FAQAccordion';
import { StarDecor, SparkleDecor, DiamondDecor, CircleDotDecor, SpiralDecor, SquigglyLine } from '@/components/shared/DecorativeElements';

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } };
const stagger = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const trustLogos = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'Wipro', 'TCS'];

const missionFeatures = [
  {
    title: 'Make Real-World Learning Accessible for Every Student',
    desc: 'Our courses are designed by industry professionals who understand what employers actually look for. Every lesson connects theory to practice.',
    cta: 'View All Courses',
    ctaLink: '/courses',
  },
  {
    title: 'Go Cashless: Study Anytime, Anywhere, on Any Device',
    desc: 'Download lectures for offline study, pick up right where you left off across devices. Your learning progress stays perfectly synced.',
    cta: null,
  },
  {
    title: 'Mentoring, Not Just Teaching — We Invest in Your Growth',
    desc: 'Our platform pairs you with mentors who provide real feedback on your projects. It\'s the closest thing to having a personal coach.',
    cta: 'Start Learning',
    ctaLink: '/register',
  },
];

const blockColors = ['#7EC8C8', '#F5D770', '#C4B5E8'];
const missionImages = [
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=480&fit=crop&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=480&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=480&fit=crop&q=80',
];

export default function HomePage() {
  const [stats, setStats] = useState({ totalCourses: 0, totalEnrollments: 0, completedEnrollments: 0, avgCompletionRate: 0, categoryCounts: {} });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get('/courses/stats').then(({ data }) => setStats(data.data)).catch(() => {});
    api.get('/courses?limit=4').then(({ data }) => setCourses(data.data || [])).catch(() => {});
  }, []);

  const statsData = [
    { value: stats.totalEnrollments > 1000 ? `${(stats.totalEnrollments / 1000).toFixed(1)}K+` : `${stats.totalEnrollments}+`, label: 'Active Learners' },
    { value: `${stats.totalCourses}+`, label: 'Expert Courses' },
    { value: stats.completedEnrollments > 1000 ? `${(stats.completedEnrollments / 1000).toFixed(1)}K+` : `${stats.completedEnrollments}+`, label: 'Certificates Issued' },
    { value: `${stats.avgCompletionRate}%`, label: 'Completion Rate' },
  ];

  return (
    <div>
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--color-bg)' }}>
        {/* Decorations */}
        <StarDecor style={{ top: '15%', right: '8%', transform: 'rotate(15deg)' }} size={28} />
        <SparkleDecor style={{ top: '25%', left: '5%', transform: 'rotate(-10deg)' }} size={22} className="decor-float-delay-1" />
        <DiamondDecor style={{ bottom: '20%', right: '15%' }} size={16} className="decor-float-delay-2" />
        <CircleDotDecor style={{ bottom: '30%', left: '8%' }} size={14} />
        <SpiralDecor style={{ top: '10%', left: '20%' }} size={36} />

        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — Content */}
            <motion.div {...fadeUp}>
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.5px',
                  color: 'var(--color-text-primary)',
                  marginBottom: 20,
                }}
              >
                Learn{' '}
                <em className="accent-orange" style={{ fontWeight: 900 }}>Anytime,</em>
                <br />
                at Your Pace
              </h1>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.6, color: 'var(--color-text-body)', maxWidth: 460, marginBottom: 32 }}>
                Master in-demand skills with expert-led courses, interactive projects, and a community of lifelong learners. Your career transformation starts here.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/courses" className="btn btn-primary btn-lg no-underline group">
                  Let's Start <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/courses" className="btn btn-ghost btn-lg no-underline">
                  <Play className="w-4 h-4" /> Watch Demo
                </Link>
              </div>
            </motion.div>

            {/* Right — Hero Illustration */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="relative hidden md:block" style={{ minHeight: 480 }}>
              {/* Main Illustration Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Abstract Background Shapes */}
                <div 
                  style={{
                    position: 'absolute',
                    width: '380px',
                    height: '380px',
                    borderRadius: '50%',
                    background: 'var(--color-coral-light)',
                    opacity: 0.4,
                    filter: 'blur(60px)',
                    zIndex: 0
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    background: '#C4B5E8',
                    opacity: 0.3,
                    top: '10%',
                    right: '5%',
                    zIndex: 0,
                    animation: 'morph 8s ease-in-out infinite'
                  }}
                />

                {/* Main Image */}
                <div 
                  style={{
                    position: 'relative',
                    width: '340px',
                    height: '420px',
                    borderRadius: '32px',
                    background: '#fff',
                    padding: '12px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    transform: 'rotate(-2deg)',
                    zIndex: 2,
                    border: '1px solid var(--gray-300)'
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=800&fit=crop&q=80" 
                    alt="Students collaborating" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }}
                  />
                  
                  {/* Floating Skill Badges */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-30px',
                      background: 'white',
                      padding: '12px 20px',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      zIndex: 3,
                      border: '1px solid var(--gray-100)'
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-coral)' }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)' }}>Web Development</span>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    style={{
                      position: 'absolute',
                      bottom: '40px',
                      left: '-40px',
                      background: 'white',
                      padding: '12px 20px',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      zIndex: 3,
                      border: '1px solid var(--gray-100)'
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7EC8C8' }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)' }}>UI/UX Design</span>
                  </motion.div>
                </div>

                {/* Additional Decorative Elements */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '0',
                    width: '120px',
                    height: '120px',
                    borderRadius: '24px',
                    background: '#F5D770',
                    transform: 'rotate(15deg)',
                    zIndex: 1,
                    opacity: 0.8
                  }}
                />
              </div>

              {/* Original floating decorations */}
              <StarDecor style={{ top: 0, left: 20 }} size={24} />
              <SparkleDecor style={{ bottom: 60, right: 20 }} size={20} className="decor-float-delay-1" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ TRUST BAR ════════════════ */}
      <section style={{ padding: '40px 0', background: 'var(--color-bg)' }}>
        <div className="container text-center">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, fontWeight: 500 }}>
            Our Students Work at Companies Such as
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {trustLogos.map((name) => (
              <span
                key={name}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  opacity: 0.5,
                  letterSpacing: '0.5px',
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ COURSE CATALOG ════════════════ */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container relative">
          <StarDecor style={{ top: -20, right: '10%' }} size={22} />

          <SectionHeading
            before="Browse Our"
            accent="Top"
            after="Courses"
            subtitle="Discover courses crafted by industry experts to help you master real-world skills."
          />

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {courses.slice(0, 4).map((course, i) => (
                <motion.div key={course._id} {...stagger} transition={{ delay: i * 0.08 }}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ background: 'var(--color-surface)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(26,26,46,0.08)' }}>
                  <div className="skeleton" style={{ height: 160 }} />
                  <div style={{ padding: 16 }}>
                    <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 12, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/courses" className="btn btn-outline-coral no-underline">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════ MISSION / FEATURES ════════════════ */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container relative">
          <SparkleDecor style={{ top: -10, left: '5%' }} size={20} />
          <DiamondDecor style={{ top: 40, right: '3%' }} size={14} className="decor-float-delay-2" />

          <SectionHeading
            before="Our"
            accent="Mission"
            after="Behind This Platform"
            subtitle="We believe learning should feel exciting, personal, and lead to real career outcomes."
          />

          <div className="space-y-16">
            {missionFeatures.map((feature, i) => {
              const isReversed = i % 2 === 1;
              return (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}>
                  <div
                    className={`grid md:grid-cols-2 gap-10 items-center`}
                    style={{ direction: isReversed ? 'rtl' : 'ltr' }}
                  >
                    {/* Image blob */}
                    <div style={{ direction: 'ltr', position: 'relative' }}>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '4/3',
                          borderRadius: '60% 40% 55% 45% / 50% 45% 55% 50%',
                          background: blockColors[i],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* actual images inside blobs */}
                        <img 
                          src={missionImages[i]} 
                          alt={feature.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }} 
                        />
                      </div>
                      {i === 0 && <StarDecor style={{ top: -10, right: 20 }} size={18} />}
                      {i === 2 && <CircleDotDecor style={{ bottom: 10, left: 10 }} size={12} />}
                    </div>

                    {/* Text content */}
                    <div style={{ direction: 'ltr' }}>
                      <h3
                        className="font-display mb-4"
                        style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)' }}
                      >
                        {feature.title}
                      </h3>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.65, color: 'var(--color-text-body)', marginBottom: 24 }}>
                        {feature.desc}
                      </p>
                      {feature.cta && (
                        <Link to={feature.ctaLink} className="btn btn-outline-coral btn-sm no-underline">
                          {feature.cta} <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ STATS BAR ════════════════ */}
      <section style={{ padding: '48px 0', background: 'var(--color-bg)' }}>
        <div className="container">
          <StatsBar stats={statsData} />
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container relative">
          <CircleDotDecor style={{ top: 0, right: '12%' }} size={14} />
          <DiamondDecor style={{ top: 60, left: '5%' }} size={12} className="decor-float-delay-1" />

          <SectionHeading
            before="Our"
            accent="Happy"
            after="Students Say About Us"
            subtitle="Real stories from learners who transformed their careers with EduPulse."
          />

          <TestimonialCarousel />
        </div>
      </section>

      {/* ════════════════ CTA BANNER ════════════════ */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden text-center"
            style={{
              background: 'linear-gradient(135deg, #F4A98A 0%, #F4845F 50%, #D9613E 100%)',
              borderRadius: 24,
              padding: 'clamp(40px, 6vw, 80px)',
            }}
          >
            {/* Subtle pattern overlay */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.08,
              backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2
                className="font-display mb-4"
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 700,
                  color: 'white',
                  lineHeight: 1.2,
                }}
              >
                Start Learning Today and Make{' '}
                <em style={{ fontStyle: 'italic', color: '#FDE8DF' }}>Real</em> Income
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.85)',
                maxWidth: 520, margin: '0 auto 32px',
                lineHeight: 1.65,
              }}>
                Join thousands of learners who are already advancing their careers with EduPulse. No credit card required.
              </p>
              <Link
                to="/register"
                className="btn btn-lg no-underline"
                style={{
                  background: 'white',
                  color: 'var(--color-coral)',
                  fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                }}
              >
                Start Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ INSTRUCTORS GRID ════════════════ */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container relative">
          <StarDecor style={{ top: -10, right: '8%' }} size={20} />
          <SpiralDecor style={{ top: 40, left: '3%' }} size={28} />

          <SectionHeading
            before="Education Which Promotes"
            accent="Skill"
            accentColor="green"
          />

          {/* Stats + instructor circles layout */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — big stats */}
            <div>
              <div className="mb-8">
                <span className="font-display" style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 700, color: 'var(--color-text-primary)' }}>45+</span>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 500, color: 'var(--color-text-body)', marginTop: 4 }}>Instructors</p>
              </div>
              <div className="mb-8">
                <span className="font-display" style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{stats.totalCourses > 0 ? `${stats.totalCourses}+` : '50+'}</span>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 500, color: 'var(--color-text-body)', marginTop: 4 }}>Courses</p>
              </div>
              <Link to="/courses" className="btn btn-secondary no-underline">
                Get All Instructors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — instructor photo circles */}
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { name: 'Rahul K.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80', bg: '#7EC8C8', size: 100 },
                { name: 'Anita M.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80', bg: '#F5D770', size: 80 },
                { name: 'Dev P.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80', bg: '#C4B5E8', size: 90 },
                { name: 'Neha S.', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80', bg: '#F4A98A', size: 85 },
                { name: 'Vikas R.', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&q=80', bg: '#A8D8B9', size: 75 },
                { name: 'Sara T.', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&q=80', bg: '#7EC8C8', size: 95 },
              ].map((inst, i) => (
                <div key={i} className="flex flex-col items-center gap-1" title={inst.name}>
                  <div
                    style={{
                      width: inst.size,
                      height: inst.size,
                      borderRadius: '50%',
                      background: inst.bg,
                      border: '3px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    <img 
                      src={inst.photo} 
                      alt={inst.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, fontWeight: 500 }}>{inst.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container relative">
          <SparkleDecor style={{ top: -10, left: '10%' }} size={18} />
          <DiamondDecor style={{ top: 30, right: '8%' }} size={12} className="decor-float-delay-2" />

          <SectionHeading
            before="Frequently asked"
            accent="questions"
            accentColor="green"
          />

          <FAQAccordion />
        </div>
      </section>
    </div>
  );
}