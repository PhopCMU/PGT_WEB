import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { getUserFromToken } from "../../utils/authService";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userProfile = getUserFromToken();
  // const { user, loading } = useUserProfile();

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       กำลังโหลด...
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex flex-col  bg-linear-to-br from-gray-200 via-[#fcfdff] to-[#e7ecf4]">
      <Header
        onOpenSlideMenu={openSidebar}
        user={userProfile}
        // points={user?.points}
      />

      <div className="flex flex-1 pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          user={userProfile}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden ">
          <div className=" mx-auto pb-30 ">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
