"use client";

import { useState, useEffect } from "react";
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
  IdCard,
  FileText,
  Monitor,
  LogIn,
  LayoutGrid,
  BarChart3,
  ShieldCheck,
  Shield,
  Info,
} from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [accessType, setAccessType] = useState("faculty"); // 'faculty' or 'student'
  const [facultyAccessLevel, setFacultyAccessLevel] = useState("records"); // 'records' or 'management'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    <div className="transition-opacity duration-500 ease-in-out">
      {accessType === "faculty" ? (
        <div className="min-h-screen bg-slate-50 bg-grid-slate-200 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl">
            <div className="w-16 h-16 bg-maroon flex items-center justify-center rounded-xl shadow-lg mb-4">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-maroon tracking-tight">Faculty Access Portal</h1>
            <p className="text-slate-500 text-sm mt-1">Sabaragamuwa University of Sri Lanka</p>
          </div>

          {/* Main Card */}
          <div className="max-w-[480px] w-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 flex flex-col p-8 sm:p-10 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-maroon"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Staff ID */}
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block pl-1">
                  Staff ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-maroon transition-colors">
                    <IdCard className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. FAC/COM/2024/001"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-maroon/5 focus:border-maroon transition-all placeholder:text-slate-400 text-slate-900"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block pl-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-maroon transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-maroon/5 focus:border-maroon transition-all placeholder:text-slate-400 text-slate-900 tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-maroon transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Access Level */}
              <div className="space-y-3 text-left">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block pl-1">
                  Access Level
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFacultyAccessLevel("records")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all text-sm font-semibold ${
                      facultyAccessLevel === "records"
                        ? "bg-maroon/5 border-maroon text-maroon"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Faculty Records
                  </button>
                  <button
                    type="button"
                    onClick={() => setFacultyAccessLevel("management")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all text-sm font-semibold ${
                      facultyAccessLevel === "management"
                        ? "bg-maroon/5 border-maroon text-maroon"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    Management
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-100 flex items-center gap-2 animate-fadeInUp">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-maroon hover:bg-maroon/90 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-maroon/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98]"
              >
                {loading ? "Authenticating..." : "Secure Login"}
                {!loading && <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>

              {/* Footnotes */}
              <div className="pt-4 text-center space-y-3">
                <Link
                  href="/forgot-password"
                  className="block text-sm font-medium text-maroon hover:underline decoration-2 underline-offset-4"
                >
                  Forgot your credentials?
                </Link>
                <button
                  type="button"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Request IT Support
                </button>
              </div>
            </form>
          </div>

          {/* Authorized Access Alert */}
          <div className="max-w-[480px] w-full mt-8 bg-slate-100/80 border border-slate-200 rounded-lg p-5 flex gap-4 text-left backdrop-blur-sm shadow-sm ring-1 ring-white/50">
            <Info className="w-6 h-6 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-1">
                Authorized Access Only
              </h4>
              <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                This system is strictly for academic staff of Sabaragamuwa University. Unauthorized attempts to access faculty records are monitored and logged.
              </p>
            </div>
          </div>

          {/* Switch to Student Portal */}
          <button
            onClick={() => setAccessType("student")}
            className="mt-8 px-6 py-2.5 rounded-full bg-white text-maroon border border-maroon hover:bg-maroon hover:text-white transition-all font-semibold text-sm shadow-sm flex items-center gap-2 active:scale-95"
          >
            <User className="w-4 h-4" />
            Switch to Student Portal
          </button>

          {/* Footer */}
          <footer className="mt-auto pt-16 pb-8 w-full max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 border-t border-slate-200/50">
            <div className="text-left space-y-1">
              <p className="font-bold text-maroon tracking-tight">SUSL Results Management</p>
              <p className="text-xs">© 2024 Sabaragamuwa University of Sri Lanka. All Rights Reserved.</p>
            </div>
            <div className="flex gap-8 text-xs font-semibold">
              <Link href="#" className="hover:text-maroon transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-maroon transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-maroon transition-colors">Contact Us</Link>
            </div>
          </footer>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-maroon rounded flex items-center justify-center shadow-md">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 leading-none">SUSL Results Management</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Faculty of Computing</p>
              </div>
            </div>
            <button
              onClick={() => setAccessType("faculty")}
              className="px-4 py-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all font-bold text-xs uppercase tracking-wider border border-slate-200 shadow-sm flex items-center gap-2"
            >
              <IdCard className="w-4 h-4" />
              Faculty Login
            </button>
          </header>

          {/* Body Content */}
          <main className="flex-1 flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full p-6 lg:p-12 gap-12 lg:gap-20 items-center">
            {/* Left Side: Features */}
            <div className="flex-1 space-y-10 text-left">
              <div className="space-y-4 max-w-[600px]">
                <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  Access Your Academic <br />
                  <span className="text-maroon">Insights Instantly</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  Seamlessly manage your academic journey. Review comprehensive GPA analytics, track your faculty rankings, and monitor your graduation eligibility in real-time.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: <LayoutGrid className="w-6 h-6" />, title: "GPA Analytics", desc: "Detailed breakdown of semester performance." },
                  { icon: <BarChart3 className="w-6 h-6" />, title: "Rankings", desc: "Track your standing within the department." },
                  { icon: <ShieldCheck className="w-6 h-6" />, title: "Eligibility", desc: "Instant verification for graduation status." },
                  { icon: <Shield className="w-6 h-6" />, title: "Secure Access", desc: "Enterprise-grade protection for your records." },
                ].map((f, i) => (
                  <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
                    <div className="w-12 h-12 bg-maroon/5 rounded-xl flex items-center justify-center text-maroon mb-4 group-hover:bg-maroon group-hover:text-white transition-colors shadow-sm">
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-normal">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Login Card */}
            <div className="lg:w-[500px] w-full">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-8 lg:p-12 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-maroon"></div>

                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-slate-100 shadow-inner overflow-hidden">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/2/23/Sabaragamuwa_University_of_Sri_Lanka_Logo.png"
                      alt="SUSL Crest"
                      className="w-14 h-14 object-contain opacity-80"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://api.dicebear.com/7.x/notionists/svg?seed=crest";
                      }}
                    />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">STUDENT PORTAL</h2>
                  <p className="text-slate-500 font-bold tracking-tight text-xs uppercase mt-1">Faculty of Computing Administration</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                      Student ID Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-maroon transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="e.g. 19/COM/001"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-maroon/5 focus:border-maroon transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-maroon transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-maroon/5 focus:border-maroon transition-all placeholder:text-slate-400 text-slate-900 tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-maroon transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-slate-300 text-maroon focus:ring-maroon transition-all"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-semibold text-slate-600 cursor-pointer select-none"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-maroon hover:underline decoration-2 underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl text-sm font-bold bg-red-50 text-red-700 border border-red-100 flex items-center gap-2 animate-fadeInUp">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-maroon hover:bg-maroon/90 text-white py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all shadow-xl shadow-maroon/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98]"
                  >
                    {loading ? "Verifying..." : "Sign In to Dashboard"}
                    {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                  <p className="text-sm font-bold text-slate-600 leading-relaxed px-4">
                    Need technical assistance? <br />
                    <button className="text-maroon hover:underline decoration-2 underline-offset-4">Contact IT Support</button>
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-auto px-6 py-8 border-t border-slate-200 bg-white">
            <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
              <div className="text-left space-y-1">
                <p className="font-bold text-slate-700">SUSL</p>
                <p className="text-xs font-semibold">© 2024 Sabaragamuwa University of Sri Lanka. All Rights Reserved.</p>
              </div>
              <div className="flex gap-8 text-xs font-bold tracking-tight">
                <Link href="#" className="hover:text-maroon transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-maroon transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-maroon transition-colors">Contact Us</Link>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Help Bubble - Shared */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-white rounded-full flex items-center justify-center text-maroon shadow-2xl border border-slate-100 hover:-translate-y-2 transition-all hover:rotate-12 group z-[100]">
        <HelpCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
