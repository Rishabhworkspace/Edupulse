import ReactMarkdown from 'react-markdown';

export default function ArticleViewer({ lesson }) {
  if (!lesson) return null;

  return (
    <div className="card p-8">
      <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{lesson.title}</h2>
      <div className="prose prose-sm max-w-none text-text-body leading-relaxed">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>
      {lesson.resources?.length > 0 && (
        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <h4 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
             📎 Downloadable Resources
          </h4>
          <div className="flex flex-wrap gap-3">
            {lesson.resources.map((r, i) => (
              <a 
                key={i} 
                href={r.url} 
                download 
                className="btn btn-ghost btn-sm border border-gray-200 no-underline"
              >
                {r.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}