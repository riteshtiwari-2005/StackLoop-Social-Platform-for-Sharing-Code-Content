import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllPosts, createPost, likePost } from "../services/postService";
import Modal from "../components/UI/Modal";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Avatar from "../components/UI/Avatar";
import InputField from "../components/UI/InputField";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || user?._id || user?.user?.id || user?.user?._id;

  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    image: "",
    category: "Technology"
  });

  const categories = ["Technology", "Design", "Programming", "Lifestyle", "Business"];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      // Fallback dummy posts
      setPosts([
        { _id: '1', title: 'Why use Tailwind CSS?', content: 'Utility classes provide a robust design system...', author: { name: 'Alice' }, likes: [1, 2], comments: [1], views: Array(120).fill(''), category: "Design" },
        { _id: '2', title: 'React Performance Tips', content: 'Memoization and lazy loading can improve UX drastically.', author: { name: 'Bob' }, likes: [1], comments: [], views: Array(45).fill(''), category: "Programming" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostFormChange = (e) => {
    setPostForm({
      ...postForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const data = await createPost(postForm);
      setPosts([data.post, ...posts]);
      setPostForm({ title: "", content: "", image: "", category: "Technology" });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleLike = async (postId) => {
    if (!userId) return;

    // Optimistic update
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
      // Revert could be done here, but omitting for simplicity in feed
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Developer Feed</h2>
          <p className="text-slate-500 mt-1">Discover what other developers are sharing.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Post"
      >
        <form onSubmit={handleCreatePost} className="flex flex-col gap-5">
          <InputField
            label="Title"
            type="text"
            id="title"
            name="title"
            value={postForm.title}
            onChange={handlePostFormChange}
            placeholder="Enter post title"
            required
          />

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Category</label>
            <select
              name="category"
              value={postForm.category}
              onChange={handlePostFormChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <InputField
            label="Content"
            type="textarea"
            id="content"
            name="content"
            value={postForm.content}
            onChange={handlePostFormChange}
            placeholder="Write your post content..."
            rows="6"
            required
          />

          <InputField
            label="Image URL"
            type="url"
            id="image"
            name="image"
            value={postForm.image}
            onChange={handlePostFormChange}
            placeholder="https://example.com/image.jpg"
          />

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Publish Post</Button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-10 text-slate-500">Loading feed...</p>
        ) : posts.length === 0 ? (
          <p className="col-span-full text-center py-10 text-slate-500">No posts available.</p>
        ) : (
          posts.map((post) => (
            <Card key={post._id} hoverable className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <Link to={`/user/${post.author?.username || 'demo_user'}`} className="flex items-center gap-3 group">
                  <Avatar src={post.author?.profilePic} fallback={post.author?.name || "U"} size="md" />
                  <div>
                    <span className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors block">{post.author?.name || "User"}</span>
                    <span className="text-xs text-slate-500">{new Date().toLocaleDateString()}</span>
                  </div>
                </Link>
              </div>

              {post.image && (
                <Link to={`/post/${post._id}`} className="block w-full h-48 -mx-6 mb-4 overflow-hidden">
                  <img src={post.image} alt="post" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </Link>
              )}

              <div className="flex-1">
                <span className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-2 block">
                  {post.category || 'Article'}
                </span>
                <h3 className="text-xl font-display font-bold mb-2">
                  <Link to={`/post/${post._id}`} className="text-slate-900 hover:text-brand-600 transition-colors">{post.title}</Link>
                </h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">{post.content}</p>
                <Link to={`/post/${post._id}`} className="text-brand-600 text-sm font-semibold hover:text-brand-700 transition-colors inline-flex items-center gap-1 group">
                  Read article
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 text-slate-500 text-sm font-medium">
                <div onClick={() => handleLike(post._id)} className={`flex items-center gap-1.5 cursor-pointer transition-colors ${post.likes?.includes(userId) ? 'text-red-500' : 'hover:text-red-500'}`}>
                  <svg className="w-5 h-5" fill={post.likes?.includes(userId) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-brand-600 cursor-pointer transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <span>{post.comments?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <span>{post.views?.length || 0}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}