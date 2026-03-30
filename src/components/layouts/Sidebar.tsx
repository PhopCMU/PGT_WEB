import {
  Home,
  User,
  Calendar,
  LogOut,
  ChevronRight,
  Command,
  DatabaseBackupIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any; // อนุญาตให้เป็น undefined หรือ null
}

const Sidebar = ({ isOpen, onClose, user }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const baseMenuItems = [
    { icon: Home, label: "โครงการสัมมนา", path: "/dashboard" }, // แก้ path
    {
      icon: DatabaseBackupIcon,
      label: "โปรเจคที่สมัคร",
      path: "/project-registration-list",
      showIf: (u: any) => !!u?.role,
    },
    {
      icon: User,
      label: "โปรไฟล์",
      path: "/profile",
      showIf: (u: any) => !!u?.role, // ปลอดภัย
    },
  ];

  const bottomItems = [
    {
      icon: LogOut,
      label: "ออกจากระบบ",
      path: "/logout",
      showIf: (u: any) => !!u?.role, // ปลอดภัย
    },
  ];

  // กรองเมนูให้แสดงเฉพาะที่ผ่านเงื่อนไข
  const visibleMenuItems = baseMenuItems.filter(
    (item) => !item.showIf || item.showIf(user)
  );

  const visibleBottomItems = bottomItems.filter(
    (item) => !item.showIf || item.showIf(user)
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("pgt_token");
    navigate("/sign-in");
    onClose();
  };

  const hasRole = !!user?.role;

  return (
    <>
      {/* Overlay สำหรับมือถือ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-1500 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className="relative">
        <aside
          className={`
            fixed top-0 left-0 h-screen bg-linear-to-b from-gray-900 to-gray-800 
            text-white  transition-all duration-300 ease-in-out
            w-72 shadow-2xl border-r border-gray-700/50 flex flex-col
            ${isOpen ? "translate-x-0 z-9999" : "-translate-x-full z-50"}
            lg:translate-x-0 lg:w-72 lg:h-screen lg:sticky lg:top-0
          `}
        >
          {/* Close Button - แสดงเฉพาะมือถือ */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-6 right-4 p-2 hover:bg-gray-700/50 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Logo/Header */}
          <div className="px-6 pt-6 pb-4 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PGT CMU
                </h1>
                <p className="text-xs text-gray-400">ระบบโครงการสัมมนา</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4 sidebar-scrollbar lg:pt-10">
            <nav className="px-4">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
                  เมนูหลัก
                </h3>
                <ul className="space-y-1">
                  {visibleMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <li key={index}>
                        <Link
                          to={item.path}
                          onClick={onClose}
                          className={`
                            flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                            ${
                              active
                                ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 text-white border-l-4 border-blue-500"
                                : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`w-5 h-5 ${
                                active ? "text-blue-400" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                active ? "font-semibold" : ""
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                          {active && (
                            <ChevronRight className="w-4 h-4 text-blue-400" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {!user?.role && (
                <div className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-linear-to-r from-amber-50/80 to-yellow-50/80 p-4 backdrop-blur-sm">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                    <div className="w-24 h-24 bg-amber-200/20 rounded-full blur-xl"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 bg-yellow-200/20 rounded-full blur-xl"></div>
                  </div>

                  <div className="relative">
                    {/* Header with icon */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1">
                            <Command className="w-4 h-4 text-amber-950" />
                            ขั้นตอนการใช้งาน
                          </h4>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                            สำคัญ
                          </span>
                        </div>
                        <p className="text-amber-800 text-sm leading-relaxed">
                          เพื่อการสมัครเข้าร่วมโครงการสัมมนาและชำระเงินค่าเข้าร่วมโครงการ
                          กรุณาดำเนินการตามขั้นตอนดังนี้
                        </p>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2.5 ml-4">
                      {/* Step 1 */}
                      <div className="flex items-center gap-2">
                        <div className="shrink-0 w-5 h-5 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center">
                          <span className="text-amber-600 font-bold text-xs">
                            1
                          </span>
                        </div>
                        <span className="text-amber-700 font-medium text-sm">
                          สมัครสมาชิก
                        </span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-center gap-2">
                        <div className="shrink-0 w-5 h-5 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center">
                          <span className="text-amber-600 font-bold text-xs">
                            2
                          </span>
                        </div>
                        <span className="text-amber-700 font-medium text-sm">
                          เข้าสู่ระบบ
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-center gap-2">
                        <div className="shrink-0 w-5 h-5 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center">
                          <span className="text-amber-600 font-bold text-xs">
                            3
                          </span>
                        </div>
                        <span className="text-amber-700 font-medium text-sm">
                          สมัครโครงการสัมมนา
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex items-center gap-2">
                        <div className="shrink-0 w-5 h-5 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center">
                          <span className="text-amber-600 font-bold text-xs">
                            4
                          </span>
                        </div>
                        <span className="text-amber-700 font-medium text-sm">
                          ชำระเงิน
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigate("/register")}
                        className="flex-1 px-4 py-2.5 bg-linear-to-r text-[11px] from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                      >
                        สมัครสมาชิก
                      </button>
                      <button
                        onClick={() => navigate("/sign-in")}
                        className="flex-1 px-4 py-2.5 text-[11px] bg-white border border-amber-300 hover:border-amber-400 text-amber-700 font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                      >
                        เข้าสู่ระบบ
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Menu (เฉพาะผู้ใช้ที่ login) */}
              {visibleBottomItems.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
                    {hasRole ? "เมนูอื่นๆ" : ""}
                  </h3>
                  <ul className="space-y-1">
                    {visibleBottomItems.map((item, index) => {
                      const Icon = item.icon;
                      const isLogout = item.path === "/logout";

                      return (
                        <li key={index}>
                          {isLogout ? (
                            <button
                              onClick={handleLogout}
                              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-300 
                                hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">
                                  {item.label}
                                </span>
                              </div>
                            </button>
                          ) : (
                            <Link
                              to={item.path}
                              onClick={onClose}
                              className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 
                                hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">
                                  {item.label}
                                </span>
                              </div>
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700/50 p-4 bg-gray-900/50">
            <div className="px-4 py-3 bg-gray-800/30 backdrop-blur-sm rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">สถานะระบบ</span>
                {hasRole ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs text-emerald-400">
                      ใช้งานได้ปกติ
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs text-red-400">
                      ไม่สามารถใช้งานได้
                    </span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Version {import.meta.env.VITE_APP_VERSION}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

// Icon X สำหรับปิด sidebar
const X = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default Sidebar;
