import { useState } from "react";
import { User, LogOut, Mail, BadgeCheck } from "lucide-react";
import { getUserFromToken, removeToken } from "../utils/authService";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUserFromToken();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    (removeToken(), navigate("/sign-in"));
  };

  const menuItems = [
    {
      icon: User,
      label: "โปรไฟล์ของฉัน",
      path: () => {
        navigate("/profile");
        setIsOpen(false);
      },
    },

    {
      icon: LogOut,
      label: "ออกจากระบบ",
      path: () => {
        handleLogout();
      },
    },
  ];

  const status =
    user?.role === "Vet"
      ? "Veterinarian"
      : user?.role === "Student"
        ? "Student"
        : user?.role === "Scientist"
          ? "Scientist"
          : user?.role === "Vet nurse"
            ? "Veterinary Nurse"
            : user?.role === "Vet tech"
              ? "Veterinary Technician"
              : "Guest";

  // Role-based badge colors (soft, accessible)
  const getRoleBadgeStyles = () => {
    switch (user?.role) {
      case "Vet":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Student":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Scientist":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Vet nurse":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "Vet tech":
        return "bg-sky-50 text-sky-700 border-sky-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-semibold text-sm">
                {user?.fnameEn?.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="hidden lg:block text-left">
            <h3 className="font-semibold text-gray-900 text-sm truncate max-w-37.5">
              {user?.fnameEn} {user?.lnameEn}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-37.5">
              {user?.codeId}
            </p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 animate-fadeIn overflow-hidden">
              {/* User Info Header */}
              <div className="px-5 pt-5 pb-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 
                                      flex items-center justify-center shadow-md"
                    >
                      <span className="text-white font-bold text-lg">
                        {user?.fnameEn?.charAt(0)}
                      </span>
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 
                                      rounded-full border-2 border-white shadow-sm"
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate">
                      {user?.fnameEn} {user?.lnameEn}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                      <p className="text-xs text-gray-500 truncate">
                        {user?.cecode ? user?.cecode : "No License number"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/30">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate text-gray-700">{user?.email}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleBadgeStyles()}`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
                    {status}
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    ID: {user?.codeId}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item, index) => (
                  <button
                    onClick={
                      item.path
                        ? () => {
                            if (typeof item.path === "function") {
                              item.path();
                            }
                          }
                        : undefined
                    }
                    key={index}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 
                                 hover:bg-gray-50 transition-all duration-150 text-sm font-medium
                                 ${
                                   item.label === "ออกจากระบบ"
                                     ? "hover:bg-red-50 text-red-600 hover:text-red-700"
                                     : ""
                                 }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-5 h-5 ${
                          item.label === "ออกจากระบบ"
                            ? "text-red-400 group-hover:text-red-500"
                            : "text-gray-400 group-hover:text-blue-500"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                <div className="text-xs text-gray-400 text-center">
                  V.{__APP_VERSION__} • © 2026 PGT CMU
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileDropdown;
