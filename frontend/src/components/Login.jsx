import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, setToken } from '../api.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login(email, password);
      setToken(token);
      navigate('/create-note', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Forgot password flow will be available soon.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 p-8">
          <h1 className="text-2xl font-bold text-center text-slate-100 mb-2">
            My Notes
          </h1>
          <p className="text-slate-400 text-center text-sm mb-8">
            Sign in to your account
          </p>
          {error && (
            <p className="text-red-400 text-sm text-center mb-4 bg-red-900/30 rounded-lg py-2 px-3">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-amber-400 hover:text-amber-300 font-medium focus:outline-none focus:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
