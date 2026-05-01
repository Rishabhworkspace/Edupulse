import { useState } from 'react';
import { Star } from 'lucide-react';

export default function CourseReviews({ reviews, isEnrolled, onSubmitReview }) {
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmitReview(newReview);
    setShowModal(false);
    setNewReview({ rating: 5, comment: '' });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Student Reviews</h3>
        {isEnrolled && (
          <button onClick={() => setShowModal(true)} className="btn btn-secondary btn-sm">Leave a Review</button>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this course!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {review.user?.avatar ? (
                    <img src={review.user.avatar} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="font-bold text-primary text-xs">{review.user?.name?.[0]}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{review.user?.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-secondary fill-secondary' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
              {review.comment && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Leave a Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button type="button" key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="bg-transparent border-none cursor-pointer">
                      <Star className={`w-8 h-8 ${star <= newReview.rating ? 'text-secondary fill-secondary' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Comment (optional)</label>
                <textarea
                  className="input min-h-[100px] py-2"
                  placeholder="Share your experience with this course..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}