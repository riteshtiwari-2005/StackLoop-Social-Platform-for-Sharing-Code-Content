import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../components/UI/Avatar";
import Card from "../components/UI/Card";
import CodeSnippetWindow from "../components/UI/CodeSnippetWindow";
import Skeleton from "../components/UI/Skeleton";
import { getAllPosts } from "../services/postService";

function extractPostPreview(content = "") {
  const fenceMatch = content.match(/```([\s\S]*?)```/);
  if (fenceMatch) {
    return {
      type: "code",
      value: fenceMatch[1].trim(),
      text: content.replace(fenceMatch[0], "").trim(),
    };
  }

  return {
    type: "text",
    value: content.trim(),
    text: content.trim(),
  };
}

const UpvoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
);
const CommentIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
);
const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);

function FeedCard({ post }) {
  const preview = extractPostPreview(post.content || "");
  const authorId = post.author?.id || post.author?._id || "demo";
  const mediaUrl = post.image || post.mediaUrl || post.videoUrl || post.audioUrl || post.gifUrl;
  const username = post.author?.username || post.author?.name?.toLowerCase().replace(/\s+/g, '') || "user";
  const hasUpvoted = post.likes && post.likes.length > 0;

  return (
    <div className="py-6 sm:py-8 first:pt-0 border-b border-white/[0.08] last:border-0">
      <div className="flex items-start gap-4">
        <Link to={`/user/${authorId}`} className="shrink-0 mt-0.5">
          {post.author?.profilePic ? (
            <img src={post.author.profilePic} alt={post.author?.name} className="h-11 w-11 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-900 font-semibold text-zinc-100">
              {post.author?.name ? post.author.name.slice(0, 1).toUpperCase() : "?"}
            </div>
          )}
        </Link>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-1.5 text-[15px] leading-tight">
            <Link to={`/user/${authorId}`} className="font-bold text-zinc-100 hover:underline">
              {post.author?.name || "Community member"}
            </Link>
            <span className="text-zinc-500">
              @{username} • Follow
            </span>
          </div>

          <div className="text-[15px] leading-relaxed">
            <Link to={`/post/${post._id}`} className="hover:opacity-80 transition-opacity">
              <span className="font-bold text-zinc-100">{post.title}</span>
              {" "}
              <span className="text-zinc-400">— {preview.text || "No preview available."}</span>
            </Link>
          </div>

          {mediaUrl && (
            <div className="mt-3 overflow-hidden rounded-[1.25rem] border border-white/[0.05]">
              <img src={mediaUrl} alt={post.title} className="w-full object-cover max-h-[500px]" />
            </div>
          )}

          {preview.type === "code" && (
            <div className="mt-3 overflow-hidden rounded-[1.25rem] border border-white/[0.05]">
              <CodeSnippetWindow code={preview.value} maxHeight={300} />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-5 sm:gap-7">
              <button className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-bold transition-colors ${hasUpvoted ? 'bg-zinc-100 text-black hover:bg-white' : 'bg-transparent border border-white/20 text-zinc-100 hover:bg-white/10'}`}>
                <UpvoteIcon />
                <span>{post.likes?.length ? `${post.likes.length} Point${post.likes.length !== 1 ? 's' : ''}` : 'Upvote'}</span>
              </button>
              
              <button className="flex items-center gap-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                <CommentIcon />
                <span>Comment</span>
              </button>
              
              <button className="flex items-center gap-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                <EyeIcon />
                <span>{post.views?.length || 593} Views</span>
              </button>
            </div>
            
            <div className="flex items-center gap-5">
              <button className="flex items-center gap-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                <ShareIcon />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex items-center text-zinc-400 hover:text-zinc-200 transition-colors">
                <MoreIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Technology", "Design", "Programming", "Lifestyle", "Business"];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data.posts || []);
      } catch {
        setPosts([
          {
            _id: "1",
            title: "Inside a Fast Frontend Workflow",
            content: "How teams reduce context switching with modular tooling and reliable UI primitives.",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
            author: { id: "user1", name: "Nadia", profilePic: "https://i.pravatar.cc/150?u=user1" },
            createdAt: new Date().toISOString(),
            category: "Programming",
            comments: [1, 2],
            views: Array(81).fill(0),
            likes: [1, 2, 3],
          },
          {
            _id: "2",
            title: "Designing Minimal Interfaces that Still Feel Premium",
            content: "This article explores spacing, rhythm, and contrast choices in all-black products.",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
            author: { id: "user2", name: "Arjun", profilePic: "https://i.pravatar.cc/150?u=user2" },
            createdAt: new Date().toISOString(),
            category: "Design",
            comments: [1],
            views: Array(52).fill(0),
            likes: [1],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const visiblePosts = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((post) => (post.category || "").toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory, posts]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-brand-300/20 bg-gradient-to-br from-zinc-950 via-zinc-950 to-brand-900/20 p-0">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <span className="app-chip">Signal Feed</span>
            <h1 className="section-title">Build. Share. Iterate.</h1>
            <p className="section-copy max-w-2xl">
              Discover high-signal posts from developers and designers. Clean layout, fast reading, and practical ideas.
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${
                    activeCategory === category
                      ? "border-brand-300/50 bg-brand-300/20 text-brand-100"
                      : "border-white/10 bg-black text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Posts", value: visiblePosts.length }, { label: "Total", value: posts.length }, { label: "Mode", value: "Live" }, { label: "Theme", value: "Noir" }].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-black/60 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
                <p className="mt-2 text-xl font-bold text-zinc-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} type="card" className="h-64" />
          ))}
        </div>
      ) : visiblePosts.length === 0 ? (
        <Card className="py-16 text-center">
          <h2 className="font-display text-4xl text-zinc-100">No posts in this lane yet</h2>
          <p className="mt-2 text-zinc-500">Switch category or publish a fresh post to populate this stream.</p>
          <button onClick={() => setActiveCategory("All")} className="mt-5 rounded-xl bg-brand-400 px-4 py-2 text-sm font-semibold text-black hover:bg-brand-300">
            Show all
          </button>
        </Card>
      ) : (
        <div className="flex flex-col border-t border-white/[0.08] pt-6 sm:pt-8">
          {visiblePosts.map((post) => (
            <FeedCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
