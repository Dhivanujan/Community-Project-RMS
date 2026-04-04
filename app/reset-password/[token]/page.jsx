"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Lock, Eye, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setMessage(data.message || "Failed to reset password");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-[500px] w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 sm:p-12 relative">
        <Link href="/" className="flex items-center gap-3 justify-center mb-10 w-max mx-auto">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">Faculty of Computing</span>
        </Link>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Password Reset!</h2>
            <p className="text-sm text-slate-500 mb-8">
              Your password has been successfully reset. You will be redirected to login shortly...
            </p>
            <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">
              Go to login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Password</h2>
              <p className="text-sm text-slate-500 mt-2">Enter your new secure password below to access the RMS Dashboard.</p>
            </div>

            {message && (
              <div className="p-3 mb-6 rounded-lg text-sm font-medium bg-red-100 text-red-700 text-center">
                {message}
              </div>
            )}

            <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium tracking-widest"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium tracking-widest"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}