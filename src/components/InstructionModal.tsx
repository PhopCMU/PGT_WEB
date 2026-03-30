import { useEffect, useRef, useState } from "react";
import { X, Camera, Smartphone, CheckCircle } from "lucide-react";

interface InstructionModalProps {
  onClose?: () => void;
}

export default function InstructionModal({ onClose }: InstructionModalProps) {
  //   const [isAccepted, setIsAccepted] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [hideForever, setHideForever] = useState(false);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // Check localStorage on mount
  useEffect(() => {
    const hideModal = localStorage.getItem("hide_instruction_modal");
    if (hideModal === "true") {
      onClose?.();
    }
  }, [onClose]);

  // Scroll tracking handler
  const handleScroll = () => {
    const element = scrollContentRef.current;
    if (element) {
      const { scrollTop, clientHeight, scrollHeight } = element;
      // Enable button when user has scrolled to bottom (with 5px tolerance)
      setHasScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 5);
    }
  };

  const handleAccept = () => {
    if (hideForever) {
      localStorage.setItem("hide_instruction_modal", "true");
    }
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container - Responsive sizing */}
      <div className="w-full max-w-2xl mx-4 sm:mx-6 md:mx-8 lg:mx-auto my-6 sm:my-8 md:my-12">
        <div className="relative bg-[#161f2f] rounded-2xl sm:rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600/20 to-cyan-500/20 border-b border-gray-800/50 p-5 sm:p-6 md:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 bg-blue-500/20 rounded-xl">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  คู่มือการใช้งานและติดตั้งระบบ
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-gray-100" />
              </button>
            </div>
          </div>

          {/* Scrollable Content - Responsive height */}
          <div
            ref={scrollContentRef}
            onScroll={handleScroll}
            className="max-h-[45vh] sm:max-h-[50vh] md:max-h-[55vh] lg:max-h-[60vh] overflow-y-auto p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6 custom-scrollbar"
          >
            {/* Section 1: การใช้งาน */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-blue-500/10 rounded-lg shrink-0">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">
                    1. การใช้งานระบบสแกน QR Code เพื่อเข้าร่วมสัมมนา
                  </h3>
                  <ul className="space-y-2 sm:space-y-2.5 text-gray-300 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 shrink-0">•</span>
                      <span>สมัครสมาชิกผ่านหน้าลงทะเบียน</span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 shrink-0">•</span>
                      <span>ล็อกอินด้วยอีเมลและรหัสผ่าน</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 shrink-0">•</span>
                      <span>กดแสกน QR Code สำหรับการเข้าถึงฟีเจอร์กล้อง</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 shrink-0">•</span>
                      <span>อนุญาตการใช้งานกล้องเมื่อระบบขออนุญาต</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-800/50"></div>

            {/* Section 2: PWA iOS */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-purple-500/10 rounded-lg shrink-0">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">
                    2. ติดตั้งเป็นแอป (iOS)
                  </h3>
                  <ol className="space-y-2 sm:space-y-2.5 text-gray-300 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-medium mt-1 shrink-0">
                        1.
                      </span>
                      <span>เปิด Safari และเข้าเว็บไซต์</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-medium mt-1 shrink-0">
                        2.
                      </span>
                      <span>กดปุ่ม Share (ไอคอนสี่เหลี่ยมพร้อมลูกศรขึ้น)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-medium mt-1 shrink-0">
                        3.
                      </span>
                      <span>เลื่อนลงและเลือก "Add to Home Screen"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-medium mt-1 shrink-0">
                        4.
                      </span>
                      <span>กด "Add" เพื่อยืนยัน</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-800/50"></div>

            {/* Section 3: PWA Android */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-cyan-500/10 rounded-lg shrink-0">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">
                    3. ติดตั้งเป็นแอป (Android)
                  </h3>
                  <ol className="space-y-2 sm:space-y-2.5 text-gray-300 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-medium mt-1 shrink-0">
                        1.
                      </span>
                      <span>เปิด Chrome และเข้าเว็บไซต์</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-medium mt-1 shrink-0">
                        2.
                      </span>
                      <span>กดปุ่มสามจุด (⋮) มุมขวาบน</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-medium mt-1 shrink-0">
                        3.
                      </span>
                      <span>เลือก "Install app" หรือ "Add to Home Screen"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-medium mt-1 shrink-0">
                        4.
                      </span>
                      <span>กด "Install" เพื่อยืนยัน</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-300">
                <span className="font-semibold">หมายเหตุ:</span>{" "}
                การติดตั้งเป็นแอปจะช่วยให้เข้าถึงระบบได้สะดวกขึ้น
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800/50 p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
            {/* Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer group w-full">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={hideForever}
                    onChange={(e) => setHideForever(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      hideForever
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {hideForever && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-colors">
                  ไม่ต้องแสดงหน้านี้อีก
                </span>
              </label>
            </div>

            {/* Accept Button */}
            <button
              onClick={handleAccept}
              disabled={!hasScrolledToBottom}
              className={`w-full py-3 px-4 rounded-xl sm:rounded-2xl font-semibold text-white transition-all duration-300 transform ${
                hasScrolledToBottom
                  ? "bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  : "bg-gray-700/50 cursor-not-allowed opacity-60"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg">
                  ยอมรับและเริ่มใช้งาน
                </span>
              </div>
            </button>

            {/* Scroll hint */}
            {!hasScrolledToBottom && (
              <p className="text-center text-xs sm:text-sm text-gray-500 animate-bounce">
                ⬇️ กรุณาเลื่อนอ่านจนจบเพื่อดำเนินการต่อ
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
