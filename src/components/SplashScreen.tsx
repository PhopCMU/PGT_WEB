import { useEffect, useState } from "react";

interface SplashScreenProps {
  isVisible?: boolean;
  duration?: number;
  onHidden?: () => void;
}

export default function SplashScreen({
  isVisible = true,
  duration = 1200,
  onHidden,
}: SplashScreenProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setShow(false);
      onHidden?.();

      // เรียกฟังก์ชันใน global scope เพื่อซ่อนใน index.html
      if (typeof window !== "undefined" && (window as any).hideSplashScreen) {
        (window as any).hideSplashScreen();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onHidden]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#0f172a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          marginBottom: "30px",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        <img
          src="/icons/maskable-512.png"
          alt="PGTCMU Logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255, 255, 255, 0.3)",
          borderTop: "4px solid #ffffff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px",
        }}
      ></div>

      <div
        style={{
          color: "#ffffff",
          fontSize: "16px",
          opacity: 0.8,
          textAlign: "center",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        }}
      >
        กำลังโหลดแอปพลิเคชัน...
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
