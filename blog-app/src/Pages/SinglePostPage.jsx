import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPostById, getCommentsByPostId, createComment, likePost } from '../services/postService';
import Avatar from '../components/UI/Avatar';
import Skeleton from '../components/UI/Skeleton';
import Toast from '../components/UI/Toast';

// Dummy pool of seed comments to make each post feel alive
const SEED_COMMENTS = [
  { id: 's1', author: "Priya Sharma", profilePic: "https://i.pravatar.cc/150?u=priya", text: "This is an incredibly well-written piece. You've laid out the ideas in such a clear and actionable way.", date: new Date(Date.now() - 3600000 * 6).toISOString(), likes: 12 },
  { id: 's2', author: "James Carter", profilePic: "https://i.pravatar.cc/150?u=james", text: "I've been following this topic for months and this is by far the most nuanced take I've found. Bookmarked!", date: new Date(Date.now() - 3600000 * 14).toISOString(), likes: 8 },
  { id: 's3', author: "Aisha Yusuf", profilePic: "https://i.pravatar.cc/150?u=aisha", text: "Really resonated with me. The point about repeatable systems over motivation is something I needed to hear today.", date: new Date(Date.now() - 3600000 * 28).toISOString(), likes: 5 },
];

function timeAgo(dateString) {
  const diff = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function SinglePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || user?._id || user?.user?.id || user?.user?._id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Like state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Comment state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data.post);
        setLikeCount(data.post.likes?.length || 0);
        if (userId && data.post.likes) {
          setLiked(data.post.likes.includes(userId));
        }
        
        try {
          const commentsData = await getCommentsByPostId(id);
          if (commentsData.comments && commentsData.comments.length > 0) {
            const formattedComments = commentsData.comments.map(c => ({
              id: c._id,
              author: c.user?.name || 'Unknown',
              profilePic: null,
              text: c.text,
              date: c.createdAt,
              likes: 0,
              isNew: false
            }));
            setComments(formattedComments);
          } else {
            setComments([]);
          }
        } catch (e) {
          setComments(SEED_COMMENTS);
        }
      } catch {
        const dummy = {
          _id: id,
          title: "The Future of Web Development",
          content: "Web development is constantly evolving. The industry has shifted dramatically over the past decade—from jQuery-heavy monoliths to component-driven micro-frontends.\n\nConsistency does not come from motivation. It comes from designing a repeatable process with clear triggers, small milestones, and realistic publishing goals.\n\nStart by choosing one weekly publishing day, then break your workflow into idea capture, outline, draft, and edit. This reduces friction and helps you stay focused.\n\nThe era of complex tooling is making way for streamlined, developer-centric frameworks that prioritise the developer experience first and performance second.",
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          category: "Technology",
          author: { id: "demo", name: "Alex Johnson", profilePic: "https://i.pravatar.cc/150?u=demo" },
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          readTime: "5 min read",
          likes: [1, 2, 3, 4, 5],
        };
        setPost(dummy);
        setLikeCount(dummy.likes.length);
        if (userId && dummy.likes) {
          setLiked(dummy.likes.includes(userId));
        }
        setComments(SEED_COMMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      setToast({ message: "Please log in to like this post", type: "error" });
      return;
    }

    // Optimistic UI update
    if (liked) {
      setLiked(false);
      setLikeCount(c => c - 1);
      setToast({ message: "Like removed", type: "info" });
    } else {
      setLiked(true);
      setLikeCount(c => c + 1);
      setToast({ message: "You liked this post! ❤️", type: "success" });
    }

    try {
      await likePost(id);
    } catch (error) {
      // Revert optimistic update on error
      if (liked) {
        setLiked(true);
        setLikeCount(c => c + 1);
      } else {
        setLiked(false);
        setLikeCount(c => c - 1);
      }
      setToast({ message: "Failed to update like status", type: "error" });
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);

    try {
      const result = await createComment(id, commentText.trim());
      const newCommentData = result.commentsaved;
      const newComment = {
        id: newCommentData._id,
        author: newCommentData.user?.name || "You",
        profilePic: null,
        text: newCommentData.text,
        date: newCommentData.createdAt,
        likes: 0,
        isNew: true,
      };
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      setToast({ message: "Comment posted successfully!", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to post comment", type: "error" });
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToast({ message: "Link copied to clipboard!", type: "info" });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <Skeleton type="image" className="h-[420px] rounded-3xl" />
        <div className="space-y-4 px-4">
          <Skeleton type="text" className="h-4 w-24 rounded-full" />
          <Skeleton type="title" className="h-10 w-3/4" />
          <Skeleton type="text" />
          <Skeleton type="text" />
          <Skeleton type="text" className="w-2/3" />
        </div>
      </div>
    );
  }

  if (!post) return (
    <div className="text-center py-32 text-slate-400 flex flex-col items-center gap-4">
      <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-lg font-medium text-slate-500">Post not found</p>
      <button onClick={() => navigate(-1)} className="text-brand-600 hover:underline font-medium">Go back</button>
    </div>
  );

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <article className="max-w-4xl mx-auto">

        {/* Cover Image */}
        {post.image && (
          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-0 shadow-sm">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="bg-white rounded-b-3xl border border-slate-100 shadow-sm px-8 md:px-16 lg:px-24 py-12">

          {/* Category + meta */}
          <div className="flex items-center gap-3 mb-6">
            {post.isPremium && (
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                Premium
              </span>
            )}
            <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider rounded-full">
              {post.category || 'Article'}
            </span>
            <span className="text-slate-400 text-sm">·</span>
            <span className="text-slate-500 text-sm">{post.readTime || '4 min read'}</span>
            <span className="text-slate-400 text-sm">·</span>
            <span className="text-slate-500 text-sm">{post.views?.length || 0} views</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight mb-8">
            {post.title}
          </h1>

          {/* Author row */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-slate-100 mb-8">
            <Link to={`/user/${post.author?.id || 'demo'}`} className="flex items-center gap-3 group">
              <Avatar src={post.author?.profilePic} fallback={post.author?.name} size="md" />
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                  {post.author?.name}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm text-slate-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>

          {/* Body Content */}
          <div className="text-slate-700 text-lg leading-relaxed space-y-6 mb-12">
            {post.content.split('\n').map((paragraph, idx) =>
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
            )}
          </div>

          {/* Like / Comment / Share Bar */}
          <div className="flex items-center gap-3 py-6 border-y border-slate-100">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-medium text-sm transition-all duration-200 ${
                liked
                  ? 'bg-red-50 text-red-500 border-red-200 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
              }`}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-150 ${liked ? 'scale-110' : 'scale-100'}`}
                fill={liked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            {/* Comment scroll shortcut */}
            <a
              href="#comments"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 font-medium text-sm transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{comments.length} Comments</span>
            </a>

            <div className="ml-auto">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 font-medium text-sm transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>

          {/* ===================== COMMENTS SECTION ===================== */}
          <section id="comments" className="mt-12">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">
              Discussion <span className="text-slate-400 font-sans font-normal text-lg">({comments.length})</span>
            </h2>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-4 mb-10 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <Avatar size="md" fallback="You" />
              <div className="flex-1 flex flex-col gap-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none text-sm"
                  placeholder="Share your thoughts on this article..."
                  rows="3"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={commentLoading || !commentText.trim()}
                    className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {commentLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Posting...
                      </>
                    ) : 'Post Comment'}
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-5">
              {comments.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="font-medium">No comments yet. Start the discussion!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex gap-4 group ${comment.isNew ? 'animate-pulse-once' : ''}`}
                  >
                    <Avatar src={comment.profilePic} fallback={comment.author} size="md" />
                    <div className="flex-1">
                      <div className={`p-5 rounded-2xl border shadow-sm transition-colors ${comment.isNew ? 'bg-brand-50 border-brand-100' : 'bg-white border-slate-100'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm">{comment.author}</span>
                            {comment.isNew && (
                              <span className="px-2 py-0.5 text-xs bg-brand-100 text-brand-700 rounded-full font-medium">Just now</span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{timeAgo(comment.date)}</span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{comment.text}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 ml-1 text-xs text-slate-400 font-medium">
                        <button className="hover:text-brand-600 transition-colors flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {comment.likes || 0}
                        </button>
                        <button className="hover:text-brand-600 transition-colors">Reply</button>
                        <button className="hover:text-red-500 transition-colors">Report</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Back navigation */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to feed
            </button>
          </div>

        </div>
      </article>
    </>
  );
}
