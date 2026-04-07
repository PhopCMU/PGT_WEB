import { CheckCircle, RefreshCw, X, Loader2 } from "lucide-react";
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
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // ตรวจสอบเวอร์ชันใน localStorage
    const savedVersion = localStorage.getItem("app_version");
    const currentVersion = __APP_VERSION__;

    if (!savedVersion) {
      // ถ้ายังไม่มีการบันทึกเวอร์ชัน ให้บันทึกเวอร์ชันปัจจุบันลงไป
      localStorage.setItem("app_version", currentVersion);
    } else if (savedVersion !== currentVersion) {
      // ถ้าเวอร์ชันไม่ตรงกัน ให้แสดงป๊อปอัพอัพเดต
      setNeedRefresh(true);
      setIsVisible(true);
    }
  }, [setNeedRefresh]);

  useEffect(() => {
    if (needRefresh || offlineReady) {
      setIsVisible(true);
    }
  }, [needRefresh, offlineReady]);

  const close = () => {
    if (isUpdating || needRefresh) return; // ห้ามปิดขณะกำลังอัพเดตหรือมีอัพเดตรอ
    setIsVisible(false);
    setTimeout(() => {
      setNeedRefresh(false);
      setOfflineReady(false);
    }, 300);
  };

  const onRefresh = async () => {
    setIsUpdating(true);

    try {
      // บันทึกเวอร์ชันล่าสุดลง localStorage ก่อนอัพเดต
      localStorage.setItem("app_version", __APP_VERSION__);

      // ล้าง Cache และ Service Worker เพื่อความมั่นใจว่าได้ของใหม่จริงๆ
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          await caches.delete(name);
        }
      }

      // สั่งอัพเดตผ่าน Vite PWA Plugin
      await updateServiceWorker(true);

      // ถ้า updateServiceWorker ไม่ทำการ reload ให้ เราจะบังคับ reload เอง
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Update failed:", error);
      setIsUpdating(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop ล็อกหน้าจอเมื่อมีอัพเดตบังคับ */}
      {needRefresh && (
        <div className="fixed inset-0 z-9998 bg-black/60 backdrop-blur-sm" />
      )}
      <div
        className={`fixed inset-x-0 top-0 z-9999 transform transition-transform duration-500 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg relative overflow-hidden">
          {/* Loading Overlay */}
          {isUpdating && (
            <div className="absolute inset-0 bg-blue-700/80 backdrop-blur-sm z-20 flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-bold tracking-wide">
                กำลังรีเซ็ตและอัพเดตระบบ...
              </span>
            </div>
          )}

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
                      ? "อัพเดตใหม่พร้อมใช้งาน (v" + __APP_VERSION__ + ")"
                      : "พร้อมใช้งานแบบออนไลน์"}
                  </p>
                  <p className="text-sm text-white/90">
                    {needRefresh
                      ? "คลิกอัพเดตเพื่อรับฟีเจอร์ใหม่และรีเซ็ตระบบ"
                      : "แอปของคุณพร้อมใช้งานโดยไม่ต้องต่ออินเทอร์เน็ต"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={needRefresh ? onRefresh : close}
                  disabled={isUpdating}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                    needRefresh
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      กำลังอัพเดต
                    </>
                  ) : needRefresh ? (
                    "อัพเดต"
                  ) : (
                    "ตกลง"
                  )}
                </button>
                {!isUpdating && !needRefresh && (
                  <button
                    onClick={close}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
