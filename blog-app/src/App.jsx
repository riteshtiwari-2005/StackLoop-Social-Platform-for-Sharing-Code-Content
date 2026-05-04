import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./Pages/HomePage";
import DashboardPage from "./Pages/DashboardPage";
import CreatePostPage from "./Pages/CreatePostPage";
import ProfilePage from "./Pages/ProfilePage";
import OtherUserProfilePage from "./Pages/OtherUserProfilePage";
import SinglePostPage from "./Pages/SinglePostPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";

function Navbar() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const activeCls = ({ isActive }) =>
    isActive
      ? "text-brand-600 font-semibold"
      : "text-slate-600 hover:text-brand-600 transition-colors";

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-display font-bold text-lg shadow-sm group-hover:shadow-brand-500/30 transition-all">
              B
            </div>
            <span className="font-display font-bold text-xl text-slate-900 group-hover:text-brand-600 transition-colors hidden sm:block">
              BlogSpace
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full bg-slate-50 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all"
                placeholder="Search articles..."
              />
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/" end className={({isActive}) => `hidden md:block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>Home</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => `hidden md:block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>Feed</NavLink>

            {token ? (
              <>
                <NavLink to="/create-post" className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="hidden sm:block">Write</span>
                </NavLink>
                <NavLink to="/profile" className={({isActive}) => `w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${isActive ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-400' : 'bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600'}`}>
                  {(user?.username || user?.name || 'U').slice(0, 2).toUpperCase()}
                </NavLink>
                <button
                  onClick={() => { dispatch(logout()); localStorage.clear(); }}
                  className="hidden md:flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
                  Sign In
                </NavLink>
                <NavLink to="/register" className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-full hover:bg-brand-600 transition-colors shadow-sm">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<SinglePostPage />} />
            <Route path="/user/:id" element={<OtherUserProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <span className="font-display font-semibold text-slate-800">BlogSpace</span>
            <p>© {new Date().getFullYear()} BlogSpace. Built with React + Tailwind.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-brand-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-600 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;