import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  CheckCheck,
  User,
  Sparkles,
  ChevronRight,
  Fingerprint,
  Server,
  Cpu,
  KeyRound,
} from "lucide-react";
import pgticon from "../../assets/pgt.svg";
import { useNavigate } from "react-router-dom";
import { Policy } from "../Policys";
import { ResetPassword } from "./Resetpassword";
import { useAlert } from "../../contexts/AlertContext";
import { loginUser } from "../../services/registrationService";
import { getToken, saveToken } from "../../utils/authService";
import InstructionModal from "../InstructionModal";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPolicy, setShowPolicy] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hideModal = localStorage.getItem("hide_instruction_modal");
      if (hideModal !== "true") {
        setShowInstructions(true);
      }
    }, 300); // เล็กน้อย delay เพื่อให้หน้าโหลดเสร็จก่อน

    return () => clearTimeout(timer);
  }, []);

  // ==== Remove Localstorage ====
  useEffect(() => {
    localStorage.removeItem("policyAccepted");
  }, []);

  // ==== Check Token Redirect Dashboard ====
  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleBack = () => {
    console.log("Navigate back to login page");
    setShowReset(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert({
          message: "Invalid email format",
          type: "error",
          title: "Error",
        });
        return;
      }

      const data = {
        email,
        password,
      };

      const response: any = await loginUser(data);
      if (!response.success) {
        setError(response.message);
        setIsLoading(false);
        return;
      }

      const token = response.token.access_token;

      if (!token) {
        setError("Token not found");
        setIsLoading(false);
        return;
      }

      saveToken(token);

      setInfo("ยืนยันการเข้าสู่ระบบสำเร็จ");
      setIsLoading(false);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showAlert({
        message: "Rate Limit Exceeded",
        type: "error",
        title: "Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipLogin = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-[#111829] to-[#0d1420] flex items-center justify-center p-4">
      {showReset ? (
        <ResetPassword onBack={handleBack} />
      ) : (
        <>
          <div className="max-w-xl w-full">
            {/* Animated Background Particles */}
            <div className="fixed inset-0 overflow-hidden z-0">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-cyan-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-500"></div>

              {/* Floating particles */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${10 + Math.random() * 10}s`,
                  }}
                />
              ))}
            </div>

            {/* Main card */}
            <div className="relative bg-[#161f2f]/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden z-10">
              {/* Card header - Modern Design with Background Logo */}
              <div className="relative overflow-hidden bg-linear-to-br from-[#172131] via-[#1a2438] to-[#1f2a42] p-8 text-white rounded-t-2xl min-h-300px flex flex-col justify-center">
                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-5 z-0">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-linear(to right, #3b82f620 1px, transparent 1px),
                                   linear-linear(to bottom, #3b82f620 1px, transparent 1px)`,
                      backgroundSize: "50px 50px",
                    }}
                  />
                </div>

                {/* Background Logo Container */}
                <div className="absolute inset-0 opacity-5 z-0">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400px h-400px">
                    <div className="relative w-full h-full">
                      {/* Animated rings */}
                      <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full animate-ping"></div>
                      <div className="absolute inset-8 border-2 border-purple-500/10 rounded-full animate-ping delay-300"></div>

                      <img
                        src={pgticon}
                        alt="Postgraduate Education Center Logo"
                        className="absolute inset-0 w-full h-full object-contain p-16 filter drop-shadow-2xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating tech elements */}
                <div className="absolute top-8 right-8 z-0">
                  <div className="w-12 h-12 border-2 border-blue-400/10 rounded-full animate-spin-slow">
                    <Cpu className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400/20" />
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 z-0">
                  <div className="w-10 h-10 border-2 border-purple-400/10 rounded-full animate-spin-slow-reverse">
                    <Server className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400/20" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="space-y-6 text-center max-w-4xl mx-auto backdrop-blur-sm bg-black/20 p-8 rounded-3xl border border-gray-800/50 shadow-2xl">
                    {/* Organization badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-gray-800/50 mb-4">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-300 tracking-wide">
                        GRADUATE STUDIES
                      </span>
                    </div>

                    {/* Main title */}
                    <div className="relative">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                        <span className="bg-linear-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                          Postgraduate
                        </span>
                        <br />
                        <span className="bg-linear-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
                          Education Center
                        </span>
                      </h1>

                      {/* Decorative line */}
                      <div className="flex items-center justify-center gap-4 my-6">
                        <div className="h-px w-20 bg-linear-to-r from-transparent via-blue-500/30 to-transparent"></div>
                        <div className="w-3 h-3 bg-linear-to-br from-blue-400 to-purple-400 rounded-full rotate-45"></div>
                        <div className="h-px w-20 bg-linear-to-r from-transparent via-purple-500/30 to-transparent"></div>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-2">
                      <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                        Faculty of Veterinary Medicine
                      </p>
                      <p className="text-lg md:text-xl text-gray-400 font-normal tracking-wide">
                        Chiang Mai University
                      </p>
                    </div>
                    {/* Version info */}
                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 rounded-full border border-gray-800/50">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-gray-400">
                          v{import.meta.env.VITE_APP_VERSION} • Secure Login
                          Portal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* info section */}
              {/* info for existing members */}
              <div className="mt-6 p-4 bg-linear-to-r from-cyan-900/15 to-blue-900/15 border border-cyan-800/20 l">
                <div className="flex items-start gap-3">
                  <div className="bg-cyan-900/30 p-2 rounded-lg">
                    <KeyRound className="text-cyan-400" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cyan-300 mb-1">
                      ✨ สำหรับสมาชิกเดิม
                    </p>
                    <p className="text-sm text-cyan-200">
                      ให้รีเซ็ตรหัสผ่านใหม่ กรุณากด
                      <span className="font-semibold text-cyan-100">
                        {" "}
                        "Forgot password?"{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Form content */}
              <div className="p-8 md:p-10 bg-[#161f2f] rounded-b-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email input */}
                  <div className="space-y-3 group">
                    <label className="flex items-center text-sm font-semibold text-gray-300 tracking-wide">
                      <Mail className="w-4 h-4 mr-2 text-blue-400" />
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 group-focus-within:text-blue-400">
                        <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full px-4 py-3.5 rounded-xl border-2 border-gray-800 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                   outline-none transition-all duration-300 
                   hover:border-gray-700
                   bg-gray-900/50 text-gray-200 placeholder-gray-500
                   backdrop-blur-sm"
                        placeholder="you@example.com"
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {email && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 ml-1">
                      Enter your institutional email address
                    </p>
                  </div>

                  {/* Password input */}
                  <div className="space-y-3 group">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-semibold text-gray-300 tracking-wide">
                        <Lock className="w-4 h-4 mr-2 text-blue-400" />
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowReset(true)}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 
                   hover:underline transition-all duration-300 
                   transform hover:-translate-y-0.5"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 group-focus-within:text-blue-400">
                        <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full px-4 py-3.5 rounded-xl border-2 border-gray-800 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                   outline-none transition-all duration-300 
                   hover:border-gray-700 pr-12
                   bg-gray-900/50 text-gray-200 placeholder-gray-500
                   backdrop-blur-sm"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center 
                   text-gray-500 hover:text-gray-300 
                   transition-colors duration-300"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 ml-1">
                      <div className="flex-1">
                        {password.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>Strength:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i <=
                                    Math.min(Math.floor(password.length / 2), 4)
                                      ? password.length >= 8
                                        ? "bg-green-500"
                                        : password.length >= 5
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      : "bg-gray-700"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {password.length > 0 && (
                        <span className="text-xs">
                          {password.length < 5
                            ? "Weak"
                            : password.length < 8
                              ? "Medium"
                              : "Strong"}
                        </span>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="animate-slideDown bg-linear-to-r from-red-900/20 to-rose-900/20 border-l-4  p-4 rounded-lg backdrop-blur-sm border border-red-900/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-900/30 rounded-full shrink-0">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-red-300 text-sm md:text-base">
                            {error}
                          </p>
                          <p className="text-red-400/80 text-xs mt-1">
                            Please check your credentials and try again
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {info && (
                    <div className="animate-slideDown bg-linear-to-r from-green-900/20 to-emerald-900/20 border-l-4  p-4 rounded-lg backdrop-blur-sm border border-green-900/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-900/30 rounded-full shrink-0">
                          <CheckCheck className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-green-300 text-sm md:text-base">
                            {info}
                          </p>
                          <p className="text-green-400/80 text-xs mt-1">
                            Login successful
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sign in button */}
                  <button
                    type="submit"
                    disabled={!email || !password || isLoading}
                    className="w-full relative group mt-6"
                  >
                    {/* Background linear with animation */}
                    <div
                      className="absolute inset-0 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 
    rounded-xl opacity-90 group-hover:opacity-100 transition-all duration-500 
    shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/20"
                    ></div>

                    {/* Animated shine effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <div
                        className="absolute -inset-100% bg-linear-to-r from-transparent via-white/10 to-transparent 
      group-hover:translate-x-100% transition-transform duration-1000"
                      ></div>
                    </div>

                    {/* Main button content */}
                    <div
                      className="relative bg-linear-to-r from-blue-600 to-cyan-500 
    text-white py-4 px-6 rounded-xl font-semibold text-base md:text-lg
    transform transition-all duration-300 group-hover:-translate-y-0.5 group-active:translate-y-0
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    border border-white/10
    shadow-xl group-hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="animate-pulse">Signing in...</span>
                          </>
                        ) : (
                          <>
                            <span className="relative">
                              Sign In
                              <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/50 transition-all duration-300"></span>
                            </span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 group-active:animate-ripple"></div>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-[#161f2f] text-sm font-medium text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Create Account button */}
                  <button
                    onClick={() => navigate("../register")}
                    type="button"
                    className="w-full border-2 border-gray-700 text-gray-300 
               py-3.5 px-4 rounded-xl font-semibold 
               hover:bg-linear-to-r hover:from-gray-900/50 hover:to-gray-800/50 
               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
               transition-all duration-300 transform 
               hover:-translate-y-0.5 active:translate-y-0
               hover:border-gray-600 hover:text-gray-200
               shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Create New Account
                    </div>
                  </button>

                  {/* Skip login button */}
                  <div className="pt-6 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={handleSkipLogin}
                      className="w-full text-gray-500 hover:text-gray-300 
                 py-3 px-4 rounded-lg font-medium 
                 hover:bg-linear-to-r hover:from-gray-900/30 hover:to-gray-800/30 
                 focus:outline-none focus:ring-2 focus:ring-gray-700 
                 transition-all duration-300 transform 
                 hover:-translate-y-0.5 active:translate-y-0
                 flex items-center justify-center group"
                    >
                      <span className="flex items-center">
                        Skip Login & Browse Projects
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </span>
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-2">
                      Access public projects without logging in
                    </p>
                  </div>
                </form>

                {/* Footer links */}
                <div className="mt-10 pt-8 border-t border-gray-800">
                  <p className="text-center text-sm text-gray-500 leading-relaxed">
                    By clicking "Create New Account", you agree to our{" "}
                    <button
                      onClick={() => setShowPolicy(true)}
                      className="text-blue-400 hover:text-blue-300 font-medium 
                 hover:underline transition-colors duration-300 
                 relative after:absolute after:left-0 after:-bottom-0.5 
                 after:w-0 after:h-0.5 after:bg-blue-400 
                 hover:after:w-full after:transition-all after:duration-300"
                    >
                      Terms of Service and Privacy Policy
                    </button>
                  </p>

                  {/* Security info */}
                  <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-800">
                    <Fingerprint className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">
                      Secure Authentication
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-20 h-20">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/30 rounded-tl-xl"></div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500/30 rounded-tr-xl"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-20 h-20">
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/30 rounded-bl-xl"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20">
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500/30 rounded-br-xl"></div>
              </div>
            </div>
          </div>

          {/* Instruction Modal */}
          {showInstructions && (
            <InstructionModal onClose={() => setShowInstructions(false)} />
          )}
        </>
      )}

      <Policy isOpen={showPolicy} onClose={() => setShowPolicy(false)} />
    </div>
  );
}
