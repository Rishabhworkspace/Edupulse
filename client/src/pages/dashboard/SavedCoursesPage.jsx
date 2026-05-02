import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bookmark } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import CourseCard from '@/components/shared/CourseCard';

export default function SavedCoursesPage() {
  const { user } = useSelector((s) => s.auth);
  const wishlist = user?.wishlist || [];

  return (
    <div className="space-y-6">
      <SectionHeading title="Saved Courses" subtitle="Courses you've bookmarked for later." />
      
      {wishlist.length === 0 ? (
        <div className="bg-surface rounded-[20px] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center text-coral mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl text-text-primary mb-2">Your wishlist is empty</h3>
          <p className="text-text-body max-w-md mx-auto mb-6">
            Found something interesting but not ready to commit? Save courses here to easily find them later.
          </p>
          <Link to="/courses" className="btn btn-primary no-underline">Explore Catalog</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((course) => (
            <CourseCard key={course._id || course} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
