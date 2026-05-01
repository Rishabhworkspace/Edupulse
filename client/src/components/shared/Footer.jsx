import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const footerLinks = [
  {
    title: 'About',
    links: [
      { label: 'About Us', to: '/' },
      { label: 'Courses', to: '/courses' },
      { label: 'News & Blogs', to: '/' },
      { label: 'Become an Instructor', to: '/register' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Browse Courses', to: '/courses' },
      { label: 'For Instructors', to: '/register' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--gray-300)' }}>
      <div className="container" style={{ padding: '64px 32px' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="no-underline mb-4 inline-block">
              <span className="font-display text-2xl" style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Edu<span style={{ color: 'var(--color-coral)' }}>Pulse</span>
              </span>
            </Link>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-body)', lineHeight: 1.65, maxWidth: 260 }}>
              Empowering learners worldwide with expert-led courses, interactive content, and a thriving community.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {['Twitter', 'LinkedIn', 'YouTube', 'Instagram'].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="flex items-center justify-center transition-colors"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--gray-100)',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                  title={name}
                >
                  {name[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--color-text-primary)' }}>{title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map(({ label, to }) => (
                  <li key={label} style={{ marginBottom: 10 }}>
                    <Link to={to} className="text-sm no-underline transition-colors" style={{ color: 'var(--color-text-body)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-coral)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-body)'}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--color-text-primary)' }}>Contact</h4>
            <div className="space-y-3">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm no-underline" style={{ color: 'var(--color-text-body)' }}>
                <Phone className="w-4 h-4" style={{ color: 'var(--color-coral)' }} />
                +91 98765 43210
              </a>
              <a href="mailto:hello@edupulse.in" className="flex items-center gap-2 text-sm no-underline" style={{ color: 'var(--color-text-body)' }}>
                <Mail className="w-4 h-4" style={{ color: 'var(--color-coral)' }} />
                hello@edupulse.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--gray-300)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>© {new Date().getFullYear()} EduPulse. All rights reserved.</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Built with ♥ for learners everywhere</p>
        </div>
      </div>
    </footer>
  );
}
