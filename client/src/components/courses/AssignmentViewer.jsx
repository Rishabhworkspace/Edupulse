import ReactMarkdown from 'react-markdown';
import { ClipboardList, Download, CheckCircle } from 'lucide-react';

export default function AssignmentViewer({ lesson, onComplete }) {
  if (!lesson) return null;

  return (
    <div className="card p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-coral-light text-coral px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Assignment
        </span>
      </div>
      <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{lesson.title}</h2>
      
      <div className="prose prose-sm max-w-none text-text-body leading-relaxed mb-8">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>

      {lesson.resources?.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h4 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Starter Files
          </h4>
          <div className="flex flex-wrap gap-3">
            {lesson.resources.map((r, i) => (
              <a 
                key={i} 
                href={r.url} 
                className="btn btn-surface btn-sm border border-gray-200 no-underline text-text-body"
              >
                {r.name}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="border-t pt-8 flex justify-center">
        <button 
          onClick={() => onComplete(lesson._id)} 
          className="btn btn-primary btn-lg flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Mark Assignment Complete
        </button>
      </div>
    </div>
  );
}