import {
  Home,
  User,
  Calendar,
  LogOut,
  Command,
  DatabaseBackupIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

const Sidebar = ({ isOpen, onClose, user }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const baseMenuItems = [
    { icon: Home, label: "โครงการสัมมนา", path: "/dashboard" },
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
      showIf: (u: any) => !!u?.role,
    },
  ];

  const bottomItems = [
    {
      icon: LogOut,
      label: "ออกจากระบบ",
      path: "/logout",
      showIf: (u: any) => !!u?.role,
    },
  ];

  const visibleMenuItems = baseMenuItems.filter(
    (item) => !item.showIf || item.showIf(user),
  );

  const visibleBottomItems = bottomItems.filter(
    (item) => !item.showIf || item.showIf(user),
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-1500 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className="relative">
        <aside
          className={`
            fixed top-0 left-0 h-screen bg-white 
            transition-all duration-300 ease-in-out
            w-72 shadow-xl border-r border-gray-100 flex flex-col
            ${isOpen ? "translate-x-0 z-9999" : "-translate-x-full z-50"}
            lg:translate-x-0 lg:w-72 lg:h-screen lg:sticky lg:top-0
          `}
        >
          {/* Logo/Header */}
          <div className="px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 leading-tight">
                  PGT CMU
                </h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Graduate Studies
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4 sidebar-scrollbar">
            <nav className="px-4 space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">
                  Main Menu
                </h3>
                <ul className="space-y-1.5">
                  {visibleMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <li key={index}>
                        <Link
                          to={item.path}
                          onClick={onClose}
                          className={`
                            flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                            ${
                              active
                                ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                                active ? "text-blue-600" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`text-sm font-bold ${
                                active ? "font-black" : ""
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                          {active && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {!user?.role && (
                <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 p-5">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-100">
                        <Command className="w-4 h-4 text-amber-700" />
                      </div>
                      <h4 className="font-black text-amber-900 text-sm">
                        ขั้นตอนการใช้งาน
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className="shrink-0 w-5 h-5 rounded-full bg-white border border-amber-200 flex items-center justify-center shadow-sm">
                            <span className="text-amber-700 font-black text-[10px]">
                              {step}
                            </span>
                          </div>
                          <span className="text-amber-800 font-bold text-xs">
                            {step === 1
                              ? "สมัครสมาชิก"
                              : step === 2
                                ? "เข้าสู่ระบบ"
                                : step === 3
                                  ? "สมัครโครงการ"
                                  : "ชำระเงิน"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        onClick={() => navigate("/register")}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-600/20"
                      >
                        สมัครสมาชิก
                      </button>
                      <button
                        onClick={() => navigate("/sign-in")}
                        className="w-full py-2.5 bg-white border border-amber-200 text-amber-700 font-black text-xs rounded-xl hover:bg-amber-50 transition-all"
                      >
                        เข้าสู่ระบบ
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {visibleBottomItems.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">
                    Other Menu
                  </h3>
                  <ul className="space-y-1.5">
                    {visibleBottomItems.map((item, index) => {
                      const Icon = item.icon;
                      const isLogout = item.path === "/logout";

                      return (
                        <li key={index}>
                          {isLogout ? (
                            <button
                              onClick={handleLogout}
                              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-600 
                                hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                                <span className="text-sm font-bold">
                                  {item.label}
                                </span>
                              </div>
                            </button>
                          ) : (
                            <Link
                              to={item.path}
                              onClick={onClose}
                              className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 
                                hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-bold">
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
          <div className="p-4 border-t border-gray-50">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  System Status
                </span>
                {hasRole ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase">
                      Online
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Guest Mode
                  </span>
                )}
              </div>
              <div className="text-[10px] font-black text-gray-400">
                VER {__APP_VERSION__}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
