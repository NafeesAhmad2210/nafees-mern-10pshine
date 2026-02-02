import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup, setToken } from "../api.js";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { token } = await signup(name, email, password);
      setToken(token);
      navigate("/create-note", { replace: true });
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 p-8">
          <h1 className="text-2xl font-bold text-center text-slate-100 mb-2">
            My Notes
          </h1>
          <p className="text-slate-400 text-center text-sm mb-8">
            Create an account
          </p>
          {error && (
            <p className="text-red-400 text-sm text-center mb-4 bg-red-900/30 rounded-lg py-2 px-3">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
