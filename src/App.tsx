import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import Layout from "./components/layouts/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import NewPasswordForm from "./components/auth/NewPasswordForm";
import LinkExpired from "./pages/LinkExpired";
// import NotFound from "./pages/NotFound";
import ProjectRegistrationList from "./pages/ProjectRegistrationList";
import UserProfilePage from "./pages/Profile";
import ScanQrCode from "./components/ScanQrCode";
import Sponsor from "./pages/Sponsor";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // ซ่อน splash screen หลังจากโหลดเสร็จ
    const timer = setTimeout(() => {
      setShowSplash(false);

      // เรียกฟังก์ชันใน global scope เพื่อซ่อนใน index.html
      if (typeof window !== "undefined" && (window as any).hideSplashScreen) {
        (window as any).hideSplashScreen();
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Splash Screen - แสดงก่อนที่แอปจะโหลด */}
      <SplashScreen
        isVisible={showSplash}
        duration={1200}
        onHidden={() => setShowSplash(false)}
      />

      {/* Main App - ซ่อนเมื่อ splash screen ยังแสดงอยู่ */}
      <div style={{ display: showSplash ? "none" : "block" }}>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/sign-in" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/reset-password" element={<NewPasswordForm />} />
            <Route path="/link-expired" element={<LinkExpired />} />

            <Route
              path="/scan"
              element={
                <PrivateRoute>
                  <ScanQrCode />
                </PrivateRoute>
              }
            />

            {/* Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/sign-in" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              <Route
                element={
                  <PrivateRoute>
                    <Outlet />
                  </PrivateRoute>
                }
              >
                <Route
                  path="project-registration-list"
                  element={<ProjectRegistrationList />}
                />
                <Route path="profile" element={<UserProfilePage />} />
                <Route path="sponsor" element={<Sponsor />} />
              </Route>
            </Route>

            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
