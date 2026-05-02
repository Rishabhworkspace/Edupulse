import { motion } from 'framer-motion';
import { Users, Award, BookOpen, Globe } from 'lucide-react';
import SectionHeading from '../components/shared/SectionHeading';
import * as DecorativeElements from '../components/shared/DecorativeElements';

const stats = [
  { icon: <Users className="w-6 h-6" />, value: '50K+', label: 'Active Learners' },
  { icon: <BookOpen className="w-6 h-6" />, value: '200+', label: 'Expert Courses' },
  { icon: <Award className="w-6 h-6" />, value: '100%', label: 'Quality Assured' },
  { icon: <Globe className="w-6 h-6" />, value: '120+', label: 'Countries Reached' },
];

const team = [
  {
    name: 'Sarah Jenkins',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'David Chen',
    role: 'Head of Education',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Lead Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Marcus Johnson',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <DecorativeElements.StarDecor className="absolute -top-20 -left-20 w-96 h-96 opacity-20 text-coral" />
        <DecorativeElements.SparkleDecor className="absolute top-40 -right-20 w-80 h-80 opacity-20 text-sage" />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-display text-5xl md:text-6xl text-text-primary mb-6">
              Empowering Minds, <br />
              <span className="text-coral italic">Shaping the Future</span>
            </h1>
            <p className="text-xl text-text-body mb-10">
              At EduPulse, we believe that education should be accessible, engaging, and transformative. 
              Our mission is to bridge the gap between curiosity and mastery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-surface">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 bg-bg rounded-[20px] shadow-sm border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-coral-light text-coral mb-4">
                  {stat.icon}
                </div>
                <h3 className="font-display text-3xl text-text-primary mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Students collaborating"
                className="rounded-[20px] shadow-soft object-cover w-full h-[500px]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl text-text-primary mb-6">Our Story</h2>
              <div className="space-y-4 text-text-body text-lg leading-relaxed">
                <p>
                  EduPulse started with a simple idea: learning shouldn't be confined to traditional classrooms or rigid schedules. We envisioned a platform where anyone, anywhere, could access world-class education tailored to their pace.
                </p>
                <p>
                  Since our launch, we've partnered with industry experts and passionate educators to build a diverse catalog of courses. From technology and business to creative arts, our curriculum is designed to equip learners with practical skills for the modern world.
                </p>
                <p>
                  But we're more than just a course catalog. We're a community of lifelong learners, dreamers, and doers. Welcome to EduPulse.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-surface">
        <div className="container">
          <SectionHeading
            title="Meet Our Team"
            subtitle="The passionate minds behind EduPulse."
            centered
          />
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-[20px] mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-coral/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-display text-xl text-text-primary mb-1 text-center">{member.name}</h3>
                <p className="text-coral font-medium text-center">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
