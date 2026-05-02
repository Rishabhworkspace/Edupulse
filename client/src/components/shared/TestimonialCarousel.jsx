import { useState } from 'react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Frontend Developer at Flipkart',
    quote: 'I switched careers from teaching to tech in just 4 months. The web development course was incredibly well-structured, and the projects I built actually helped me crack interviews.',
    color: '#7EC8C8',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
  },
  {
    name: 'Arjun Mehta',
    role: 'Data Analyst at Razorpay',
    quote: 'What I appreciated most was how the instructors broke down complex data science concepts. I went from knowing nothing about Python to building predictive models for my team.',
    color: '#F5D770',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&q=80',
  },
  {
    name: 'Sneha Reddy',
    role: 'UX Designer, Freelance',
    quote: 'The UI/UX course gave me a proper design process — not just tools. Within two weeks of finishing, I had my first paying client. The community feedback was a huge bonus.',
    color: '#C4B5E8',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&q=80',
  },
];

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Card */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 20,
          padding: '36px 40px',
          boxShadow: '0 4px 20px rgba(26,26,46,0.07)',
          position: 'relative',
        }}
      >
        {/* Decorative quotation mark */}
        <span
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 80,
            lineHeight: 0.5,
            color: 'var(--color-coral)',
            opacity: 0.25,
            position: 'absolute',
            top: 24,
            left: 32,
          }}
          aria-hidden="true"
        >
          "
        </span>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--color-text-body)',
            marginBottom: 28,
            position: 'relative',
            zIndex: 1,
            paddingTop: 24,
          }}
        >
          {t.quote}
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          {/* Circular photo placeholder with color block */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: `3px solid ${t.color}`,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img 
              src={t.photo} 
              alt={t.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--color-text-primary)', margin: 0 }}>
              {t.name}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
              {t.role}
            </p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: active === i ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background: active === i ? 'var(--color-coral)' : 'var(--gray-300)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
            aria-label={`View testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
