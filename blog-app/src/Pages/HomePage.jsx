import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../components/UI/Avatar";
import Card from "../components/UI/Card";
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

function FeedCard({ post }) {
  const preview = extractPostPreview(post.content || "");
  const authorId = post.author?.id || post.author?._id || "demo";
  const mediaUrl = post.image || post.mediaUrl || post.videoUrl || post.audioUrl || post.gifUrl;

  return (
    <Card className="overflow-hidden p-0 hoverable border-white/10">
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <Link to={`/user/${authorId}`} className="flex items-center gap-3">
            <Avatar src={post.author?.profilePic} fallback={post.author?.name} size="md" />
            <div>
              <p className="text-sm font-semibold text-zinc-100">{post.author?.name || "Community member"}</p>
              <p className="text-xs text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </Link>
          <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
            {post.category || "Article"}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-3xl font-bold text-zinc-100 sm:text-4xl">
            <Link to={`/post/${post._id}`} className="hover:text-brand-200">{post.title}</Link>
          </h2>
          <p className="text-sm leading-7 text-zinc-400">{preview.text || "No preview available."}</p>
        </div>

        {mediaUrl && (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <img src={mediaUrl} alt={post.title} className="h-72 w-full object-cover" />
          </div>
        )}

        {preview.type === "code" && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
            <div className="border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Code snippet</div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-zinc-200"><code>{preview.value}</code></pre>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          <span className="rounded-xl border border-white/10 bg-black px-3 py-1.5 text-xs text-zinc-400">{post.likes?.length || 0} likes</span>
          <span className="rounded-xl border border-white/10 bg-black px-3 py-1.5 text-xs text-zinc-400">{post.comments?.length || 0} comments</span>
          <span className="rounded-xl border border-white/10 bg-black px-3 py-1.5 text-xs text-zinc-400">{post.views?.length || 0} views</span>
          <Link to={`/post/${post._id}`} className="ml-auto rounded-xl bg-brand-400 px-3 py-1.5 text-xs font-semibold text-black hover:bg-brand-300">
            Read
          </Link>
        </div>
      </div>
    </Card>
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
        <div className="space-y-5">
          {visiblePosts.map((post) => (
            <FeedCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
