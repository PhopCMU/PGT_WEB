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
        backgroundColor: "#ffffff",
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
          border: "4px solid rgba(59, 130, 246, 0.1)",
          borderTop: "4px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px",
        }}
      ></div>

      <div
        style={{
          color: "#1e293b",
          fontSize: "14px",
          fontWeight: "900",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.6,
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        กำลังโหลดระบบ...
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
