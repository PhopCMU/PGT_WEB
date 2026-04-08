import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  User,
  ChevronRight,
  Fingerprint,
  KeyRound,
} from "lucide-react";
import Swal from "sweetalert2";
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
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hideModal = localStorage.getItem("hide_instruction_modal");
      if (hideModal !== "true") {
        setShowInstructions(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.removeItem("policyAccepted");
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleBack = () => {
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

      const data = { email, password };
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
      setIsLoading(false);
      await Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "ยืนยันการเข้าสู่ระบบสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {showReset ? (
        <ResetPassword onBack={handleBack} />
      ) : (
        <>
          <div className="max-w-xl w-full">
            <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden z-10">
              {/* Card header */}
              <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white rounded-t-2xl min-h-300px flex flex-col justify-center">
                <div className="absolute inset-0 opacity-10 z-0">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400px h-400px">
                    <div className="relative w-full h-full">
                      <img
                        src={pgticon}
                        alt="Logo"
                        className="absolute inset-0 w-full h-full object-contain p-16 filter brightness-0 invert"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="space-y-6 text-center max-w-4xl mx-auto backdrop-blur-sm bg-white/10 p-8 rounded-3xl border border-white/20 shadow-xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-4">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-white tracking-wide">
                        GRADUATE STUDIES
                      </span>
                    </div>

                    <div className="relative">
                      <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">
                        Postgraduate
                        <br />
                        Education Center
                      </h1>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xl text-blue-50 font-medium">
                        Faculty of Veterinary Medicine
                      </p>
                      <p className="text-lg text-blue-100 font-normal">
                        Chiang Mai University
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* info section */}
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <KeyRound className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-900 mb-0.5">
                      ✨ สำหรับสมาชิกเดิม
                    </p>
                    <p className="text-sm text-blue-700">
                      ให้รีเซ็ตรหัสผ่านใหม่ กรุณากด
                      <span className="font-black text-blue-800">
                        {" "}
                        "Forgot password?"{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Form content */}
              <div className="p-8 md:p-10 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="flex items-center text-sm font-bold text-gray-700">
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 
                   focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 
                   outline-none transition-all duration-300 bg-gray-50 text-gray-900 placeholder-gray-400 font-medium"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-bold text-gray-700">
                        <Lock className="w-4 h-4 mr-2 text-blue-600" />
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowReset(true)}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 
                   focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 
                   outline-none transition-all duration-300 bg-gray-50 text-gray-900 placeholder-gray-400 pr-12 font-medium"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-red-900 text-sm">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!email || !password || isLoading}
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </div>
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-sm font-bold text-gray-400 uppercase tracking-widest">
                        OR
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("../register")}
                    type="button"
                    className="w-full border-2 border-gray-100 text-gray-700 py-3.5 px-4 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    Create New Account
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipLogin}
                    className="w-full text-gray-500 hover:text-blue-600 py-2 rounded-lg font-bold transition-all flex items-center justify-center group"
                  >
                    Skip Login & Browse Projects
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <p className="text-center text-sm text-gray-500">
                    By clicking "Create New Account", you agree to our{" "}
                    <button
                      onClick={() => setShowPolicy(true)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Terms and Privacy Policy
                    </button>
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Fingerprint className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Secure Authentication
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showInstructions && (
            <InstructionModal onClose={() => setShowInstructions(false)} />
          )}
        </>
      )}

      <Policy isOpen={showPolicy} onClose={() => setShowPolicy(false)} />
    </div>
  );
}
