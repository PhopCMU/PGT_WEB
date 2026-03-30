import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  FileText,
  Globe,
  Mail,
  Phone,
  ChevronRight,
  CheckCircle,
  Lock,
  Eye,
  Database,
  ShieldCheck,
} from "lucide-react";

interface PolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Policy: React.FC<PolicyProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"thai" | "english">("thai");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      setIsAccepted(false);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleAccept = () => {
    setIsAccepted(true);
    setTimeout(() => {
      localStorage.setItem("policyAccepted", "true");
      handleClose();
    }, 500);
  };

  return (
    <>
      {/* Animated Backdrop */}
      <div
        className={`fixed inset-0 bg-[#0d1420]/95 backdrop-blur-xl transition-all duration-500 z-9999 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }}
            />
          ))}

          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-10000 flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div
          className={`bg-[#161f2f] border border-gray-800/50 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-h-[95vh] md:max-h-[90vh] flex flex-col transform transition-all duration-500 ${
            isMobile ? "m-0" : "sm:max-w-4xl md:max-w-5xl"
          } ${
            isVisible
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-4 sm:p-5 md:p-6 border-b border-gray-800/50 bg-linear-to-r from-[#172131] to-[#1a2438] rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl">
            {/* Animated border effect */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl"></div>

            {/* Tech elements */}
            {!isMobile && (
              <>
                <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-500/5 rounded-full -translate-x-8 sm:-translate-x-10 md:-translate-x-12 -translate-y-8 sm:-translate-y-10 md:-translate-y-12"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-purple-500/5 rounded-full translate-x-4 sm:translate-x-6 md:translate-x-8 translate-y-4 sm:translate-y-6 md:translate-y-8"></div>
              </>
            )}

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="p-2 sm:p-2.5 md:p-3 bg-linear-to-br from-blue-600/20 to-purple-600/20 rounded-lg sm:rounded-xl md:rounded-xl border border-blue-800/30 backdrop-blur-sm">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white truncate sm:whitespace-normal">
                    {isMobile
                      ? "ข้อตกลงและนโยบาย"
                      : "ข้อตกลงและนโยบายความเป็นส่วนตัว"}
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm md:text-sm mt-0.5 sm:mt-1">
                    Terms & Privacy Policy
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="ml-2 p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:rotate-90 active:scale-95 group shrink-0 border border-gray-800/50"
              >
                <X
                  size={isMobile ? 20 : isTablet ? 22 : 24}
                  className="text-gray-400 group-hover:text-gray-200"
                />
              </button>
            </div>

            {/* Security badge */}
            <div className="flex items-center gap-2 mt-4 sm:mt-5 md:mt-6">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Secure Connection</span>
              </div>
              <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-gray-400">
                  256-bit Encryption
                </span>
              </div>
            </div>
          </div>

          {/* Language Tabs */}
          <div className="flex border-b border-gray-800/50 bg-[#172131]">
            <button
              onClick={() => setActiveTab("thai")}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 relative overflow-hidden group ${
                activeTab === "thai"
                  ? "text-white bg-linear-to-r from-blue-600/30 to-purple-600/30"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/50"
              }`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <Globe size={isMobile ? 14 : isTablet ? 16 : 18} />
              <span className="text-sm sm:text-base">ภาษาไทย</span>
              {activeTab === "thai" && (
                <>
                  <div className="ml-1 sm:ml-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500"></div>
                </>
              )}
            </button>
            <button
              onClick={() => setActiveTab("english")}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 relative overflow-hidden group ${
                activeTab === "english"
                  ? "text-white bg-linear-to-r from-blue-600/30 to-purple-600/30"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/50"
              }`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <Globe size={isMobile ? 14 : isTablet ? 16 : 18} />
              <span className="text-sm sm:text-base">English</span>
              {activeTab === "english" && (
                <>
                  <div className="ml-1 sm:ml-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500"></div>
                </>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-linear-to-b from-[#161f2f] to-[#111829]">
            <div
              className={`mx-auto ${
                isMobile ? "max-w-full" : "sm:max-w-2xl md:max-w-3xl"
              }`}
            >
              {activeTab === "thai" ? (
                <ThaiContent isMobile={isMobile} isTablet={isTablet} />
              ) : (
                <EnglishContent isMobile={isMobile} isTablet={isTablet} />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800/50 p-4 sm:p-5 md:p-6 lg:p-8 bg-linear-to-r from-[#172131] to-[#1a2438] rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl">
            <div
              className={`mx-auto ${
                isMobile ? "max-w-full" : "sm:max-w-2xl md:max-w-3xl"
              }`}
            >
              {/* Contact Information */}
              <div className="mb-4 sm:mb-5 md:mb-6 bg-linear-to-r from-gray-900/50 to-gray-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-800/50 backdrop-blur-sm">
                <p className="font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Mail size={isMobile ? 14 : isTablet ? 16 : 18} />
                  <span className="text-sm sm:text-base">
                    {isMobile
                      ? "ช่องทางการติดต่อ"
                      : "ช่องทางการติดต่อ (Contact Information)"}
                  </span>
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gray-900/50 rounded-lg border border-gray-800/50 shrink-0">
                      <Mail
                        size={isMobile ? 14 : 16}
                        className="text-blue-400"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-400">
                        Email
                      </p>
                      <p className="text-gray-300 text-sm sm:text-base truncate sm:whitespace-normal">
                        pgt.cmu@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gray-900/50 rounded-lg border border-gray-800/50 shrink-0">
                      <Phone
                        size={isMobile ? 14 : 16}
                        className="text-blue-400"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-400">
                        โทรศัพท์
                      </p>
                      <p className="text-gray-300 text-sm sm:text-base">
                        053-948-095
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accept Button */}
              <button
                onClick={handleAccept}
                className={`w-full accept-btn py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 font-medium text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 group relative overflow-hidden ${
                  isAccepted
                    ? "bg-linear-to-r from-green-600 to-emerald-600"
                    : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }`}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

                {/* Pulsing border effect */}
                <div className="absolute -inset-1px bg-linear-to-r from-blue-400/50 via-purple-400/50 to-cyan-400/50 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 animate-pulse"></div>

                <CheckCircle
                  size={isMobile ? 16 : isTablet ? 18 : 22}
                  className={`relative z-10 group-hover:scale-110 transition-transform ${
                    isAccepted ? "animate-spin" : ""
                  }`}
                />
                <span className="relative z-10 text-xs sm:text-sm md:text-base">
                  {isMobile
                    ? "ยอมรับข้อตกลง"
                    : "ฉันเข้าใจและยอมรับ / I Understand and Accept"}
                </span>
                <ChevronRight
                  size={isMobile ? 14 : isTablet ? 16 : 20}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />

                {/* Ripple effect */}
                <div className="absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl">
                  <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 group-active:animate-ripple"></div>
                </div>
              </button>

              {/* Agreement Text */}
              <p className="text-center text-gray-500 text-xs mt-2 sm:mt-3 md:mt-4 px-2">
                {isMobile
                  ? "คลิกปุ่มด้านบนเพื่อยอมรับข้อตกลงทั้งหมด"
                  : "โดยการคลิกปุ่มด้านบน ถือว่าท่านได้อ่านและยอมรับข้อตกลงทั้งหมดแล้ว"}
              </p>

              {/* Data Protection Info */}
              <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-800/50">
                <Database className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-gray-500">PDPA Compliant</span>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <Eye className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-gray-500">Data Protected</span>
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-blue-500/30 rounded-tl-lg sm:rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-purple-500/30 rounded-tr-lg sm:rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/30 rounded-bl-lg sm:rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-blue-500/30 rounded-br-lg sm:rounded-br-xl"></div>
        </div>
      </div>
    </>
  );
};

interface ContentProps {
  isMobile: boolean;
  isTablet: boolean;
}

const ContentSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  gradient?: string;
  isMobile?: boolean;
  isTablet?: boolean;
}> = ({
  title,
  icon,
  children,
  gradient = "from-blue-900/20 to-purple-900/20",
  isMobile = false,
  // isTablet = false,
}) => (
  <section className="mb-6 sm:mb-7 md:mb-8 last:mb-0">
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
      <div
        className={`p-2 sm:p-2.5 md:p-3 bg-linear-to-br ${gradient} rounded-lg sm:rounded-xl md:rounded-xl border border-gray-800/50 backdrop-blur-sm shrink-0`}
      >
        {icon}
      </div>
      <h3
        className={`font-bold text-gray-300 ${
          isMobile ? "text-base sm:text-lg" : "text-lg sm:text-xl md:text-2xl"
        }`}
      >
        {title}
      </h3>
    </div>
    {children}
  </section>
);

const ThaiContent: React.FC<ContentProps> = ({ isMobile, isTablet }) => (
  <div className="space-y-6 sm:space-y-7 md:space-y-8">
    <ContentSection
      title="ข้อตกลงและเงื่อนไขการใช้งาน"
      icon={
        <FileText
          className={
            isMobile
              ? "w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              : "w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
          }
        />
      }
      gradient="from-blue-900/20 to-purple-900/20"
      isMobile={isMobile}
      isTablet={isTablet}
    >
      <div className="bg-gray-900/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-gray-800/50 backdrop-blur-sm">
        <p className="text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed text-sm sm:text-base">
          ยินดีต้อนรับสู่ระบบของศูนย์บัณฑิตศึกษา (PGT) คณะสัตวแพทยศาสตร์
          มหาวิทยาลัยเชียงใหม่
          การใช้งานระบบนี้ถือว่าท่านยอมรับข้อตกลงดังต่อไปนี้:
        </p>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {[
            {
              title: "วัตถุประสงค์",
              content:
                "ระบบนี้มีไว้เพื่อ สนับสนุนการดำเนินงานโครงการต่างๆ ที่จัดขึ้นโดยศูนย์บัณฑิตศึกษา (PGT) โดยรองรับทั้งนักศึกษาที่กำลังศึกษาอยู่ในปัจจุบัน และผู้ที่สำเร็จการศึกษาไปแล้ว (ศิษย์เก่า) ให้สามารถสมัครเข้าร่วมโครงการ ติดตามข่าวสาร และจัดการข้อมูลที่เกี่ยวข้องกับการศึกษาหลังปริญญา",
              icon: "🎯",
              color: "from-blue-900/30 to-blue-800/30",
            },
            {
              title: "การสมัครและข้อมูล",
              content:
                "ผู้สมัครต้องตรวจสอบคุณสมบัติ รายละเอียดโครงการ และตรวจทานความถูกต้องของข้อมูลก่อนการยืนยันสมัครทุกครั้ง",
              icon: "📝",
              color: "from-purple-900/30 to-purple-800/30",
            },
            {
              title: "นโยบายการชำระเงินและการคืนเงิน",
              content:
                "เมื่อผู้สมัครดำเนินการสมัครโครงการและชำระเงินเสร็จสิ้นแล้ว ทางศูนย์บัณฑิตศึกษา (PGT) จะไม่มีการคืนเงินในทุกกรณี ดังนั้น ก่อนการสมัครและชำระเงิน ผู้สมัครต้องเตรียมความพร้อม ตรวจสอบความถูกต้องของโครงการที่เลือก และความพร้อมในการเข้าร่วมโครงการของตนเองให้ครบถ้วน",
              icon: "💰",
              color: "from-green-900/30 to-emerald-800/30",
            },
            {
              title: "บัญชีผู้ใช้งาน",
              content:
                "ท่านมีหน้าที่รักษาความปลอดภัยของบัญชีผู้ใช้งานและรหัสผ่าน คณะฯ จะไม่รับผิดชอบต่อความเสียหายจากการเข้าถึงโดยไม่ได้รับอนุญาตเนื่องจากความประมาทของผู้ใช้งาน",
              icon: "🔐",
              color: "from-yellow-900/30 to-amber-800/30",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-800/30 rounded-lg transition-colors group border border-gray-800/30"
            >
              <div
                className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br ${item.color} rounded-lg flex items-center justify-center text-base sm:text-lg group-hover:scale-110 transition-transform border border-gray-800/50`}
              >
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-300 mb-1.5 sm:mb-2 text-sm sm:text-base">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentSection>

    <ContentSection
      title="นโยบายความเป็นส่วนตัว"
      icon={
        <Shield
          className={
            isMobile
              ? "w-4 h-4 sm:w-5 sm:h-5 text-green-400"
              : "w-5 h-5 sm:w-6 sm:h-6 text-green-400"
          }
        />
      }
      gradient="from-green-900/20 to-emerald-900/20"
      isMobile={isMobile}
      isTablet={isTablet}
    >
      <div className="bg-gray-900/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-gray-800/50 backdrop-blur-sm">
        <p className="text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed text-sm sm:text-base">
          คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่ ("คณะฯ")
          ดำเนินการเก็บรวบรวมและคุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ.
          คุ้มครองข้อมูลส่วนบุคคล (PDPA) ดังนี้:
        </p>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {[
            {
              title: "การจัดเก็บข้อมูล",
              content:
                "เก็บข้อมูลที่จำเป็นต่อการลงทะเบียน และหลักฐานการชำระเงิน",
              icon: "📊",
              color: "from-blue-900/30 to-cyan-800/30",
            },
            {
              title: "วัตถุประสงค์",
              content:
                "เพื่อใช้ในการบริหารจัดการโครงการ การตรวจสอบยอดชำระเงิน และการออกเอกสารสำคัญ",
              icon: "🎯",
              color: "from-purple-900/30 to-pink-800/30",
            },
            {
              title: "การเก็บรักษาและสิทธิ",
              content:
                "ข้อมูลจะถูกเก็บรักษาอย่างปลอดภัย และท่านมีสิทธิขอเข้าถึงหรือแก้ไขข้อมูลได้ตามกฎหมาย",
              icon: "✅",
              color: "from-green-900/30 to-emerald-800/30",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-800/30 rounded-lg transition-colors group border border-gray-800/30"
            >
              <div
                className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br ${item.color} rounded-lg flex items-center justify-center text-base sm:text-lg group-hover:scale-110 transition-transform border border-gray-800/50`}
              >
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-300 mb-1.5 sm:mb-2 text-sm sm:text-base">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentSection>
  </div>
);

const EnglishContent: React.FC<ContentProps> = ({ isMobile, isTablet }) => (
  <div className="space-y-6 sm:space-y-7 md:space-y-8">
    <ContentSection
      title="Terms and Conditions"
      icon={
        <FileText
          className={
            isMobile
              ? "w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              : "w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
          }
        />
      }
      gradient="from-blue-900/20 to-purple-900/20"
      isMobile={isMobile}
      isTablet={isTablet}
    >
      <div className="bg-gray-900/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-gray-800/50 backdrop-blur-sm">
        <p className="text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed text-sm sm:text-base">
          Welcome to the Postgraduate Education Center (PGT) system, Faculty of
          Veterinary Medicine, Chiang Mai University. By using this system, you
          agree to the following terms:
        </p>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {[
            {
              title: "Purpose",
              content:
                "This system supports various programs and projects organized by the PGT Center for both current students and alumni.",
              icon: "🎯",
              color: "from-blue-900/30 to-blue-800/30",
            },
            {
              title: "Application & Accuracy",
              content:
                "Applicants are responsible for reviewing program details and ensuring the accuracy of all provided information before final submission.",
              icon: "📝",
              color: "from-purple-900/30 to-purple-800/30",
            },
            {
              title: "Payment and No-Refund Policy",
              content:
                "Once the application is submitted and payment is completed, the Postgraduate Education Center (PGT) will not issue refunds under any circumstances. Applicants must ensure their readiness and double-check the project details thoroughly before proceeding with the payment.",
              icon: "💰",
              color: "from-green-900/30 to-emerald-800/30",
            },
            {
              title: "User Account",
              content:
                "You are responsible for the security of your account credentials. FVM-CMU is not liable for unauthorized access due to user negligence.",
              icon: "🔐",
              color: "from-yellow-900/30 to-amber-800/30",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-800/30 rounded-lg transition-colors group border border-gray-800/30"
            >
              <div
                className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br ${item.color} rounded-lg flex items-center justify-center text-base sm:text-lg group-hover:scale-110 transition-transform border border-gray-800/50`}
              >
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-300 mb-1.5 sm:mb-2 text-sm sm:text-base">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentSection>

    <ContentSection
      title="Privacy Policy"
      icon={
        <Shield
          className={
            isMobile
              ? "w-4 h-4 sm:w-5 sm:h-5 text-green-400"
              : "w-5 h-5 sm:w-6 sm:h-6 text-green-400"
          }
        />
      }
      gradient="from-green-900/20 to-emerald-900/20"
      isMobile={isMobile}
      isTablet={isTablet}
    >
      <div className="bg-gray-900/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-gray-800/50 backdrop-blur-sm">
        <p className="text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed text-sm sm:text-base">
          In accordance with the Personal Data Protection Act (PDPA), the
          Faculty of Veterinary Medicine, Chiang Mai University ("the Faculty")
          states:
        </p>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {[
            {
              title: "Data Collection",
              content:
                "We collect necessary personal data for registration and payment verification.",
              icon: "📊",
              color: "from-blue-900/30 to-cyan-800/30",
            },
            {
              title: "Purpose",
              content:
                "To manage projects, verify transactions, and issue relevant documents.",
              icon: "🎯",
              color: "from-purple-900/30 to-pink-800/30",
            },
            {
              title: "Rights",
              content:
                "You have the right to access, rectify, or manage your personal data as permitted by law.",
              icon: "✅",
              color: "from-green-900/30 to-emerald-800/30",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-800/30 rounded-lg transition-colors group border border-gray-800/30"
            >
              <div
                className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br ${item.color} rounded-lg flex items-center justify-center text-base sm:text-lg group-hover:scale-110 transition-transform border border-gray-800/50`}
              >
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-300 mb-1.5 sm:mb-2 text-sm sm:text-base">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentSection>
  </div>
);
