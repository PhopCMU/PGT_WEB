import { useState } from "react";
import { User, LogOut, Mail } from "lucide-react";
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

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow">
              <span className="text-white font-bold text-sm">
                {user?.fnameEn?.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="hidden lg:block text-left">
            <h3 className="font-bold text-gray-900 text-base truncate">
              {user?.fnameEn} {user?.lnameEn}
            </h3>

            <p className="text-sm text-gray-600 mt-0.5 truncate">
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
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg  border border-gray-200 z-20 animate-fadeIn">
              {/* User Info */}
              <div className="p-5 bg-linear-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-purple-600 
                                      flex items-center justify-center shadow-md"
                    >
                      <span className="text-white font-bold text-base">
                        {user?.fnameEn?.charAt(0)}
                      </span>
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 
                                      rounded-full border-2 border-white"
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base truncate">
                      {user?.fnameEn} {user?.lnameEn}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5 truncate">
                      {user?.cecode ? user?.cecode : "No License number"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 border-b border-gray-300">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50  text-blue-700 rounded-lg text-sm font-medium text-[10px]">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    {status}
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50  text-teal-700 rounded-lg text-sm font-medium text-[10px]">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    {user?.codeId}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2 max-h-96 overflow-y-auto">
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
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 
                                 hover:bg-gray-50 transition-colors duration-150 text-sm font-medium
                                 ${
                                   index === 2
                                     ? "text-red-600 hover:bg-red-50"
                                     : ""
                                 }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-gray-500 group-hover/item:text-blue-500" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-300 bg-gray-50 rounded-b-xl">
                <div className="text-xs text-gray-500 text-center">
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
