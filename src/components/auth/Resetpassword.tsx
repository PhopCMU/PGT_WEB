import React, { useState, useEffect } from "react";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Shield,
  Send,
  Lock,
  Fingerprint,
  Database,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { resetPasswordUser } from "../../services/registrationService";

interface ResetPasswordProps {
  onBack?: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown สำหรับการส่งซ้ำ
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailValidationState = () => {
    if (!emailTouched || email === "") return "neutral";
    if (!validateEmail(email)) return "invalid";
    return "valid";
  };

  const handleSubmit = async () => {
    setEmailTouched(true);
    setError("");

    if (!email) {
      setError("กรุณากรอกอีเมล / Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง / Invalid email format");
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPasswordUser(email);

      if (response.success) {
        setIsSuccess(true);
        setCountdown(30); // 30 seconds for next resend
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(
        "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ / Unable to connect to server"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const handleResend = () => {
    setEmail("");
    setEmailTouched(false);
    setError("");
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-[#111829] to-[#0d1420] flex items-center justify-center p-4 md:p-6">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative bg-[#161f2f]/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl w-full max-w-lg p-6 md:p-8 transform transition-all duration-300 z-10">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-blue-500/30 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-purple-500/30 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/30 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-blue-500/30 rounded-br-xl"></div>

          {/* Success Animation */}
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping bg-green-900/20 rounded-full opacity-75"></div>
            <div className="relative w-20 h-20 bg-linear-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-lg border border-emerald-800/50">
              <CheckCircle className="text-white" size={40} />
            </div>
          </div>

          {/* Success Content */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              ส่งอีเมลสำเร็จ! 🎉
            </h2>
            <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-6">
              Email Sent Successfully!
            </h3>

            {/* Email Display Card */}
            <div className="bg-linear-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-5 mb-6 border border-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-800/30">
                  <Mail className="text-blue-400" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-400 mb-1">ส่งไปยังอีเมล:</p>
                  <p className="font-semibold text-blue-300 text-lg">{email}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                We've sent a password reset link to your email address.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-linear-to-r from-yellow-900/20 to-amber-900/20 rounded-xl p-5 mb-6 border border-yellow-800/30 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-900/30 rounded-lg border border-yellow-800/30 mt-0.5">
                  <AlertCircle className="text-yellow-400" size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-yellow-300 mb-2">
                    คำแนะนำสำคัญ:
                  </p>
                  <ul className="space-y-2 text-sm text-yellow-200">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">📧</span>
                      <span>
                        กรุณาตรวจสอบอีเมลของคุณและคลิกลิงก์เพื่อรีเซ็ตรหัสผ่าน
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">⏱️</span>
                      <span>ลิงก์จะมีอายุการใช้งาน 30 นาที</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">⚠️</span>
                      <span>หากไม่พบอีเมล กรุณาตรวจสอบในกล่องสแปม (Spam)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-green-400" />
                <span className="text-xs text-gray-500">Encrypted Link</span>
              </div>
              <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-gray-500">Secure</span>
              </div>
              <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-gray-500">Verified</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleResend}
                disabled={countdown > 0}
                className="w-full relative group overflow-hidden"
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 bg-linear-to-r rounded-xl transition-all duration-300 ${
                    countdown > 0
                      ? "from-gray-800 to-gray-900"
                      : "from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700"
                  }`}
                ></div>

                {/* Shine effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div className="absolute -inset-100% bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                </div>

                <div
                  className={`relative py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition-transform group-hover:-translate-y-0.5 ${
                    countdown > 0 ? "text-gray-400" : "text-white"
                  }`}
                >
                  {countdown > 0 ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      <span>ส่งอีกครั้งได้ใน {countdown} วินาที</span>
                    </>
                  ) : (
                    <>
                      <Send
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span>ส่งอีเมลอีกครั้ง / Resend Email</span>
                    </>
                  )}
                </div>
              </button>

              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full text-gray-400 hover:text-gray-300 py-3 transition-colors font-medium flex items-center justify-center gap-2 hover:gap-3 group border border-gray-800/50 rounded-xl hover:bg-gray-900/30"
                >
                  <ArrowLeft
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  กลับไปหน้าเข้าสู่ระบบ / Back to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-[#111829] to-[#0d1420] flex items-center justify-center p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden z-0">
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}

        {/* linear orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative bg-[#161f2f]/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl w-full max-w-lg p-6 md:p-8 transform transition-all duration-300 z-10">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-blue-500/30 rounded-tl-xl"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-purple-500/30 rounded-tr-xl"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/30 rounded-bl-xl"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-blue-500/30 rounded-br-xl"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 animate-ping bg-blue-900/20 rounded-full opacity-75"></div>
            <div className="relative w-20 h-20 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg border border-blue-800/50">
              <Mail className="text-white" size={36} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            รีเซ็ตรหัสผ่าน 🔐
          </h2>
          <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-3">
            Reset Password
          </h3>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Shield size={16} className="text-blue-400" />
            <p>กรุณากรอกอีเมลที่ใช้ในการลงทะเบียน</p>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Please enter your registered email address
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="animate-slideIn bg-linear-to-r from-red-900/20 to-pink-900/20 border border-red-800/50 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm">
              <div className="p-2 bg-red-900/30 rounded-lg border border-red-800/30 shrink-0">
                <AlertCircle className="text-red-400" size={20} />
              </div>
              <div>
                <p className="font-medium text-red-300 mb-1">เกิดข้อผิดพลาด</p>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className=" text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"
            >
              <Mail size={16} className="text-blue-400" />
              อีเมล / Email <span className="text-red-400">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail
                  className={`
                    ${
                      getEmailValidationState() === "valid"
                        ? "text-green-400"
                        : getEmailValidationState() === "invalid"
                        ? "text-red-400"
                        : "text-gray-500"
                    } transition-colors
                  `}
                  size={20}
                />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailTouched) setEmailTouched(true);
                }}
                onKeyPress={handleKeyPress}
                onBlur={() => setEmailTouched(true)}
                className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 outline-none transition-all duration-300 placeholder:text-gray-500 backdrop-blur-sm
                  ${
                    getEmailValidationState() === "valid"
                      ? "border-green-700/50 focus:ring-green-500/20 focus:border-green-500"
                      : getEmailValidationState() === "invalid"
                      ? "border-red-700/50 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-700 focus:ring-blue-500/20 focus:border-blue-500"
                  }
                  ${isLoading ? "bg-gray-900/50" : "bg-gray-900/30"}
                  text-gray-300
                `}
                placeholder="example@cmu.ac.th"
                disabled={isLoading}
              />

              {/* Validation Indicator */}
              {emailTouched && email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {getEmailValidationState() === "valid" ? (
                    <CheckCircle
                      className="text-green-400 animate-scaleIn"
                      size={20}
                    />
                  ) : getEmailValidationState() === "invalid" ? (
                    <AlertCircle
                      className="text-red-400 animate-scaleIn"
                      size={20}
                    />
                  ) : null}
                </div>
              )}
            </div>

            {/* Validation Hint */}
            {emailTouched && getEmailValidationState() === "invalid" && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} />
                กรุณากรอกอีเมลให้ถูกต้อง (เช่น example@cmu.ac.th)
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full relative group overflow-hidden"
          >
            {/* Background */}
            <div
              className={`absolute inset-0 bg-linear-to-r rounded-xl transition-all duration-300 ${
                isLoading
                  ? "from-gray-800 to-gray-900"
                  : "from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700"
              }`}
            ></div>

            {/* Shine effect */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="absolute -inset-100% bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </div>

            <div
              className={`relative py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition-transform group-hover:-translate-y-0.5 active:scale-95 ${
                isLoading ? "text-gray-400" : "text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse">
                    กำลังส่ง... / Sending...
                  </span>
                </>
              ) : (
                <>
                  <Send
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span>ส่งลิงก์รีเซ็ตรหัสผ่าน / Send Reset Link</span>
                </>
              )}
            </div>
          </button>

          {/* Security Indicators */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-gray-500">Secure Auth</span>
            </div>
            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-green-400" />
              <span className="text-xs text-gray-500">PDPA</span>
            </div>
          </div>

          {/* Back to Login */}
          {onBack && (
            <button
              onClick={onBack}
              className="w-full text-gray-400 hover:text-gray-300 py-3 transition-colors font-medium flex items-center justify-center gap-2 hover:gap-3 group border border-gray-800/50 rounded-xl hover:bg-gray-900/30"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              กลับไปหน้าเข้าสู่ระบบ / Back to Login
            </button>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-800/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-900/30 rounded-lg border border-gray-800/30 shrink-0">
              <AlertCircle className="text-gray-500" size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 mb-1">
                หากคุณไม่ได้ลงทะเบียนหรือลืมอีเมลที่ใช้ กรุณาติดต่อเจ้าหน้าที่
                053-948-095
              </p>
              <p className="text-xs text-gray-500">
                If you haven't registered or forgot your email, please contact
                the administrator. 053-948-095
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
