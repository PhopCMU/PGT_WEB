import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lamp,
  RefreshCw,
  Shield,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotKey from "../layouts/NotKey";

import { newPasswordUser } from "../../services/registrationService";
import { decryptData } from "../../utils/helpers";

type DecodedData = {
  id: number;
  email: string;
  codeId: string;
  exp: number;
};

const LINK_TTL_MS = 30 * 60 * 1000;

export default function NewPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [codeId, setCodeId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const key = queryParams.get("key");
  const hasRun = useRef(false);
  const navigate = useNavigate();

  const [expiresAtMs, setExpiresAtMs] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const lastActionRef = useRef<number>(Date.now());

  if (!key) {
    return <NotKey />;
  }

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

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      try {
        const data: DecodedData = await decryptData(key);
        const expMs = Number(data.exp);

        if (!Number.isFinite(expMs) || expMs <= 0) {
          navigate(`/link-expired?key=${key}`, { replace: true });
          return;
        }

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
  }, [expiresAtMs, navigate, key]);

  useEffect(() => {
    const updateAction = () => {
      lastActionRef.current = Date.now();
    };

    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((ev) =>
      document.addEventListener(ev, updateAction, { passive: true }),
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
  }, [navigate, key]);

  const validatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const colors = ["#dc2626", "#ea580c", "#ca8a04", "#65a30d", "#16a34a"];
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
      const payload = { id, email, codeId, password };
      const response = await newPasswordUser(payload as any);
      if (!response.success) throw new Error(response.message);
      setIsLoading(false);
      await Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "รหัสผ่านใหม่ถูกสร้างเรียบร้อยแล้ว",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/sign-in", { replace: true });
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 md:p-10 border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
            <KeyRound className="text-blue-600" size={36} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
            สร้างรหัสผ่านใหม่ 🔒
          </h2>
          <h3 className="text-lg font-bold text-gray-400">
            Create New Password
          </h3>
        </div>

        {expiresAtMs && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-bold text-sm">
              <span>⏳ ลิงก์จะหมดอายุใน:</span>
              <span className="font-black text-amber-800">
                {formatDurationTH(remainingMs)}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-bold text-red-900">{error}</p>
            </div>
          )}

          <>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Lamp size={16} className="text-blue-600" />
                รหัสผ่านใหม่ / New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    lastActionRef.current = Date.now();
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  className="w-full pl-10 pr-12 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {passwordTouched && password && (
                <div className="mt-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-black uppercase tracking-wider"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      {
                        check: password.length >= 8,
                        text: "ยาว 8 ตัวขึ้นไป",
                      },
                      {
                        check: /[A-Z]/.test(password),
                        text: "มีพิมพ์ใหญ่ A-Z",
                      },
                      {
                        check: /[a-z]/.test(password),
                        text: "มีพิมพ์เล็ก a-z",
                      },
                      { check: /[0-9]/.test(password), text: "มีตัวเลข 0-9" },
                      {
                        check: /[^A-Za-z0-9]/.test(password),
                        text: "มีอักขระพิเศษ",
                      },
                    ].map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs font-bold"
                      >
                        {req.check ? (
                          <Check className="text-emerald-500" size={14} />
                        ) : (
                          <X className="text-gray-300" size={14} />
                        )}
                        <span
                          className={
                            req.check ? "text-emerald-700" : "text-gray-400"
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

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Shield size={16} className="text-blue-600" />
                ยืนยันรหัสผ่าน / Confirm Password
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
                  className={`w-full pl-10 pr-12 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-4 outline-none transition-all font-medium ${
                    confirmTouched && confirmPassword
                      ? passwordsMatch
                        ? "border-emerald-200 focus:ring-emerald-500/10"
                        : "border-red-200 focus:ring-red-500/10"
                      : "border-gray-100 focus:ring-blue-500/10 focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                isLoading || !passwordsMatch || passwordStrength.score < 3
              }
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin mx-auto" size={24} />
              ) : (
                "ยืนยันรหัสผ่านใหม่ / Confirm"
              )}
            </button>
          </>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-600 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-black text-blue-900 uppercase tracking-wider mb-1">
                  Security Tips:
                </p>
                <ul className="text-xs text-blue-700 font-medium space-y-1">
                  <li>• อย่าใช้รหัสผ่านซ้ำกับเว็บอื่น</li>
                  <li>• ควรเปลี่ยนรหัสผ่านทุก 3-6 เดือน</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
