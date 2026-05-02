import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, AlertCircle, Bookmark } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import api from '@/lib/api';
import { Link } from 'react-router-dom';

export default function AssignmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me/enrollments')
      .then(({ data }) => {
        setEnrollments(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const assignments = [];
  enrollments.forEach(e => {
    e.course?.curriculum?.forEach(sec => {
      sec.lessons?.filter(l => l.type === 'assignment').forEach(l => {
        const isDone = e.completedLessons?.includes(l._id);
        assignments.push({
          id: l._id,
          title: l.title,
          course: e.course.title,
          slug: e.course.slug,
          type: 'Assignment',
          status: isDone ? 'Submitted' : 'Pending',
          color: isDone ? '#8DB580' : '#F4845F',
        });
      });
    });
  });

  if (loading) return (
    <div className="space-y-6">
      <SectionHeading title="Assignments & Tests" subtitle="Stay on top of your coursework." />
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-surface" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading title="Assignments & Tests" subtitle="Stay on top of your coursework." />
      
      {assignments.length === 0 ? (
        <div className="bg-surface rounded-[20px] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center text-coral mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl text-text-primary mb-2">No assignments yet</h3>
          <p className="text-text-body max-w-md mx-auto mb-6">
            You don't have any assignments pending in your enrolled courses.
          </p>
          <Link to="/courses" className="btn btn-primary no-underline">Find New Courses</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((task) => (
            <div key={task.id} className="card p-6 flex items-center justify-between hover:border-coral/20 transition-all group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${task.color}15` }}>
                  <FileText className="w-6 h-6" style={{ color: task.color }} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-1">{task.title}</h4>
                  <p className="text-xs text-text-muted">{task.course} • {task.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="w-32 text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    task.status === 'Submitted' ? 'bg-green-50 text-green-600' : 'bg-coral-light text-coral'
                  }`}>
                    {task.status === 'Submitted' && <CheckCircle2 className="w-3 h-3" />}
                    {task.status}
                  </span>
                </div>

                <Link to={`/learn/${task.slug}`} className={`btn btn-sm ${task.status === 'Submitted' ? 'btn-outline' : 'btn-primary'} no-underline`}>
                  {task.status === 'Submitted' ? 'View Work' : 'Go to Lesson'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
