import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    q: 'How do I get started with EduPulse?',
    a: 'Simply create a free account and start browsing our course catalog. You can enroll in free courses instantly or purchase premium courses to begin learning right away.',
  },
  {
    q: 'Are the certificates recognized by employers?',
    a: 'Yes! Our certificates are issued upon course completion and include verifiable credentials. Many of our students have used them to land jobs at top companies.',
  },
  {
    q: 'Can I access courses on my phone or tablet?',
    a: 'Absolutely. EduPulse is fully responsive and works great on any device. You can learn on your desktop, tablet, or smartphone — your progress syncs across all devices.',
  },
  {
    q: 'What happens if I\'m not satisfied with a course?',
    a: 'We offer a full refund within 7 days of purchase if the course doesn\'t meet your expectations. No questions asked.',
  },
  {
    q: 'How do I become an instructor on EduPulse?',
    a: 'Sign up for an instructor account and use our Course Studio to create and publish your courses. We provide tools for video hosting, quizzes, and student engagement.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {faqData.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 16,
              border: `1px solid ${isOpen ? 'var(--color-coral)' : 'var(--gray-300)'}`,
              padding: '20px 24px',
              marginBottom: 12,
              transition: 'border-color 0.2s ease',
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between text-left"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: 'var(--color-text-primary)',
                padding: 0,
              }}
            >
              {item.q}
              <ChevronDown
                className="w-5 h-5 flex-shrink-0 ml-4"
                style={{
                  color: 'var(--color-text-muted)',
                  transition: 'transform 0.3s ease',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            <div
              style={{
                maxHeight: isOpen ? 200 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease, padding 0.3s ease',
                paddingTop: isOpen ? 12 : 0,
              }}
            >
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--color-text-body)', lineHeight: 1.65, margin: 0 }}>
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
