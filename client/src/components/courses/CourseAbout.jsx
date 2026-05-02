import ReactMarkdown from 'react-markdown';

export default function CourseAbout({ longDescription }) {
  if (!longDescription) return null;

  return (
    <div className="mb-12">
      <h3 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        About this course
      </h3>
      <div className="prose prose-lg max-w-none text-text-body leading-relaxed bg-surface p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <ReactMarkdown>{longDescription}</ReactMarkdown>
      </div>
    </div>
  );
}