import { Menu, Lock, QrCode, Download, Home, MoreVertical } from "lucide-react";

import ProfileDropdown from "../ProfileDropdown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({
  onOpenSlideMenu,
  user,
}: // points,
{
  onOpenSlideMenu: () => void;
  user?: any;
  // points?: number;
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const navigate = useNavigate();

  const openQRScanner = async () => {
    navigate("/scan");
  };

  const showPWAInstallGuide = () => {
    // Logic สำหรับแสดงวิธีการติดตั้ง PWA แบบแยกแพลตฟอร์ม
    alert(
      "📱 วิธีการติดตั้งแอป (PWA)\n\n" +
        "--- สำหรับ iOS (Safari) ---\n" +
        "1. แตะปุ่ม 'แชร์' (ไอคอนสี่เหลี่ยมลูกศรชี้ขึ้น)\n" +
        "2. เลือกเมนู 'เพิ่มไปยังหน้าจอโฮม' (Add to Home Screen)\n\n" +
        "--- สำหรับ Android (Chrome) ---\n" +
        "1. แตะไอคอน 'สามจุด' (เมนู) ที่มุมขวาบน\n" +
        "2. เลือก 'ติดตั้งแอป' (Install App) หรือ 'เพิ่มลงในหน้าจอหลัก'",
    );
  };

  return (
    <>
      {/* Main Header */}
      <header className="fixed  top-0 z-1000 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8  mx-auto">
          {/* First Row: Mobile Compact */}
          <div className="flex items-center justify-between h-16 sm:h-16 md:h-22">
            {/* Left: Menu & Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Menu Button - Mobile & Tablet */}
              <button
                onClick={onOpenSlideMenu}
                className="p-2 sm:p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 
                   transition-all duration-200 active:scale-95 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Logo - Mobile */}
              <div className="lg:hidden">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-base sm:text-lg">
                      P
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-sm sm:text-base tracking-tight">
                      PGT CMU
                    </span>
                  </div>
                </div>
              </div>

              {/* Logo - Desktop (เพิ่มใหม่) */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-lg tracking-tight">
                    PGT CMU
                  </span>
                  <span className="text-xs text-gray-500 -mt-0.5">
                    Faculty of Veterinary Medicine Chiang Mai University
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Quick Actions - Mobile & Tablet */}
              {/* <div className="relative sm:hidden">
                <button
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="p-2 rounded-xl text-gray-600 hover:bg-gray-50 
                     hover:text-gray-900 transition-colors duration-200"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div> */}

              {/* User Profile */}
              {user?.role ? (
                <ProfileDropdown />
              ) : (
                <button
                  onClick={() => (window.location.href = "/sign-in")}
                  className="px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 
                     hover:to-blue-800 text-white text-sm sm:text-base rounded-xl font-semibold 
                     transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      // Mobile Bottom Navigation Bar
      <div className="fixed z-1000 bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg sm:hidden">
        <div className="flex items-center justify-around px-2 py-0">
          {/* Home / Dashboard */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <Home
              className={`w-5 h-5 ${
                location.pathname === "/dashboard"
                  ? "text-indigo-600"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs ${
                location.pathname === "/dashboard"
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              หน้าหลัก
            </span>
          </button>

          {/* QR Scanner (Primary Action) */}
          <button
            onClick={() => (user ? openQRScanner() : undefined)}
            className={`relative -top-8 flex flex-col items-center ${user ? "" : "opacity-40"}`}
            disabled={!user}
            aria-disabled={!user}
            title={user ? "สแกน QR" : "ต้องเข้าสู่ระบบเพื่อสแกน QR"}
          >
            {/* Floating Button */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-shadow ${
                user
                  ? "bg-linear-to-br from-indigo-600 to-purple-600 hover:shadow-xl active:scale-95"
                  : "bg-gray-200"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  user
                    ? "bg-linear-to-br from-indigo-500 to-purple-500"
                    : "bg-gray-300"
                }`}
              >
                <QrCode
                  className={`${user ? "w-7 h-7 text-white" : "w-7 h-7 text-gray-400"}`}
                />
              </div>

              {/* Animated Ring */}
              {user && (
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-75"></div>
              )}
            </div>
            <span
              className={`text-xs font-medium mt-1 ${user ? "text-gray-700" : "text-gray-400"}`}
            >
              สแกน QR
            </span>
          </button>

          {/* Quick Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              <MoreVertical
                className={`w-5 h-5 ${
                  showMoreActions ? "text-indigo-600" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs ${
                  showMoreActions
                    ? "text-indigo-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                เพิ่มเติม
              </span>
            </button>

            {/* More Actions Dropdown */}
            {showMoreActions && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                {/* Arrow */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>

                <div className="p-2">
                  {/* Favorite Projects */}
                  {/* <button
                    onClick={() => {
                      navigate("/project-r");
                      setShowMoreActions(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-amber-50 text-left transition-colors"
                  >
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Bookmark className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        โปรเจคที่เลือก
                      </div>
                      <div className="text-xs text-gray-500">
                        {favoritesCount} รายการ
                      </div>
                    </div>
                  </button> */}

                  {/* PWA Installation Guide */}
                  <button
                    onClick={() => {
                      showPWAInstallGuide();
                      setShowMoreActions(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-emerald-50 text-left transition-colors"
                  >
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Download className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        ติดตั้ง PWA
                      </div>
                      <div className="text-xs text-gray-500">
                        วิธีติดตั้งแอป
                      </div>
                    </div>
                  </button>

                  {/* Divider */}
                  {/* <div className="h-px bg-gray-200 my-1"></div> */}

                  {/* Additional Actions */}
                  {/* <button
                    onClick={() => {
                      navigate("/attendance");
                      setShowMoreActions(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">ลงเวลาเข้างาน</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/reports");
                      setShowMoreActions(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      รายงานประจำวัน
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/notifications");
                      setShowMoreActions(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <Bell className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">การแจ้งเตือน</span>
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
