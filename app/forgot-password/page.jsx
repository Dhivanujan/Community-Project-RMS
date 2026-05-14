"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a real app, this would call an API to send a reset link
      // For now, we'll just simulate it since we don't have an email service set up
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to send reset link");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-[500px] w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 sm:p-12">
        <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-8 w-max">
          <ChevronLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">Faculty of Computing</span>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Check your email</h2>
              <p className="text-sm text-slate-500">
                We've sent a password reset link to <span className="font-semibold text-slate-900">{email}</span>.
              </p>
            </div>
            <p className="text-xs text-slate-400 italic">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password?</h2>
              <p className="text-sm text-slate-500 mt-2">No worries! Enter your email and we'll send you reset instructions.</p>
            </div>

            {error && (
              <div className="p-3 mb-6 rounded-lg text-sm font-medium bg-red-50 text-red-700 text-center">
                {error}
              </div>
            )}

            <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  University Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@foc.sab.ac.lk"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
              >
                {loading ? "Sending..." : "Send Reset Link"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
