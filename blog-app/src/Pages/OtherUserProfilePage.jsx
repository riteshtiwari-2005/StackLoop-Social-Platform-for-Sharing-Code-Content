import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Avatar from '../components/UI/Avatar';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import axios from '../services/api';

export default function OtherUserProfilePage() {
    const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setprofile] = useState({
  })
   const [post,setpost]=useState([])

  // Simple local state — no localStorage, no API, no useEffect
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(128);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => {
      setFollowerCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };
  useEffect(() => {
    const fetchuser = async () => {
      try {
        const resposne = await axios.get(`/auth/v1/postuser/${id}`)
        const otherapi=await axios.post(`/auth/v1/recentpost/${id}`)
        console.log(otherapi.data.postdata);
        setprofile(resposne.data.user)
        setpost(otherapi.data.postdata)

        console.log("recent post"+post)

      } catch (error) {
        console.log(error);
      }

    }
    fetchuser();

  }, [])
  // Static dummy profile


  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">

      {/* Cover Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-slate-800 via-slate-700 to-brand-700 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Header */}
      <div className="px-6 md:px-12 -mt-20 sm:-mt-24 flex flex-col sm:flex-row gap-6 items-center sm:items-end relative z-10">
        <div className="p-1.5 bg-slate-50 rounded-full ring-4 ring-white shadow-md">
          <Avatar src={profile.profilePic} fallback={profile.username} size="xl" />
        </div>

        <div className="flex-1 text-center sm:text-left mb-2 flex justify-between items-end w-full gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">{profile.username}</h1>
            <p className="text-slate-500 font-medium">@{profile.username}</p>
          </div>

          <Button
            onClick={handleFollowToggle}
            variant={isFollowing ? "secondary" : "primary"}
            className="hidden sm:flex items-center gap-2"
          >
            {isFollowing ? (
              <>✓ Following</>
            ) : (
              <>+ Follow</>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile follow button */}
      <div className="sm:hidden px-6">
        <Button
          onClick={handleFollowToggle}
          variant={isFollowing ? "secondary" : "primary"}
          className="w-full justify-center"
        >
          {isFollowing ? "✓ Following" : "+ Follow"}
        </Button>
      </div>

      {/* Stats & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">

        {/* Sidebar */}
        <div className="flex flex-col gap-6">

          {/* Stats */}
          <div className="flex bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {[
              { label: "Posts", value: profile.postsCount },
              { label: "Followers", value: followerCount },
              { label: "Following", value: 64 },
            ].map((stat, i, arr) => (
              <div
                key={stat.label}
                className={`flex-1 py-5 text-center ${i < arr.length - 1 ? "border-r border-slate-100" : ""}`}
              >
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
            <p className="text-slate-600 leading-relaxed text-sm">{profile.bio}</p>
          </Card>
        </div>

        {/* Posts grid */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            {post.map((i,num) => (
              <Card key={num} hoverable className="p-0 overflow-hidden flex flex-col h-full" >
                <div className="h-40 overflow-hidden">
                 <img
                    src={i.image  ||"https://picsum.photos/200"}
                    alt="Post"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-base mb-2 line-clamp-1 text-slate-900">
                    {profile.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                    A peek into the thoughts and ideas of {profile.username}.
                  </p>
                  <span className="text-brand-600 text-sm font-semibold cursor-pointer hover:text-brand-700 transition-colors" onClick={()=>{navigate(`/post/${i._id}`)}}       >
                    Read more →
                  </span>
                </div>
              </Card>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
