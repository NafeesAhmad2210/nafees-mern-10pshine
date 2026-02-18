import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../api.js";

export default function VerifyOtp() {
  const location = useLocation();
  const initialEmail = location.state?.email || "";
  const navigate = useNavigate();

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();
    if (!trimmedEmail || !trimmedOtp) {
      setError("Please enter both email and OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp(trimmedEmail, trimmedOtp);
      setMessage(res?.message || "OTP verified successfully.");
      if (res?.resetToken) {
        navigate("/reset-password", {
          replace: true,
          state: { email: trimmedEmail, resetToken: res.resetToken },
        });
      }
    } catch (err) {
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 p-8">
          <h1 className="text-2xl font-bold text-center text-slate-100 mb-2">
            Enter OTP
          </h1>
          <p className="text-slate-400 text-center text-sm mb-6">
            We&apos;ve sent a 6-digit code to your email. Enter it below to
            continue.
          </p>
          {error && (
            <p className="text-red-400 text-sm text-center mb-4 bg-red-900/30 rounded-lg py-2 px-3">
              {error}
            </p>
          )}
          {message && (
            <p className="text-emerald-400 text-sm text-center mb-4 bg-emerald-900/30 rounded-lg py-2 px-3">
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="verify-email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                id="verify-email"
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
                htmlFor="verify-otp"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                OTP
              </label>
              <input
                id="verify-otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Back to{" "}
            <Link
              to="/login"
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

