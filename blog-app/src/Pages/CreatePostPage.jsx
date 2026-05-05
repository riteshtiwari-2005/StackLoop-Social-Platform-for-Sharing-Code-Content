import React, { useState } from "react";
import { createPost } from "../services/postService";
import Button from "../components/UI/Button";
import InputField from "../components/UI/InputField";
import Toast from "../components/UI/Toast";

export default function CreatePostPage() {
  const [formData, setFormData] = useState({ title: "", content: "", image: null, category: "Technology", isPremium: false });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const categories = ["Technology", "Design", "Programming", "Lifestyle", "Business"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("category", formData.category);
      data.append("isPremium", formData.isPremium);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await createPost(data);
      setToast({ message: "Post published successfully!", type: "success" });
      setFormData({ title: "", content: "", image: null, category: "Technology", isPremium: false });
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to publish post";
      setToast({ message: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Create New Post</h1>
        <p className="text-slate-600">Share your thoughts with the community</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" encType="multipart/form-data">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <InputField 
                label="Post Title" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Enter an engaging title..." 
                required 
                className="text-lg font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="flex items-center h-5">
              <input
                id="isPremium"
                name="isPremium"
                type="checkbox"
                checked={formData.isPremium}
                onChange={handleChange}
                className="w-5 h-5 text-brand-600 border-slate-300 rounded focus:ring-brand-500 transition-all cursor-pointer"
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="isPremium" className="font-bold text-amber-900 cursor-pointer">Premium Content</label>
              <p className="text-amber-700">Checking this will make the post exclusive to premium subscribers.</p>
            </div>
          </div>

          <InputField 
            label="Cover Image" 
            id="image" 
            name="image" 
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} 
          />

          {formData.image && (
            <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-200">
              <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="content" className="text-sm font-medium text-slate-700">Content</label>
              <div className="flex gap-2">
                {/* Mock rich text toolbar */}
                {['B', 'I', 'U', 'H1', 'H2', '"'].map(tool => (
                  <button key={tool} type="button" className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center text-slate-600 font-serif text-sm font-bold">
                    {tool}
                  </button>
                ))}
              </div>
            </div>
            <InputField 
              id="content" 
              name="content" 
              type="textarea"
              value={formData.content} 
              onChange={handleChange} 
              placeholder="Write your story here..." 
              required 
              rows="12"
              className="font-serif text-lg leading-relaxed resize-y min-h-[300px]"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4 pt-6 border-t border-slate-100">
            <Button type="button" variant="ghost">Save Draft</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish Post"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}