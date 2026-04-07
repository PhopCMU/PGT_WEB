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

  if (!key) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="h-1.5 bg-linear-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>

          <div className="p-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-red-50 flex items-center justify-center border border-red-100 shadow-inner">
                  <Clock className="w-12 h-12 text-red-500" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-2 -right-2">
                  <span className="flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-black text-gray-900 leading-tight">ลิงก์หมดอายุแล้ว</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Link Expired</p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-5 mb-6 border border-amber-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-amber-900 font-black text-sm mb-1">หมายเหตุ</p>
                  <p className="text-amber-800 text-sm font-medium leading-relaxed">
                    ลิงก์สำหรับตั้งรหัสผ่านใหม่มีอายุ 30 นาที และได้หมดเวลาลงแล้ว กรุณาขอรหัสใหม่
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/sign-in")}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <RefreshCw size={20} />
              ขอลิงก์ใหม่อีกครั้ง
            </button>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Email</p>
                  <p className="text-sm font-black text-gray-700 truncate">pgt.cmu@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-8 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <Shield size={12} /> Secure PGT Platform
        </p>
      </div>
    </div>
  );
};

export default LinkExpired;
