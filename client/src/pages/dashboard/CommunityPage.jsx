import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Send, User, Search, Filter, Hash, X } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const DiscussionCard = ({ post, onReplyClick, onUpvote }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const { user } = useSelector(s => s.auth);

  const fetchReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    setLoadingReplies(true);
    try {
      const { data } = await api.get(`/courses/discussions/${post._id}/replies`);
      setReplies(data.data);
      setShowReplies(true);
    } catch (err) {
      toast.error('Failed to load replies');
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    try {
      const { data } = await api.post('/courses/community/discussions', {
        content: newReply,
        parentId: post._id
      });
      setReplies([...replies, data.data]);
      setNewReply('');
      toast.success('Reply posted!');
    } catch (err) {
      toast.error('Failed to post reply');
    }
  };

  const isUpvoted = post.upvotes?.includes(user?._id);

  return (
    <div className="card p-6 hover:border-coral/20 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-coral overflow-hidden">
            {post.user?.avatar ? (
              <img src={post.user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              post.user?.name?.[0] || '?'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-primary text-sm">{post.user?.name || 'Unknown User'}</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-text-muted uppercase">
                {post.user?.role || 'student'}
              </span>
            </div>
            <span className="text-xs text-text-muted">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {post.tags?.map(tag => (
            <span key={tag} className="text-[10px] font-semibold text-coral bg-coral-light/30 px-2 py-1 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      {post.title && <h3 className="font-display text-xl text-text-primary mb-2">{post.title}</h3>}
      <p className="text-text-body text-sm leading-relaxed mb-6">{post.content}</p>
      
      <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
        <button 
          onClick={() => onUpvote(post._id)}
          className={`flex items-center gap-2 text-xs font-semibold transition-colors ${isUpvoted ? 'text-coral' : 'text-text-muted hover:text-coral'}`}
        >
          <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} /> {post.upvotes?.length || 0} Likes
        </button>
        <button 
          onClick={fetchReplies}
          className={`flex items-center gap-2 text-xs font-semibold transition-colors ${showReplies ? 'text-coral' : 'text-text-muted hover:text-coral'}`}
        >
          <MessageCircle className="w-4 h-4" /> {post.replies?.length || replies.length || 0} Replies
        </button>
        <button className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-coral transition-colors ml-auto">
          Share
        </button>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
          {loadingReplies ? (
            <div className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100" />
              <div className="flex-1 h-12 bg-gray-50 rounded-lg" />
            </div>
          ) : (
            <>
              {replies.map(reply => (
                <div key={reply._id} className="flex gap-3 pl-4 border-l-2 border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    {reply.user?.avatar ? <img src={reply.user.avatar} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xs font-bold">{reply.user?.name?.[0]}</span>}
                  </div>
                  <div className="flex-1 bg-gray-50/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text-primary text-xs">{reply.user?.name}</span>
                      <span className="text-[10px] text-text-muted">{new Date(reply.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-text-body">{reply.content}</p>
                  </div>
                </div>
              ))}
              
              <form onSubmit={handleReplySubmit} className="flex gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white text-xs flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 flex gap-2">
                  <input 
                    value={newReply}
                    onChange={e => setNewReply(e.target.value)}
                    placeholder="Write a reply..."
                    className="input flex-1 h-9 text-xs"
                  />
                  <button type="submit" className="btn btn-primary btn-sm px-3">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const { user } = useSelector(s => s.auth);

  const fetchDiscussions = async () => {
    try {
      const { data } = await api.get('/courses/community/discussions');
      setDiscussions(data.data);
    } catch (err) {
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    try {
      const tags = newPostTags.split(',').map(t => t.trim()).filter(t => t);
      const { data } = await api.post('/courses/community/discussions', {
        title: newPostTitle,
        content: newPostContent,
        tags
      });
      setDiscussions([data.data, ...discussions]);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostTags('');
      toast.success('Post created!');
    } catch (err) {
      toast.error('Failed to create post');
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const { data } = await api.post(`/courses/discussions/${postId}/upvote`);
      setDiscussions(prev => prev.map(p => {
        if (p._id === postId) {
          const upvotes = [...(p.upvotes || [])];
          const userId = user._id;
          const idx = upvotes.indexOf(userId);
          if (idx > -1) upvotes.splice(idx, 1);
          else upvotes.push(userId);
          return { ...p, upvotes };
        }
        return p;
      }));
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <SectionHeading title="Community Forum" subtitle="Discuss topics, ask questions, and share knowledge with peers." />
      
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-surface p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search discussions..." 
            className="input w-full pl-10 h-10 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm border-gray-200">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button className="btn btn-ghost btn-sm border-gray-200">
            <Hash className="w-4 h-4 mr-2" /> Tags
          </button>
        </div>
      </div>

      {/* New Post Input */}
      <form onSubmit={handlePost} className="card p-5 bg-coral-light/10 border-coral-light">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <input 
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Post Title (optional)"
              className="input w-full h-10 text-sm font-bold"
            />
            <textarea 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind? Ask a question or share an update..."
              className="input w-full min-h-[100px] py-3 resize-none bg-surface"
            />
            <div className="flex items-center justify-between gap-4">
              <input 
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                placeholder="Tags (comma separated: React, Help)"
                className="input h-9 text-xs flex-1"
              />
              <button type="submit" className="btn btn-primary btn-sm flex items-center gap-2">
                Post to Community <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Discussion List */}
      <div className="space-y-6">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="card p-6 h-40 animate-pulse bg-gray-50" />)
        ) : discussions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-3xl">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-text-muted">No discussions yet. Be the first to start one!</p>
          </div>
        ) : (
          discussions.map((post) => (
            <DiscussionCard 
              key={post._id} 
              post={post} 
              onUpvote={handleUpvote}
            />
          ))
        )}
      </div>
    </div>
  );
}
