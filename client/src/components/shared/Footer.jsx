import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Courses', to: '/courses' },
      { label: 'For Instructors', to: '/register' },
      { label: 'Pricing', to: '/courses' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
      { label: 'Refund Policy', to: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                Eru<span className="text-primary">dex</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
              Empowering learners worldwide with expert-led courses, interactive content, and a thriving community.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h4>
              <ul className="space-y-2.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm transition-colors no-underline hover:text-primary" style={{ color: 'var(--text-secondary)' }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Erudex. All rights reserved.</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Built with ♥ using MERN Stack</p>
        </div>
      </div>
    </footer>
  );
}
