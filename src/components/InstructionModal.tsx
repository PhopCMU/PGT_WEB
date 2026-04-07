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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md overflow-y-auto p-4">
      <div className="w-full max-w-2xl mx-auto my-auto">
        <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-slate-50 border-b border-gray-100 p-6 sm:p-8 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    คู่มือการใช้งาน
                  </h2>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">User Manual & Guide</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollContentRef}
            onScroll={handleScroll}
            className="overflow-y-auto p-6 sm:p-8 space-y-8 sidebar-scrollbar"
          >
            {/* Section 1 */}
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3 leading-snug">
                  1. การใช้งานระบบสแกนเข้าร่วมสัมมนา
                </h3>
                <ul className="space-y-3">
                  {[
                    "สมัครสมาชิกผ่านหน้าลงทะเบียน",
                    "ล็อกอินด้วยอีเมลและรหัสผ่าน",
                    "กดปุ่ม 'สแกน QR Code' ในหน้าโปรเจค",
                    "อนุญาตการเข้าถึงกล้องเมื่อระบบร้องขอ"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 font-medium text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="h-px bg-gray-50"></div>

            {/* Section 2 */}
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3 leading-snug">
                  2. วิธีติดตั้งเป็นแอป (PWA)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">For iOS (Safari)</p>
                    <ol className="text-xs text-gray-500 font-bold space-y-1.5">
                      <li>1. กดปุ่ม 'แชร์' (Share)</li>
                      <li>2. เลือก 'เพิ่มไปยังหน้าจอโฮม'</li>
                    </ol>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">For Android (Chrome)</p>
                    <ol className="text-xs text-gray-500 font-bold space-y-1.5">
                      <li>1. กดปุ่ม 'สามจุด' (⋮)</li>
                      <li>2. เลือก 'ติดตั้งแอป'</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs text-blue-700 font-bold leading-relaxed">
                <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] mr-1.5">TIP</span>
                การติดตั้งแอปจะช่วยให้การแจ้งเตือนและการทำงานรวดเร็วยิ่งขึ้น
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-gray-100 p-6 sm:p-8 space-y-4 shrink-0">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={hideForever}
                  onChange={(e) => setHideForever(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${hideForever ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white border-gray-200 group-hover:border-blue-400'}`}>
                  {hideForever && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
              <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">ไม่ต้องแสดงหน้าต่างนี้อีก</span>
            </label>

            <div className="relative">
              <button
                onClick={handleAccept}
                disabled={!hasScrolledToBottom}
                className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg ${hasScrolledToBottom ? 'bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] shadow-blue-500/25 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
              >
                ยอมรับและเริ่มใช้งาน
              </button>
              
              {!hasScrolledToBottom && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest whitespace-nowrap">⬇️ กรุณาเลื่อนลงให้สุด</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
