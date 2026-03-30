import {
  AlertCircle,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lamp,
  Shield,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotKey from "../layouts/NotKey";

import { newPasswordUser } from "../../services/registrationService";
import { decryptData } from "../../utils/helpers";

type DecodedData = {
  id: number;
  email: string;
  codeId: string;
  exp: number; // expiresAt in ms (Unix ms)
};

const LINK_TTL_MS = 30 * 60 * 1000; // 30 นาที

export default function NewPasswordForm() {
  // --- ฟอร์ม/สถานะทั่วไป ---
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [codeId, setCodeId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // --- Query key / Router ---
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const key = queryParams.get("key");
  const hasRun = useRef(false);
  const navigate = useNavigate();

  // --- Countdown สำหรับแสดงบน UI ---
  const [expiresAtMs, setExpiresAtMs] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);

  // --- Inactivity (ไม่มีการดำเนินการใดๆ 30 นาที) ---
  const lastActionRef = useRef<number>(Date.now());

  // ถ้าไม่มี key → แสดงหน้า NotKey
  if (!key) {
    return <NotKey />;
  }

  // ฟังก์ชันช่วยแสดงรูปแบบเวลา (นาที:วินาที หรือ ชั่วโมง:นาที:วินาที)
  const formatDurationTH = (ms: number) => {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return h > 0 ? `${hh}:${mm}:${ss} ชม.` : `${mm}:${ss} นาที`;
  };

  // 1) ถอดรหัส key และตั้ง expiresAt / ตรวจหมดอายุทันที
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      try {
        const data: DecodedData = await decryptData(key);

        // กรณีที่ data.exp เป็น "เวลาหมดอายุ" (expiresAt in ms)
        const expMs = Number(data.exp);

        // 👉 ถ้าระบบของคุณเก็บเป็น issuedAt ให้ใช้:
        // const expMs = Number(data.exp) + LINK_TTL_MS;

        if (!Number.isFinite(expMs) || expMs <= 0) {
          navigate(`/link-expired?key=${key}`, { replace: true });
          return;
        }

        // หมดอายุแล้ว → กลับหน้า sign-in
        if (Date.now() > expMs) {
          navigate(`/link-expired?key=${key}`, { replace: true });
          return;
        }

        setId(data.id);
        setCodeId(data.codeId);
        setEmail(data.email);
        setExpiresAtMs(expMs);
        setRemainingMs(Math.max(0, expMs - Date.now()));
      } catch (error) {
        console.error("Error decoding key:", error);
        navigate(`/link-expired?key=${key}`, { replace: true });
      }
    })();
  }, [key, navigate]);

  // 2) Countdown แสดงบน UI (อัพเดททุกวินาที) + หมดเวลา → รีไดเรกต์
  useEffect(() => {
    if (expiresAtMs == null) return;

    setRemainingMs(Math.max(0, expiresAtMs - Date.now()));
    const interval = setInterval(() => {
      const r = Math.max(0, expiresAtMs - Date.now());
      setRemainingMs(r);
      if (r <= 0) {
        navigate(`/link-expired?key=${key}`, { replace: true });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAtMs, navigate]);

  // 3) Inactivity: ไม่มีการดำเนินการใดๆ ครบ 30 นาที → รีไดเรกต์
  useEffect(() => {
    const updateAction = () => {
      lastActionRef.current = Date.now();
    };

    // ฟังเหตุการณ์ที่ถือว่า "การดำเนินการ"
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((ev) =>
      document.addEventListener(ev, updateAction, { passive: true })
    );

    const interval = setInterval(() => {
      const idleMs = Date.now() - lastActionRef.current;
      if (idleMs >= LINK_TTL_MS) {
        navigate(`/link-expired?key=${key}`, { replace: true });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      events.forEach((ev) => document.removeEventListener(ev, updateAction));
    };
  }, [navigate]);

  // ---- Password strength & validate ----
  const validatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const colors = [
      "#dc2626", // red-600
      "#ea580c", // orange-600
      "#ca8a04", // yellow-600
      "#65a30d", // lime-600
      "#16a34a", // green-600
    ];
    const labels = ["อ่อนมาก", "อ่อน", "ปานกลาง", "ดี", "แข็งแรง"];

    return {
      score,
      color: colors[score - 1] || colors[0],
      label: labels[score - 1] || labels[0],
    };
  };

  const passwordStrength = validatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async () => {
    setPasswordTouched(true);
    setConfirmTouched(true);
    setError("");

    // เมื่อผู้ใช้กด/พิมพ์ ถือว่าเป็น activity
    lastActionRef.current = Date.now();

    if (!password) {
      setError("กรุณากรอกรหัสผ่านใหม่");
      return;
    }

    if (passwordStrength.score < 3) {
      setError("รหัสผ่านไม่แข็งแรงพอ");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsLoading(true);

    if (!id && !codeId && !email) return;

    try {
      const payload = {
        id,
        email,
        codeId,
        password,
      };

      const response = await newPasswordUser(payload as any);
      if (!response.success) throw new Error(response.message);
      setInfo("รหัสผ่านใหม่ถูกสร้างเรียบร้อยแล้ว");
      setIsLoading(false);
      setTimeout(() => navigate("/sign-in", { replace: true }), 2000);
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 md:p-6">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 border border-gray-700">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-linear-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center mx-auto shadow-lg mb-6">
            <KeyRound className="text-white" size={36} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            สร้างรหัสผ่านใหม่ 🔒
          </h2>
          <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-2">
            Create New Password
          </h3>
          <p className="text-gray-400 text-sm">
            กรุณาตั้งรหัสผ่านใหม่ที่แข็งแรงและปลอดภัย
          </p>
        </div>

        {/* Countdown Badge แสดงเวลาลิงก์หมดอายุ */}
        {expiresAtMs && (
          <div
            className="mb-6 flex items-center justify-center"
            aria-live="polite"
          >
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-yellow-800 bg-yellow-900/30 text-yellow-200 font-medium">
              <span>⏳ ลิงก์จะหมดอายุใน</span>
              <span className="font-bold">{formatDurationTH(remainingMs)}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {error && (
            <div className="bg-linear-to-r from-red-900/30 to-pink-900/30 border border-red-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-400" size={20} />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {info ? (
            <div className="bg-linear-to-r from-green-900/30 to-lime-900/30 border border-green-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-green-400" size={20} />
              <p className="text-sm text-green-300">{info}</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Lamp size={16} className="text-indigo-400" />
                  รหัสผ่านใหม่ / New Password{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      lastActionRef.current = Date.now(); // นับว่าเป็น activity
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-500"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <Lamp
                    className="absolute left-3 top-3.5 text-gray-500"
                    size={20}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                      lastActionRef.current = Date.now();
                    }}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {passwordTouched && password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            backgroundColor: passwordStrength.color,
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-medium"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {[
                        {
                          check: password.length >= 8,
                          text: "ความยาวอย่างน้อย 8 ตัวอักษร",
                        },
                        {
                          check: /[A-Z]/.test(password),
                          text: "มีตัวอักษรพิมพ์ใหญ่ (A-Z)",
                        },
                        {
                          check: /[a-z]/.test(password),
                          text: "มีตัวอักษรพิมพ์เล็ก (a-z)",
                        },
                        {
                          check: /[0-9]/.test(password),
                          text: "มีตัวเลข (0-9)",
                        },
                        {
                          check: /[^A-Za-z0-9]/.test(password),
                          text: "มีอักขระพิเศษ (!@#$%^&*)",
                        },
                      ].map((req, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs"
                        >
                          {req.check ? (
                            <Check className="text-green-400" size={14} />
                          ) : (
                            <X className="text-gray-500" size={14} />
                          )}
                          <span
                            className={
                              req.check ? "text-green-300" : "text-gray-400"
                            }
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Shield size={16} className="text-indigo-400" />
                  ยืนยันรหัสผ่าน / Confirm Password{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      lastActionRef.current = Date.now();
                    }}
                    onBlur={() => setConfirmTouched(true)}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-900 border rounded-xl focus:ring-2 outline-none transition-all text-white placeholder-gray-500
                  ${
                    confirmTouched && confirmPassword
                      ? passwordsMatch
                        ? "border-green-700 focus:ring-green-500 focus:border-green-500"
                        : "border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <Shield
                    className="absolute left-3 top-3.5 text-gray-500"
                    size={20}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowConfirmPassword(!showConfirmPassword);
                      lastActionRef.current = Date.now();
                    }}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {confirmTouched && confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {passwordsMatch ? (
                      <>
                        <Check className="text-green-400" size={16} />
                        <span className="text-xs text-green-300">
                          รหัสผ่านตรงกัน
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="text-red-400" size={16} />
                        <span className="text-xs text-red-300">
                          รหัสผ่านไม่ตรงกัน
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={
                  isLoading || !passwordsMatch || passwordStrength.score < 3
                }
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>กำลังบันทึก... / Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>ยืนยันรหัสผ่านใหม่ / Confirm New Password</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/50">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-400 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-medium text-blue-300 mb-1">
                  เคล็ดลับความปลอดภัย:
                </p>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li>• ไม่ควรใช้รหัสผ่านเดียวกันกับเว็บไซต์อื่น</li>
                  <li>• เปลี่ยนรหัสผ่านเป็นประจำทุก 3-6 เดือน</li>
                  <li>• ไม่ควรแชร์รหัสผ่านกับผู้อื่น</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
