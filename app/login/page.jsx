"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  HelpCircle,
  User,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: formData.username,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Fetch session to check role and first login status
        const res = await fetch("/api/auth/session");
        const session = await res.json();

        if (session?.user) {
          if (session.user.isFirstLogin) {
            router.push("/change-password");
          } else {
            const role = session.user.role;
            if (role === "SUPER_ADMIN") router.push("/super-admin/dashboard");
            else if (role === "STAFF") router.push("/admin");
            else router.push("/student/dashboard");
          }
          router.refresh();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
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

          <Link href="/" className="items-center gap-3 relative z-10 inline-flex w-max">
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

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              RMS Dashboard
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your credentials to manage academic records.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-6 rounded-lg text-sm font-medium bg-red-100 text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    size="sm"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500/20"
                />
                <label
                  htmlFor="remember"
                  className="text-xs font-medium text-slate-600 cursor-pointer select-none"
                >
                  Remember me for 30 days
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In to Dashboard"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-slate-600">
              Need assistance?{" "}
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Contact IT Support
              </a>
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
