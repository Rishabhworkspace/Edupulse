import { Download, File } from 'lucide-react';

export default function ResourcesList({ resources }) {
  if (!resources?.length) {
    return (
      <div className="card p-8 text-center bg-gray-50 border-dashed">
        <File className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-sm text-text-muted italic">No resources attached to this lesson.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
        📎 Lesson Resources
      </h4>
      <div className="grid gap-3">
        {resources.map((r, i) => (
          <a 
            key={i} 
            href={r.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-gray-100 hover:border-coral/30 hover:shadow-md transition-all no-underline group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted group-hover:text-coral group-hover:bg-coral-light transition-colors">
                <File className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary mb-0.5">{r.name}</p>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{r.type || 'file'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-coral opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold uppercase">Download</span>
              <Download className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}