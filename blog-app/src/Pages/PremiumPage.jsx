import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPremiumPosts, likePost } from "../services/postService";
import { buyrazorpay } from "../services/paymentService";
import Card from "../components/UI/Card";
import Avatar from "../components/UI/Avatar";
import Button from "../components/UI/Button";

export default function PremiumPage() {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || user?._id || user?.user?.id || user?.user?._id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);
      const data = await getPremiumPosts();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setAccessDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!userId) return;

    setPosts(currentPosts => currentPosts.map(p => {
      if (p._id === postId) {
        const hasLiked = p.likes?.includes(userId);
        const newLikes = hasLiked 
          ? p.likes.filter(id => id !== userId)
          : [...(p.likes || []), userId];
        return { ...p, likes: newLikes };
      }
      return p;
    }));

    try {
      await likePost(postId);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  if (accessDenied) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="mb-10 inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 text-amber-600 animate-bounce">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Unlock Premium Content</h1>
        <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto">
          It looks like you've reached a premium article. Join our community of experts to get full access to deep dives, guides, and tutorials.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="primary" size="lg" onClick={buyrazorpay} className="px-8 py-4 text-lg shadow-xl shadow-brand-500/20">
            Get Premium Now — ₹500
          </Button>
          <Link to="/dashboard" className="text-slate-500 hover:text-brand-600 font-medium transition-colors">
            Back to Free Feed
          </Link>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: "Expert Content", desc: "Articles written by industry leaders and experienced developers.", icon: "🎯" },
            { title: "No Ads", desc: "Enjoy a completely ad-free reading experience on the entire platform.", icon: "🚫" },
            { title: "Priority Support", desc: "Get your questions answered faster by our dedicated support team.", icon: "⚡" }
          ].map(feature => (
            <div key={feature.title} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="relative mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              Premium Library
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Exclusive Content</h1>
            <p className="text-slate-300 text-lg max-w-xl">Deep dives, expert guides, and advanced tutorials for our premium community members.</p>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500 shadow-2xl">
              <span className="text-6xl">💎</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-96 rounded-2xl bg-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-6xl mb-6">🏜️</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No Premium Posts Yet</h3>
          <p className="text-slate-500">Check back soon for exclusive content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post._id} hoverable className="group flex flex-col h-full overflow-hidden border-slate-100 hover:border-amber-200 transition-all duration-300">
              <div className="relative h-56 -mx-6 -mt-6 mb-6 overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-amber-500/40">Premium</span>
                </div>
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">{post.category || 'EXPERT'}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-xs text-slate-500">Premium Insight</span>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                  <Link to={`/post/${post._id}`}>{post.title}</Link>
                </h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">{post.content}</p>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <Link to={`/user/${post.author?.username || 'demo_user'}`} className="flex items-center gap-2">
                    <Avatar src={post.author?.profilePic} fallback={post.author?.name || "U"} size="xs" />
                    <span className="text-xs font-semibold text-slate-700">{post.author?.name || "Expert"}</span>
                  </Link>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleLike(post._id)} className={`flex items-center gap-1 text-xs font-medium transition-colors ${post.likes?.includes(userId) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
                      <svg className="w-4 h-4" fill={post.likes?.includes(userId) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      {post.likes?.length || 0}
                    </button>
                    <Link to={`/post/${post._id}`} className="text-amber-600">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4 4H3" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
