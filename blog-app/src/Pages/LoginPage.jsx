import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, loading, error } = useSelector((state) => state.auth);

  // Where did they come from? Default to /dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const [formdata, setFormdata] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormdata({ ...formdata, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(formdata)); };

  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token, navigate, from]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-brand-400 to-brand-600" />

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-display font-bold text-slate-900">Welcome back</h1>
              <p className="text-slate-500 mt-1.5 text-sm">Sign in to continue to BlogSpace</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="loginEmail" className="text-sm font-medium text-slate-700">Email</label>
                <input
                  id="loginEmail"
                  name="email"
                  type="email"
                  value={formdata.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="loginPassword" className="text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Forgot password?</a>
                </div>
                <input
                  id="loginPassword"
                  name="password"
                  type="password"
                  value={formdata.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
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
                className="w-full py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 active:scale-[0.99] transition-all shadow-sm hover:shadow-brand-500/20 disabled:opacity-60 mt-2"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}