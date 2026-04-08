import { useEffect, useRef, useState } from "react";
import { X, Camera, Smartphone, CheckCircle } from "lucide-react";

interface InstructionModalProps {
  onClose?: () => void;
}

export default function InstructionModal({ onClose }: InstructionModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [hideForever, setHideForever] = useState(false);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hideModal = localStorage.getItem("hide_instruction_modal");
    if (hideModal === "true") {
      onClose?.();
    }
  }, [onClose]);

  const handleScroll = () => {
    const element = scrollContentRef.current;
    if (element) {
      const { scrollTop, clientHeight, scrollHeight } = element;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="w-full max-w-2xl mx-auto my-auto">
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 p-6 sm:p-8 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    คู่มือการใช้งาน
                  </h2>
                  <p className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                    User Manual & Guide
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollContentRef}
            onScroll={handleScroll}
            className="overflow-y-auto p-6 sm:p-8 space-y-8"
            style={{ scrollbarWidth: "thin" }}
          >
            {/* Section 1 */}
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  1. การใช้งานระบบสแกนเข้าร่วมสัมมนา
                </h3>
                <ul className="space-y-3">
                  {[
                    "สมัครสมาชิกผ่านหน้าลงทะเบียน",
                    "ล็อกอินด้วยอีเมลและรหัสผ่าน",
                    "กดปุ่ม 'สแกน QR Code' ในหน้าโปรเจค",
                    "อนุญาตการเข้าถึงกล้องเมื่อระบบร้องขอ",
                  ].map((text, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-600 font-medium text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Section 2 */}
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  2. วิธีติดตั้งเป็นแอป (PWA)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                      For iOS (Safari)
                    </p>
                    <ol className="text-xs text-gray-600 font-medium space-y-1.5">
                      <li>1. กดปุ่ม 'แชร์' (Share)</li>
                      <li>2. เลือก 'เพิ่มไปยังหน้าจอโฮม'</li>
                    </ol>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      For Android (Chrome)
                    </p>
                    <ol className="text-xs text-gray-600 font-medium space-y-1.5">
                      <li>1. กดปุ่ม 'สามจุด' (⋮)</li>
                      <li>2. เลือก 'ติดตั้งแอป'</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold mr-1.5">
                  TIP
                </span>
                การติดตั้งแอปจะช่วยให้การแจ้งเตือนและการทำงานรวดเร็วยิ่งขึ้น
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-100 p-6 sm:p-8 space-y-4 shrink-0">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={hideForever}
                  onChange={(e) => setHideForever(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                    hideForever
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300 group-hover:border-blue-400"
                  }`}
                >
                  {hideForever && (
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                ไม่ต้องแสดงหน้าต่างนี้อีก
              </span>
            </label>

            <div className="relative">
              <button
                onClick={handleAccept}
                disabled={!hasScrolledToBottom}
                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-sm ${
                  hasScrolledToBottom
                    ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                ยอมรับและเริ่มใช้งาน
              </button>

              {!hasScrolledToBottom && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider whitespace-nowrap">
                    ⬇️ กรุณาเลื่อนลงให้สุด
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
