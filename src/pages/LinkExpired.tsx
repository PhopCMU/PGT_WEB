import { Clock, AlertCircle, RefreshCw, Mail, Shield } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LinkExpired = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const key = queryParams.get("key");
  const navigate = useNavigate();

  useEffect(() => {
    if (!key) {
      navigate("/sign-in", { replace: true });
    }
  }, [key, navigate]);

  if (!key) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Animated Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-linear-to-br from-red-100/40 to-pink-100/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-linear-to-br from-blue-100/30 to-cyan-100/20 rounded-full blur-3xl"></div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
          {/* Animated Status Bar */}
          <div className="h-1.5 bg-linear-to-r from-red-500 via-red-400 to-red-300 animate-pulse"></div>

          <div className="p-8 sm:p-10">
            {/* Icon Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Outer Ring */}
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center shadow-lg animate-in zoom-in duration-700">
                  {/* Inner Ring with Pulse Effect */}
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-red-100 to-red-200 flex items-center justify-center shadow-inner">
                    {/* Clock Icon with Animation */}
                    <Clock
                      className="w-10 h-10 text-red-500 animate-in spin-in duration-1000"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Expired Badge */}
                <div className="absolute -top-1 -right-1">
                  <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-bounce shadow-md">
                    หมดอายุ
                  </div>
                </div>
              </div>
            </div>

            {/* Title with linear Text */}
            <h2 className="text-3xl font-bold bg-linear-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-3 text-center">
              ลิงก์หมดอายุแล้ว
            </h2>

            {/* Description Card */}
            <div className="bg-linear-to-br from-red-50/60 to-orange-50/40 border border-red-100 rounded-2xl p-5 mb-7 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle
                      className="w-5 h-5 text-red-600"
                      strokeWidth={2}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-red-800 font-medium mb-1.5">
                    หมายเหตุสำคัญ
                  </p>
                  <p className="text-red-700 text-sm leading-relaxed">
                    ลิงก์สำหรับตั้งรหัสผ่านใหม่หมดอายุแล้ว (มีอายุ 30 นาที)
                    กรุณาขอรหัสใหม่เพื่อดำเนินการต่อ
                  </p>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-linear-to-br from-blue-50/60 to-cyan-50/40 border border-blue-100 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-blue-800 font-medium text-sm mb-1">
                    ความปลอดภัยของบัญชีคุณ
                  </p>
                  <p className="text-blue-700 text-xs">
                    ลิงก์หมดอายุเพื่อป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต
                  </p>
                </div>
              </div>
            </div>

            {/* Time Limit Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" strokeWidth={2} />
                <span>ลิงก์ตั้งรหัสผ่านมีอายุจำกัด 30 นาที</span>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {/* Request New Link Button */}
              <button
                onClick={() => navigate("/sign-in")}
                className="group relative overflow-hidden bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <RefreshCw
                    className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                    strokeWidth={2}
                  />
                  <span>ขอรหัสใหม่</span>
                </div>
              </button>
            </div>

            {/* Alternative Contact Option */}
            <div className="border border-gray-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Mail
                      className="w-5 h-5 text-purple-600"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm mb-1">
                    ติดต่อทีมงานหากมีปัญหา
                  </p>
                  <a
                    href="mailto:pgt.cmu@gmail.com"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors inline-flex items-center gap-1"
                  >
                    pgt.cmu@gmail.com
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <p className="text-gray-500 text-sm text-center">
                ระบบป้องกันความปลอดภัย PGT CMU Platform
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure Connection • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkExpired;
