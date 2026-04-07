import React, { useState, useEffect } from "react";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Database,
  ShieldCheck,
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
        setCountdown(30);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(
        "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ / Unable to connect to server",
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
      <div className="max-w-lg w-full">
        <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 transform transition-all duration-300 z-10">
          <div className="relative mb-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              ส่งอีเมลสำเร็จ! 🎉
            </h2>
            <p className="text-gray-500 font-bold">Email Sent Successfully!</p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-blue-600" size={20} />
              <p className="text-sm font-bold text-blue-900">ส่งไปยังอีเมล:</p>
            </div>
            <p className="font-black text-blue-700 text-lg break-all">
              {email}
            </p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-amber-600 shrink-0 mt-0.5"
                size={20}
              />
              <div className="text-left">
                <p className="font-black text-amber-900 text-sm mb-1">
                  คำแนะนำสำคัญ:
                </p>
                <ul className="space-y-1.5 text-sm text-amber-800 font-medium">
                  <li>📧 กรุณาตรวจสอบอีเมลและคลิกลิงก์</li>
                  <li>⏱️ ลิงก์มีอายุ 30 นาที</li>
                  <li>⚠️ หากไม่พบกรุณาดูใน Spam</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {countdown > 0 ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin" size={20} />
                  ส่งใหม่ได้ใน {countdown} วินาที
                </span>
              ) : (
                "ส่งอีเมลอีกครั้ง / Resend Email"
              )}
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="w-full text-gray-500 hover:text-gray-900 py-3 font-bold transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                กลับหน้าเข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg w-full">
      <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 transform transition-all duration-300 z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Mail className="text-blue-600" size={36} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">
            รีเซ็ตรหัสผ่าน 🔐
          </h2>
          <h3 className="text-lg font-bold text-gray-400">Reset Password</h3>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-bold text-red-900">{error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Mail size={16} className="text-blue-600" />
              อีเมล / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={() => setEmailTouched(true)}
                className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-4 outline-none transition-all font-medium ${
                  emailTouched && email && !validateEmail(email)
                    ? "border-red-200 focus:ring-red-500/10"
                    : "border-gray-100 focus:ring-blue-500/10 focus:border-blue-500"
                }`}
                placeholder="example@cmu.ac.th"
                disabled={isLoading}
              />
            </div>
          </div>

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

          {/* Validation Hint */}
          {emailTouched && getEmailValidationState() === "invalid" && (
            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} />
              กรุณากรอกอีเมลให้ถูกต้อง (เช่น example@cmu.ac.th)
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="animate-spin mx-auto" size={24} />
            ) : (
              "ส่งลิงก์รีเซ็ตรหัสผ่าน / Send Reset Link"
            )}
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full text-gray-500 hover:text-gray-900 py-3 font-bold transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              กลับหน้าเข้าสู่ระบบ
            </button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Secure
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                PDPA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
