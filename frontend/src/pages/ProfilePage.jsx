import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, getMe, setToken, setUser } from "../api.js";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getUser();
    if (stored) {
      setUserState(stored);
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => {
        if (res?.user) {
          setUser(res.user);
          setUserState(res.user);
        }
      })
      .catch(() => setUserState(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSignOut = () => {
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Profile</h1>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-amber-400">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <p className="text-slate-100 font-semibold text-lg">
              {user?.name || "User"}
            </p>
            {user?.email && (
              <p className="text-slate-400 text-sm">{user.email}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full px-4 py-3 rounded-lg bg-slate-600 hover:bg-slate-500 text-slate-100 font-medium flex items-center justify-center gap-2 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}
