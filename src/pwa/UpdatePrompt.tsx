import { CheckCircle, RefreshCw, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export const UpdatePrompt: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(err) {
      console.error("SW register error:", err);
    },
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (needRefresh || offlineReady) {
      setIsVisible(true);
    }
  }, [needRefresh, offlineReady]);

  const close = () => {
    setIsVisible(false);
    setTimeout(() => {
      setNeedRefresh(false);
      setOfflineReady(false);
    }, 300);
  };

  const onRefresh = async () => {
    await updateServiceWorker(true);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-9999 transform transition-transform duration-500 ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                {needRefresh ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-semibold">
                  {needRefresh
                    ? "อัพเดตใหม่พร้อมใช้งาน"
                    : "พร้อมใช้งานแบบออนไลน์"}
                </p>
                <p className="text-sm text-white/90">
                  {needRefresh
                    ? "คลิกอัพเดตเพื่อรับฟีเจอร์ใหม่"
                    : "แอปของคุณพร้อมใช้งานโดยต้องต่ออินเทอร์เน็ต"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {needRefresh && (
                <button
                  onClick={close}
                  className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  ภายหลัง
                </button>
              )}
              <button
                onClick={needRefresh ? onRefresh : close}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  needRefresh
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                }`}
              >
                {needRefresh ? "อัพเดต" : "ตกลง"}
              </button>
              <button
                onClick={close}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
