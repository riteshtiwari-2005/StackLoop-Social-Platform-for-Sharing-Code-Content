import React, { useEffect, useState } from "react";
import { getAllPosts } from "../services/postService";
import { Link } from "react-router-dom";
import Card from "../components/UI/Card";
import Avatar from "../components/UI/Avatar";
import Skeleton from "../components/UI/Skeleton";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Technology", "Design", "Programming", "Lifestyle", "Business"];
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data.posts || []);
      } catch (err) {
        // Fallback data
        setPosts([
          { _id: '1', title: 'The Future of Frontend Architecture', content: 'Exploring the new wave of React server components and how they will shape the web...', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', author: { id: 'user1', name: 'Alex Johnson', profilePic: 'https://i.pravatar.cc/150?u=user1' }, createdAt: new Date().toISOString(), category: 'Programming' },
          { _id: '2', title: 'Minimalist Design Systems', content: 'Why less is more when it comes to designing enterprise applications...', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', author: { id: 'user2', name: 'Sarah Lee', profilePic: 'https://i.pravatar.cc/150?u=user2' }, createdAt: new Date().toISOString(), category: 'Design' },
          { _id: '3', title: 'Building Scalable APIs', content: 'Best practices for REST and GraphQL in modern startups...', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', author: { id: 'user3', name: 'Mike Chen' }, createdAt: new Date().toISOString(), category: 'Technology' },
          { _id: '4', title: 'Remote Work Productivity', content: 'How to maintain focus and balance while working from anywhere...', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80', author: { id: 'user4', name: 'Emma Watson' }, createdAt: new Date().toISOString(), category: 'Lifestyle' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);
  const trendingPosts = [...posts].reverse().slice(0, 3); // mock trending

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-10">
        
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? "bg-slate-800 text-white" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-500 rounded-full inline-block"></span>
            Featured Article
          </h2>
          {loading ? (
            <Skeleton type="card" className="h-[400px]" />
          ) : featuredPost ? (
            <Link to={`/post/${featuredPost._id}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden h-[400px]">
                {featuredPost.image && (
                  <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white w-full max-w-3xl">
                  <span className="px-3 py-1 bg-brand-500 text-xs font-bold uppercase tracking-wider rounded-full mb-4 inline-block">
                    {featuredPost.category || 'Featured'}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-display font-bold mb-4 leading-tight group-hover:text-brand-300 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar src={featuredPost.author?.profilePic} fallback={featuredPost.author?.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{featuredPost.author?.name}</p>
                      <p className="text-xs text-slate-300">
                        {new Date(featuredPost.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}
        </section>

        {/* Recent Posts Grid */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-slate-800 rounded-full inline-block"></span>
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              Array.from({length: 4}).map((_, i) => <Skeleton key={i} type="card" />)
            ) : (
              recentPosts.map(post => (
                <Card key={post._id} hoverable className="flex flex-col h-full p-0 overflow-hidden">
                  {post.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">
                      {post.category || 'Article'}
                    </span>
                    <h3 className="text-xl font-display font-bold mb-3 text-slate-900 line-clamp-2">
                      <Link to={`/post/${post._id}`} className="hover:text-brand-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-slate-600 mb-6 line-clamp-3 flex-1 text-sm">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                      <Link to={`/user/${post.author?.id || 'demo'}`}>
                        <Avatar src={post.author?.profilePic} fallback={post.author?.name} size="sm" />
                      </Link>
                      <div>
                        <p className="text-sm font-medium text-slate-900 hover:text-brand-600">
                          <Link to={`/user/${post.author?.id || 'demo'}`}>{post.author?.name}</Link>
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

      </div>

      {/* Sidebar (Trending) */}
      <aside className="w-full lg:w-80 flex flex-col gap-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-24">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            Trending Now
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </h2>
          
          <div className="flex flex-col gap-6">
            {loading ? (
              Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton type="text" className="w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="w-full">
                    <Skeleton type="text" className="mb-2" />
                    <Skeleton type="text" className="w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              trendingPosts.map((post, idx) => (
                <Link key={post._id} to={`/post/${post._id}`} className="group flex gap-4 items-start">
                  <span className="text-3xl font-display font-bold text-slate-200 group-hover:text-brand-200 transition-colors leading-none">
                    0{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-1">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100 text-center">
          <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Subscribe to Newsletter</h3>
          <p className="text-sm text-slate-600 mb-4">Get the latest posts delivered right to your inbox.</p>
          <input type="email" placeholder="Your email address" className="w-full px-4 py-2 rounded-lg border border-slate-200 mb-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
          <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            Subscribe
          </button>
        </div>
      </aside>

    </div>
  );
}
