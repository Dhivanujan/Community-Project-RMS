"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, Eye, ArrowRight, HelpCircle, User, Hash } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("Student");
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    indexNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isForgotPassword) {
        // Handle Forgot Password
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        setMessage(res.ok ? "Password reset link sent to your email!" : data.message);
      } else if (isLogin) {
        // Handle Login
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage("Logged in successfully!");
          // Route users to the correct dashboard based on role returned by API.
          const normalizedRole = (data.role || role || "").toLowerCase();
          const targetPath = normalizedRole === "faculty admin" ? "/admin" : "/student/dashboard";
          router.push(targetPath);
          router.refresh();
        } else {
          setMessage(data.message);
        }
      } else {
        // Handle Signup
        if (formData.password !== formData.confirmPassword) {
          setMessage("Passwords do not match");
          setLoading(false);
          return;
        }
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            indexNumber: formData.indexNumber,
            role,
          }),
        });
        const data = await res.json();
        setMessage(res.ok ? "Account created successfully! Please login." : data.message);
        if (res.ok) setIsLogin(true);
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans relative">
      <div className="max-w-[1000px] w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] transition-all duration-300">

        {/* Left Side - Branding */}
        <div className="md:w-1/2 bg-blue-600 p-10 lg:p-12 text-white flex flex-col relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-8 flex items-end gap-2 opacity-20">
            <div className="w-8 h-16 bg-white rounded-t-lg"></div>
            <div className="w-8 h-24 bg-white rounded-t-lg"></div>
            <div className="w-8 h-32 bg-white rounded-t-lg"></div>
          </div>

          <Link href="/" className="flex items-center gap-3 relative z-10 inline-flex w-max">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="text-blue-600 w-6 h-6" />
            </div>
            <span className="font-bold text-lg tracking-tight">Faculty of Computing</span>
          </Link>

          <div className="mt-16 relative z-10 flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight">
              Redefining <br /> Academic Success.
            </h1>
            <p className="mt-6 text-blue-100 text-sm lg:text-base max-w-[280px] leading-relaxed">
              Access high-precision grade analytics and student performance reports within the Faculty of Computing intellectual atelier.
            </p>
          </div>

          <div className="bg-white text-slate-800 rounded-2xl p-5 shadow-xl relative z-10 w-full max-w-[320px] mt-12 md:mt-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                <img 
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Arthur&backgroundColor=e2e8f0" 
                  alt="Prof. S Vasanthapriyan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">Prof. S Vasanthapriyan</div>
                <div className="text-xs font-medium text-slate-500">Dean of Computing</div>
              </div>
            </div>
            <p className="text-sm font-medium italic text-slate-600 leading-snug">
              "The RMS provides a seamless bridge between data-driven evaluation and student-centric mentorship."
            </p>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="md:w-1/2 p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isForgotPassword ? "Reset Password" : isLogin ? "RMS Dashboard" : "Create Account"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isForgotPassword 
                ? "Enter your email to receive a reset link." 
                : isLogin 
                  ? "Enter your credentials to manage academic records." 
                  : "Register for an account to access the dashboard."}
            </p>
          </div>

          {message && (
            <div className={`p-3 mb-6 rounded-lg text-sm font-medium ${message.includes('success') || message.includes('link sent') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Role Toggle */}
          {!isForgotPassword && (
            <div className="bg-slate-50/80 p-1.5 rounded-xl border border-slate-100 flex mb-8 shrink-0">
              <button
                type="button"
                onClick={() => setRole("Student")}
                className={`flex-1 py-1.5 sm:py-2 text-sm font-semibold rounded-lg transition-all ${
                  role === "Student" 
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("Faculty Admin")}
                className={`flex-1 py-1.5 sm:py-2 text-sm font-semibold rounded-lg transition-all ${
                  role === "Faculty Admin" 
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Faculty Admin
              </button>
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
            <div className={`space-y-${!isLogin && !isForgotPassword ? '4' : '5'}`}>
              {!isLogin && !isForgotPassword && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Index Number Input */}
                  {role === "Student" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Index Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Hash className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="indexNumber"
                          value={formData.indexNumber}
                          onChange={handleChange}
                          placeholder="e.g. 19/APSE?035"
                          className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Academic Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ex Sdani@std.foc.sab.ac.lk"
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              {!isForgotPassword && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Password
                    </label>
                    {isLogin && (
                      <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium tracking-widest"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password Input */}
              {!isLogin && !isForgotPassword && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium tracking-widest"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              {/* Checkbox */}
              {isLogin && !isForgotPassword && (
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500/20"
                  />
                  <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                    Keep me signed in for 30 days
                  </label>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute -inset-1 rounded-[14px] border border-dashed border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  {loading ? "Processing..." : isForgotPassword ? "Send Reset Link" : isLogin ? "Sign In to Dashboard" : "Create Account"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SSO Divider / Button (Only on Login) */}
            {isLogin && !isForgotPassword && (
              <>
                <div className="relative mt-8 mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-[10px] font-bold tracking-widest uppercase text-slate-400">Identity Provider</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3"
                >
                  <div className="w-4 h-4 bg-slate-900 rounded-sm"></div>
                  Continue with Institute SSO
                </button>
              </>
            )}

            <div className="mt-8 text-center text-sm text-slate-600">
              {isForgotPassword ? (
                <>
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setMessage("");
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Back to log in
                  </button>
                </>
              ) : isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setMessage("");
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setMessage("");
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </form>

          <div className="mt-8 flex justify-between items-center text-xs font-medium text-slate-500">
            <div>© 2024 Faculty of Computing</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-800 transition-colors">Support</a>
              <a href="#" className="hover:text-slate-800 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </div>

      <button className="absolute bottom-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform">
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}