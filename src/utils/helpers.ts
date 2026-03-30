import CryptoJS from "crypto-js";
import type {
  ActivityInput,
  ActivityType,
  Get_ProjectsList_Data,
  LoginRequestData,
  Project,
  RegisterRequestData,
  User,
} from "../types/types";

// ====== Helper: เข้ารหัสรหัสผ่าน (ใช้ตอนล็อคอิน) ======
export const encryptPassword = (password: string): string => {
  const dataToEncrypt = JSON.stringify(password);
  const encrypted = CryptoJS.AES.encrypt(
    dataToEncrypt,
    import.meta.env.VITE_ENCRYPTION_SECRET,
  ).toString();
  return encrypted;
};
export const encryptData = (
  data:
    | RegisterRequestData
    | LoginRequestData
    | Get_ProjectsList_Data
    | User
    | string,
) => {
  const dataToEncrypt = JSON.stringify(data);

  const encrypted = CryptoJS.AES.encrypt(
    dataToEncrypt,
    import.meta.env.VITE_ENCRYPTION_SECRET,
  ).toString();

  return encrypted;
};

export const isEnglishOnly = (str: string): boolean =>
  /^[\x20-\x7E]*$/.test(str);

export const validateLicenseFormat = (value: string): boolean => {
  if (!value) return true; // ถ้าไม่ได้กรอก ให้ผ่าน (เราจะ validate ตอนส่งว่า required สำหรับ vet)
  const licenseRegex = /^\d{1,2}-\d{1,7}\/\d{4}$/;
  return licenseRegex.test(value);
};

// Decrypt data
export const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(
    data,
    import.meta.env.VITE_ENCRYPTION_PASS_SECRET,
  );
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};

/* =========================
   Utilities
   ========================= */

// รูปแบบวันที่-เวลาแบบไทย
export const formatTHDateTime = (iso: string) => {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
};

