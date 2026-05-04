import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from "../features/auth/authSlice";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formdata, setFormdata] = useState({ name: "", username: "", email: "", password: "" });

  const handlechange = (e) => setFormdata({ ...formdata, [e.target.name]: e.target.value });
  const handlesubmit = (e) => {
    e.preventDefault();
    dispatch(RegisterUser(formdata)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') navigate('/login');
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-brand-500" />

          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-display font-bold text-slate-900">Create account</h1>
              <p className="text-slate-500 mt-1.5 text-sm">Join the BlogSpace community</p>
            </div>

            <form onSubmit={handlesubmit} className="flex flex-col gap-4">

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text" id="name" name="name"
                    onChange={handlechange} value={formdata.name}
                    placeholder="Jane Doe" required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="username" className="text-sm font-medium text-slate-700">Username</label>
                  <input
                    type="text" id="username" name="username"
                    onChange={handlechange} value={formdata.username}
                    placeholder="janedoe" required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email" id="email" name="email"
                  onChange={handlechange} value={formdata.email}
                  placeholder="jane@email.com" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password" id="password" name="password"
                  onChange={handlechange} value={formdata.password}
                  placeholder="Create a secure password" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 active:scale-[0.99] transition-all shadow-sm disabled:opacity-60 mt-2"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
