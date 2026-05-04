import React, { useEffect, useState } from 'react';
import { getCurrentUserProfile, updateProfile } from "../services/userService";
import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button';
import Avatar from '../components/UI/Avatar';
import Card from '../components/UI/Card';  

import InputField from '../components/UI/InputField';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);  // selected file
  
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    twitter: "",
    linkedin: "",
    github: ""
  });

  useEffect(() => {
    const apicall = async () => {
      try {
        const data = await getCurrentUserProfile();
        setProfile(data.profile);
        setFormData({
          username: data.profile.username || "",
          bio: data.profile.bio || "",
          twitter: data.profile.socialLinks?.twitter || "",
          linkedin: data.profile.socialLinks?.linkedin || "",
          github: data.profile.socialLinks?.github || ""
        });

      } catch (err) {
        setProfile({
          username: 'Demo_User',
          bio: 'Frontend developer and UI enthusiast building modern web applications.',
          postsCount: 15,
          socialLinks: {}
        });
      }
    };
    apicall();
  }, []);

  if (!profile) return <div className="text-center py-20 text-slate-500">Loading Profile...</div>;

  const links = [
    { name: "Twitter", url: profile.socialLinks?.twitter },
    { name: "LinkedIn", url: profile.socialLinks?.linkedin },
    { name: "GitHub", url: profile.socialLinks?.github },
  ]

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setPhotoFile(e.target.files[0] || null);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Build FormData so multer can parse text fields + the file together
      const fd = new FormData();
      fd.append("username", formData.username);
      fd.append("bio", formData.bio);
      fd.append("socialLinks[twitter]", formData.twitter);
      fd.append("socialLinks[linkedin]", formData.linkedin);
      fd.append("socialLinks[github]", formData.github);
      if (photoFile) fd.append("profilepic", photoFile);

      const data = await updateProfile(fd);
      setProfile(data.profile);
      setPhotoFile(null);
      setOpenModal(false);
    } catch (err) {
      // Show the real error message from the backend
      const msg = err?.response?.data?.message || err?.message || "Unknown error";
      console.error("Profile update failed:", msg);
      setOpenModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      
      {/* Cover Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-brand-500 to-cyan-400 rounded-3xl relative">
        <div className="absolute top-6 right-6">
          <Button onClick={() => setOpenModal(true)} variant="secondary" className="shadow-sm border-0 bg-white/90 backdrop-blur">
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-6 md:px-12 -mt-20 sm:-mt-24 flex flex-col sm:flex-row gap-6 items-center sm:items-end relative z-10">
        <div className="p-1.5 bg-surface-dim rounded-full">
          <Avatar src={profile.profilePic} fallback={profile.username} size="xl" />
        </div>
        <div className="flex-1 text-center sm:text-left mb-2">
          <h1 className="text-3xl font-display font-bold text-slate-900">{profile.username}</h1>
          <p className="text-slate-500 font-medium">@{profile.username.toLowerCase()}</p>
        </div>
        <div className="flex gap-6 mb-2 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 w-full sm:w-auto justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{profile.postsCount || 0}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Posts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">About</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              {profile.bio || "No bio added yet. Tell the world about yourself!"}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Links</h2>
            {links.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-brand-600 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/></svg>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">No social links added</p>
            )}
          </Card>
        </div>

        {/* User Posts Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mocking posts since backend endpoint is missing */}
            {[1, 2].map(i => (
              <Card key={i} hoverable className="p-0 overflow-hidden flex flex-col h-full">
                <div className="h-40 bg-slate-200">
                  <img src={`https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80&sig=${i}`} alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">My amazing blog post {i}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">This is a placeholder for the user's recent posts. The UI is designed to look great with or without data.</p>
                  <div className="text-brand-600 text-sm font-medium hover:underline cursor-pointer">Read more →</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Edit Profile">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-slate-700">Profile Photo</label>
            <div className="flex items-center gap-4">
              <Avatar src={profile.profilePic} fallback={profile.username} size="lg" />
              <input 
                type="file" 
                accept="image/*" 
                name='profilepic'
                onChange={handleFileChange}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 transition-all cursor-pointer" 
              />
            </div>
          </div>
          <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} />
          <InputField label="Bio" type="textarea" name="bio" value={formData.bio} onChange={handleChange} rows="3" />
          
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Social Links</h3>
            <div className="flex flex-col gap-4">
              <InputField type="url" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter URL" />
              <InputField type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
              <InputField type="url" name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="ghost" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}