import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { bindLoading } from "../lib/axiosLoading";

type LoadingContextType = {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  useEffect(() => {
    bindLoading(showLoading, hideLoading);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}

      {/* Dark Theme Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-9999 w-full h-full bg-[#111829]/95 backdrop-blur-xl flex items-center justify-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-linear(to right, #3b82f610 1px, transparent 1px),
                                 linear-linear(to bottom, #3b82f610 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              />
            </div>
          </div>

          {/* Main Loading Container */}
          <div className="relative">
            {/* Glowing background effect */}
            <div className="absolute -inset-8 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-2xl"></div>

            {/* Outer container with border animation */}
            <div className="relative p-8 bg-[#161f2f]/80 backdrop-blur-2xl rounded-2xl border border-gray-800/50 shadow-2xl">
              {/* Animated border */}
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-lg animate-pulse"></div>

              {/* Main loading spinner */}
              <div className="relative">
                {/* Orbital rings */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500/30 border-r-blue-500/20 animate-spin-slow"></div>
                  <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-purple-500/30 border-r-purple-500/20 animate-spin-slow-reverse animation-delay-200"></div>
                  <div className="absolute inset-6 rounded-full border-2 border-transparent border-t-cyan-500/30 border-r-cyan-500/20 animate-spin-slow animation-delay-400"></div>

                  {/* Center sphere */}
                  <div className="absolute inset-12 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full backdrop-blur-sm border border-gray-800/30 flex items-center justify-center">
                    {/* Pulsing core */}
                    <div className="w-8 h-8 bg-linear-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-blue-500/20">
                      {/* Inner shine */}
                      <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-full"></div>
                    </div>

                    {/* Satellite dots */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-linear-to-r from-blue-300 to-cyan-300 rounded-full"
                        style={{
                          transform: `rotate(${angle}deg) translateX(2rem) rotate(-${angle}deg)`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Loading text */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold bg-linear-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                    กำลังประมวลผล
                  </h3>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                    ระบบกำลังดำเนินการตามคำขอของคุณ
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="mt-8">
                  <div className="relative h-2 bg-gray-900/50 rounded-full overflow-hidden border border-gray-800/50">
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 animate-shimmer"></div>
                    <div
                      className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-progress"
                      style={{ width: "100%" }}
                    />
                  </div>

                  {/* Loading dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-linear-to-r from-blue-300 to-cyan-300 rounded-full animate-bounce"
                        style={{
                          animationDelay: `${i * 0.15}s`,
                          animationDuration: "0.6s",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Additional info */}
                <div className="mt-6 pt-6 border-t border-gray-800/50">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span>เชื่อมต่อแล้ว</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>กำลังโหลดข้อมูล</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500/50 rounded-tl-xl"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-purple-500/50 rounded-tr-xl"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-xl"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-blue-500/50 rounded-br-xl"></div>
          </div>

          {/* Keyboard shortcut hint */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800/50">
              <span className="text-xs text-gray-400">Press</span>
              <kbd className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded border border-gray-700">
                ESC
              </kbd>
              <span className="text-xs text-gray-400">to cancel</span>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