export const formatThaiDate = (dateString: string) => {
  const date = new Date(dateString);
  const thaiMonths = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  const time = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} ${month} ${year} ${time}`;
};

export const currencyTHB = (amount: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0, // บาทไม่มีสตางค์
  }).format(amount);

/**
 * แปลง discount ที่มาจาก DB เป็น string → เป็นเปอร์เซ็นต์แบบ int [0..100]
 * รองรับ: "5", "5%", "  10 % ", "0.05" (ตีความเป็น 5%)
 */
export const parseDiscountPercent = (raw: string): number => {
  if (!raw) return 0;
  const s = String(raw).trim();

  // มี % → ดึงตัวเลขก่อน %
  const percentMatch = s.match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (percentMatch) {
    const val = parseFloat(percentMatch[1]);
    return clampPercent(val);
  }

  // กรองอักขระที่ไม่ใช่เลข/จุด
  const num = Number(s.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(num)) return 0;

  // heuristic:
  // - num <= 1 → ถือเป็นสัดส่วน (0.05 = 5%)
  // - num > 1  → ถือเป็นเปอร์เซ็นต์ตรง ๆ (5 = 5%)
  const percent = num <= 1 ? num * 100 : num;
  return clampPercent(percent);
};

const clampPercent = (p: number) => Math.min(100, Math.max(0, Math.round(p)));

export const getFinalPricePercent = (price: number, percent: number) => {
  const p = clampPercent(percent);
  const final = price * (1 - p / 100);
  return Math.round(Math.max(0, final));
};

const nowMs = () => Date.now();
const toMs = (iso: string) => new Date(iso).getTime();

// รวม capacity ทั้งโปรเจกต์
export const getTotalCapacity = (activities: ActivityInput[] = []) =>
  activities.reduce((sum, a) => sum + (Number(a.capacity) || 0), 0);

// เช็คว่าตอนนี้อยู่ในช่วงเปิดรับไหม
export const isRegiOpen = (
  openISO: string | number,
  closeISO: string | number,
) => {
  const now = Date.now();
  const toMs = (v: string | number) => {
    const d = typeof v === "number" ? new Date(v) : new Date(String(v));
    return isNaN(d.getTime()) ? now : d.getTime();
  };
  return now >= toMs(openISO) && now <= toMs(closeISO);
};

// เช็คว่าปิดรับแล้วไหม (เลย close_regi)
export const isClosed = (closeISO: string | number) => {
  const now = Date.now();
  const closeMs = new Date(String(closeISO)).getTime();
  return now > closeMs;
};

// เช็คว่า “รอเปิดรับ” ไหม (ยังไม่ถึง open_regi)
export const isNotYetOpen = (openISO: string | number) => {
  const now = Date.now();
  const openMs = new Date(String(openISO)).getTime();
  return now < openMs;
};

export const isSoldOut = (closeISO: string) => nowMs() > toMs(closeISO);

// Helper: normalize raw API data to match Project type
export const normalizeProject = (raw: any): Project => {
  const openRegi = raw.open_regi || raw.openRegi || "";
  const closeRegi = raw.close_regi || raw.closeRegi || "";
  const createdAt = raw.createdAt || raw.created_at || new Date().toISOString();
  const updatedAt = raw.updatedAt || raw.updated_at || new Date().toISOString();

  // activities
  const activitiesFromDb = Array.isArray(raw.pgtProjectActivities)
    ? raw.pgtProjectActivities.map((a: any) => ({
        id: Number(a.id),
        type: String(a.type) as ActivityType,
        capacity: Number(a.capacity) || 0,
        earlyPrice: Number(a.earlyPrice) || 0,
        regularPrice: Number(a.regularPrice) || 0,
      }))
    : Array.isArray(raw.activities)
      ? raw.activities
      : [];

  // ⭐ registrations ของโปรเจคนี้
  const registrations = Array.isArray(raw.pgtProjectRegistrations)
    ? raw.pgtProjectRegistrations.map((r: any) => ({
        projectId: r.projectId, // อาจเป็น number หรือ string
        packageName: String(
          r.packageName || r.package || r.type || "",
        ).toUpperCase(),
      }))
    : [];

  return {
    id: String(raw.id || raw._id || ""),
    title: String(raw.title || ""),
    subtitle: String(raw.subtitle || raw.subtitile || ""),
    detail: String(raw.detail || ""),
    image: String(raw.image || "/images/placeholder.jpg"),
    count_regi: Number(raw.count_regi) || 0,
    price_regi: Number(raw.price_regi) || 0,
    discount: String(raw.discount || "0"),
    open_regi: openRegi,
    close_regi: closeRegi,
    activities: activitiesFromDb,
    createdAt,
    updatedAt,

    // เก็บ registrations ไว้ใช้เช็คแพ็กเกจเต็ม
    pgtProjectRegistrations: registrations,
  };
};

// Early Bird: 7 วันแรกหลัง open_regi (และต้องอยู่ในช่วงเปิดรับ)
export const isEarlyBirdNow = (open_regi: string) => {
  const now = Date.now();
  const openMs = new Date(open_regi).getTime();
  const earlyEndMs = openMs + 0 * 24 * 60 * 60 * 1000;
  return now >= openMs && now < earlyEndMs;
};

// ราคาปัจจุบันของ activity ตามช่วงเวลา
export const getCurrentPrice = (a: ActivityInput, open_regi: string) =>
  isEarlyBirdNow(open_regi) ? a.earlyPrice : a.regularPrice;

// ราคาต่ำสุดต่อประเภท (ใช้โชว์)
export const getMinPriceByType = (
  activities: ActivityInput[] = [],
  open_regi: string,
): Record<ActivityType, number | null> => {
  const priceMap: Record<ActivityType, number[]> = {
    LECTURE: [],
    LAB: [],
    WORKSHOP: [],
  };

  for (const a of activities) {
    const current = getCurrentPrice(a, open_regi);
    if (a.type in priceMap && Number.isFinite(current)) {
      priceMap[a.type as ActivityType].push(Number(current));
    }
  }

  const toMin = (arr: number[]) => (arr.length ? Math.min(...arr) : null);

  return {
    LECTURE: toMin(priceMap.LECTURE),
    LAB: toMin(priceMap.LAB),
    WORKSHOP: toMin(priceMap.WORKSHOP),
  };
};

// ⭐ กำหนดชื่อ package ที่จะใช้เทียบกับ registrations.packageName
// ปรับให้ตรงกับ backend ได้ เช่น return 'PACKAGE 1' ถ้า backend เก็บแบบนั้น
export const packageNameForType = (type: ActivityType) => {
  // สมมติ backend เก็บเป็นชื่อ type ตรง ๆ
  // ถ้า backend ใช้ "Package 1" เป็นต้น ให้ map แบบนี้ได้:
  // if (type === 'LECTURE') return 'PACKAGE 1';
  // if (type === 'LAB') return 'PACKAGE 2';
  // if (type === 'WORKSHOP') return 'PACKAGE 3';
  return type.toUpperCase();
};

// ⭐ นับจำนวนสมัครสำหรับแพ็กเกจนี้ในโปรเจคนี้
export const getRegistrationsCountForPackage = (
  project: Project,
  type: ActivityType,
) => {
  const targetProjectId = String(project.id);
  const targetPackage = packageNameForType(type); // ชื่อที่ใช้เทียบ

  const list = project.pgtProjectRegistrations || [];
  return list.filter(
    (r) =>
      String(r.projectId) === targetProjectId &&
      r.packageName === targetPackage,
  ).length;
};

// ⭐ เช็คว่า activity นี้ "เต็มแล้ว" หรือยัง (ใช้ registrations.length เทียบ capacity)
export const isActivityFullByRegistrations = (
  project: Project,
  activity: ActivityInput,
) => {
  const count = getRegistrationsCountForPackage(project, activity.type);
  const cap = Number(activity.capacity || 0);
  return cap > 0 && count >= cap;
};

// (ถ้าต้องใช้โปรเจคเต็มทั้งโปรเจค)
export const isProjectFullByRegistrations = (project: Project) => {
  const totalCap = getTotalCapacity(project.activities);
  const totalRegs = (project.pgtProjectRegistrations || []).filter(
    (r) => String(r.projectId) === String(project.id),
  ).length;
  return totalCap > 0 && totalRegs >= totalCap;
};

// label ไทย/แพ็กเกจ (ปรับให้ตรงกับที่คุณอธิบาย)
export const activityLabel = (type: ActivityType) => {
  switch (type) {
    case "LECTURE":
      return "ภาคบรรยาย";
    case "LAB":
      return "แล็ป";
    case "WORKSHOP":
      return "ภาคบรรยายและปฏิบัติการ";
    default:
      return type;
  }
};

export const formatRelativeTime = (iso: string) => {
  const now = new Date();
  const date = new Date(iso);
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) {
    return `อีก ${diffInDays} วัน`;
  } else if (diffInDays === 0) {
    return "วันนี้";
  } else {
    return `${Math.abs(diffInDays)} วันที่ผ่านมา`;
  }
};

export const safeToMs = (input: string | number): number => {
  if (typeof input === "number") return input;
  const d = new Date(input);
  return isNaN(d.getTime()) ? nowMs() : d.getTime();
};

export const isClosingSoon = (closeISO: string | number) => {
  const now = nowMs();
  const closeMs = safeToMs(closeISO);
  const daysUntilClose = (closeMs - now) / (1000 * 60 * 60 * 24);
  return daysUntilClose <= 3 && daysUntilClose > 0;
};

// แปลง data URL หรือ base64 ล้วน ให้เป็น Blob
export const base64ToBlob = (
  input: string,
  fallbackMime = "image/jpeg",
): Blob => {
  // ถ้าเป็น data URL: data:<mime>;base64,<data>
  const isDataUrl = input.startsWith("data:");
  let mime = fallbackMime;
  let base64Data = input;

  if (isDataUrl) {
    const commaIdx = input.indexOf(",");
    const header = input.substring(0, commaIdx); // e.g., data:image/png;base64
    base64Data = input.substring(commaIdx + 1); // pure base64
    const match = /data:(.*?);base64/.exec(header);
    if (match && match[1]) mime = match[1];
  } else {
    // ถ้าไม่ใช่ data URL คุณอาจรู้ mime จากฟอร์ม หรือกำหนด fallback ตามนามสกุลไฟล์
    mime = fallbackMime;
  }

  // decode base64 -> binary
  const byteChars = atob(base64Data);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: mime });
};

// สร้าง File จาก Blob (ถ้าต้องการแนบชื่อไฟล์)
export const blobToFile = (blob: Blob, filename = "slip.jpg"): File => {
  return new File([blob], filename, { type: blob.type });
};

// โหลด Blob เป็น ImageBitmap/HTMLImageElement แล้ววาดลง Canvas
const loadImageFromBlob = async (blob: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("โหลดรูปไม่สำเร็จ"));
    };
    img.src = url;
  });
};

/**
 * บีบอัดภาพให้ ≤ maxBytes ด้วยการปรับ quality และ scale
 * - targetMime: 'image/webp' จะบีบอัดได้ดีกว่า 'image/jpeg' ในหลายกรณี
 * - qualityMin: ขีดจำกัดขั้นต่ำของคุณภาพ (0.5 = 50%)
 * - scaleMin: ขีดจำกัดขั้นต่ำของสเกล (เช่น 0.5 = ลดเหลือ 50% จากมิติเดิม)
 */
export async function compressImageToMaxSize(
  input: Blob | File,
  options: {
    maxBytes?: number;
    targetMime?: "image/webp" | "image/jpeg";
    qualityStart?: number;
    qualityMin?: number;
    scaleStart?: number;
    scaleMin?: number;
    filename?: string;
  } = {},
): Promise<File> {
  const {
    maxBytes = 2 * 1024 * 1024, // 2MB
    targetMime = "image/webp", // ใช้ webp เป็นค่าเริ่มแนะนำ
    qualityStart = 0.9,
    qualityMin = 0.5,
    scaleStart = 1.0,
    scaleMin = 0.5,
    filename = "slip.webp",
  } = options;

  // ถ้าไม่ใช่ image/*: คืนไฟล์เดิม (บีบอัดไม่ได้ด้วย canvas)
  if (!String(input.type || "").startsWith("image/")) {
    return blobToFile(input, filename.replace(/\.webp$/, ".bin"));
  }

  // โหลดรูปจาก Blob
  const img = await loadImageFromBlob(input);

  // เตรียม Canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context สร้างไม่สำเร็จ");

  let quality = qualityStart;
  let scale = scaleStart;

  // วนปรับลดคุณภาพ/มิติภาพจนกว่าจะ ≤ maxBytes หรือถึงเพดานขั้นต่ำ
  while (quality >= qualityMin && scale >= scaleMin) {
    canvas.width = Math.max(1, Math.floor(img.width * scale));
    canvas.height = Math.max(1, Math.floor(img.height * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // วาดภาพ
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // ส่งออกเป็น Blob
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob(
        (b) => resolve(b || new Blob([], { type: targetMime })),
        targetMime,
        quality,
      ),
    );

    if (blob.size <= maxBytes) {
      // บีบอัดสำเร็จ
      const finalName =
        targetMime === "image/webp"
          ? filename.replace(/\.\w+$/, ".webp")
          : filename.replace(/\.\w+$/, ".jpg");
      return blobToFile(blob, finalName);
    }

    // ปรับลดเพิ่มเติม:
    // 1) ลด quality ทีละ 0.1 จนถึง qualityMin
    if (quality > qualityMin) {
      quality = Math.max(qualityMin, quality - 0.1);
    } else {
      // 2) ลด scale ทีละ 0.1 จนถึง scaleMin
      scale = Math.max(scaleMin, scale - 0.1);
      // และรีเซ็ต quality กลับไปสูงหน่อยเพื่อรักษาคุณภาพหลังลดมิติ
      quality = Math.min(qualityStart, quality + 0.2);
    }
  }

  // ถ้าบีบอัดไม่สำเร็จ (ไฟล์ยังใหญ่เกิน) — คืนไฟล์สุดท้ายที่บีบอัดได้มากที่สุด
  const fallbackBlob: Blob = await new Promise((resolve) =>
    canvas.toBlob(
      (b) => resolve(b || new Blob([], { type: targetMime })),
      targetMime,
      Math.max(qualityMin, qualityMin - 0.1),
    ),
  );
  const fallbackName =
    targetMime === "image/webp"
      ? filename.replace(/\.\w+$/, ".webp")
      : filename.replace(/\.\w+$/, ".jpg");
  return blobToFile(fallbackBlob, fallbackName);
}
