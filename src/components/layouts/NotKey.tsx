import { XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotKey() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-20"></div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Decorative Header */}
          <div className="h-2 bg-linear-to-r from-red-500 via-red-400 to-red-300"></div>

          <div className="p-8 sm:p-10">
            {/* Icon Container */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Outer Ring */}
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center shadow-lg">
                  {/* Inner Ring */}
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-red-100 to-red-200 flex items-center justify-center shadow-inner">
                    {/* Main Icon */}
                    <div className="relative">
                      <XCircle className="w-12 h-12 text-red-500" />
                      <AlertTriangle className="w-6 h-6 text-red-600 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Animated Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-20"></div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-3">
              ไม่พบรหัสยืนยัน
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-center text-lg mb-2">
              รหัสยืนยันไม่ถูกต้องหรือหมดอายุ
            </p>

            {/* Description */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium mb-2">
                    สาเหตุที่เป็นไปได้:
                  </p>
                  <ul className="space-y-2 text-red-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"></span>
                      <span>รหัสยืนยันหมดอายุแล้ว (อายุ 24 ชั่วโมง)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"></span>
                      <span>ลิงก์ที่ใช้ไม่ถูกต้องหรือไม่สมบูรณ์</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Solutions Section */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 text-center mb-4 text-lg">
                วิธีแก้ไขปัญหา
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Request New Code */}
                <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-blue-900">ขอรหัสใหม่</h4>
                  </div>
                  <p className="text-blue-800 text-sm mb-4">
                    ขอรหัสยืนยันใหม่ได้ที่หน้าลืมรหัสผ่านหรือยืนยันอีเมล
                  </p>
                  <Link
                    to="/sign-in"
                    className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
                  >
                    ขอรหัสใหม่
                  </Link>
                </div>

                {/* Contact Support */}
                <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-bold text-purple-900">ติดต่อทีมงาน</h4>
                  </div>
                  <p className="text-purple-800 text-sm mb-4">
                    ติดต่อทีมงาน PGT CMU เพื่อขอความช่วยเหลือเพิ่มเติม
                  </p>
                  <Link
                    to="/contact"
                    className="block w-full text-center py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors duration-200"
                  >
                    ติดต่อเรา
                  </Link>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm text-center">
                มีปัญหาเพิ่มเติม? ติดต่อ:{" "}
                <a
                  href="mailto:support@pgt-cmu.ac.th"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  support@pgt-cmu.ac.th
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PGT CMU Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
