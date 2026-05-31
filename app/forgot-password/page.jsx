"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, ArrowRight, CheckCircle2, ChevronLeft, Info } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 bg-grid-slate-200 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl">
        <div className="w-16 h-16 bg-maroon flex items-center justify-center rounded-xl shadow-lg mb-4">
          <GraduationCap className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-maroon tracking-tight">Recover Account</h1>
        <p className="text-slate-500 text-sm mt-1">Sabaragamuwa University of Sri Lanka</p>
      </div>

      {/* Main Card */}
      <div className="max-w-[480px] w-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 flex flex-col p-8 sm:p-10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-maroon"></div>

        <Link 
          href="/login" 
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-maroon transition-colors mb-8 w-max group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {success ? (
          <div className="text-center space-y-6 pt-4">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl ring-1 ring-green-100">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3 uppercase italic">Email Sent!</h2>
              <p className="text-base text-slate-600 font-medium leading-relaxed">
                We've sent a password reset link to <br />
                <span className="font-black text-maroon">{email}</span>.
              </p>
            </div>
            <div className="pt-4 p-4 bg-slate-50 rounded-xl text-xs text-slate-500 font-bold leading-relaxed border border-slate-100 italic">
              Didn't receive the email? Check your spam folder or contact IT support for assistance.
            </div>
            <Link 
                href="/login"
                className="inline-flex items-center justify-center px-10 py-3.5 bg-maroon text-white font-bold rounded-lg hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20"
            >
                Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10 text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">Forgot <br /><span className="text-maroon">Password?</span></h2>
              <p className="text-[13px] text-slate-500 font-bold mt-3 leading-relaxed">No worries! Enter your university email address and we'll send you recovery instructions.</p>
            </div>

            {error && (
              <div className="p-4 mb-6 rounded-lg text-sm font-bold bg-red-50 text-red-700 border border-red-100 flex items-center gap-3 animate-fadeInUp">
                <Info className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                  University Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-maroon transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@foc.sab.ac.lk"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-maroon/5 focus:border-maroon transition-all placeholder:text-slate-400 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group bg-maroon hover:bg-maroon/90 text-white py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all shadow-xl shadow-maroon/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? "Sending link..." : "Send Reset Link"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-16 pb-8 w-full max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 border-t border-slate-200/50">
        <div className="text-left space-y-1">
          <p className="font-bold text-maroon tracking-tight">SUSL Results Management</p>
          <p className="text-xs font-semibold">© 2024 Sabaragamuwa University of Sri Lanka. All Rights Reserved.</p>
        </div>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-wider">
          <Link href="#" className="hover:text-maroon transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-maroon transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-maroon transition-colors">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}
