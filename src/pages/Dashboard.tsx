import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  CalendarDays,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Search,
  Zap,
  X,
  Tag,
  ChevronDown,
  Sparkles,
  Trash2,
  Upload,
  CreditCard,
  RefreshCw,
  Database,
  Shield,
  TrendingUp,
  Check,
  Copy,
} from "lucide-react";
import { getToken, getUserFromToken } from "../utils/authService";
import { Get_ProjectsList } from "../services/GetService";
import type { ActivityType, Project } from "../types/types";
import {
  activityLabel,
  base64ToBlob,
  blobToFile,
  compressImageToMaxSize,
  formatRelativeTime,
  formatTHDateTime,
  getCurrentPrice,
  getRegistrationsCountForPackage,
  getTotalCapacity,
  isActivityFullByRegistrations,
  isClosed,
  isClosingSoon,
  isEarlyBirdNow,
  isNotYetOpen,
  normalizeProject,
  safeToMs,
} from "../utils/helpers";
import { Post_Register } from "../services/PostServer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  usePgtRealtime,
  type RegistrationCreatedPayload,
  type ProjectUpdatedPayload,
} from "../realtime/usePgtRealtime";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const user = getUserFromToken() || "";
  const navigate = useNavigate();

  const PAGE_SIZE = 6;

  const nowMs = () => Date.now();
  const isRegiOpen = (openISO: string | number, closeISO: string | number) => {
    const now = nowMs();
    return now >= safeToMs(openISO) && now <= safeToMs(closeISO);
  };
  const isSoldOut = (closeISO: string | number) => nowMs() > safeToMs(closeISO);

  // /*----A4 Container----*/
  const A4Container = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div
        className={`relative w-full ${className}`}
        style={{ aspectRatio: "0.707" }}
      >
        {children}
      </div>
    );
  };

  // /*----Fetch Data----*/
  const hasFetchedDataRef = useRef(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const fetchDataProjects = async () => {
    try {
      const email = (user as any).email || "";
      const response = await Get_ProjectsList(email);

      if (!response?.success) {
        console.error("Fetch projects failed:", response?.message);
        setProjects([]);
        return;
      }

      const normalized = (response.results || []).map(normalizeProject);
      setProjects(normalized);
    } catch (error) {
      console.error("Fetch projects error:", error);
      setProjects([]);
    }
  };

  // Realtime throttle — ป้องกันโหลดซ้ำถี่เกินไป
  const lastRealtimeReloadRef = useRef(0);
  const REALTIME_COOLDOWN_MS = 10_000; // 10 seconds

  const throttledFetchDataProjects = () => {
    const now = Date.now();
    if (now - lastRealtimeReloadRef.current < REALTIME_COOLDOWN_MS) return;
    lastRealtimeReloadRef.current = now;
    fetchDataProjects();
  };

  // Optimistic update — อัปเดต count ใน local state ทันทีโดยไม่รอ API
  const applyRegistrationCreated = (payload: RegistrationCreatedPayload) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (String(p.id) !== String(payload.projectId)) return p;
        const newReg = {
          projectId: payload.projectId,
          packageName: payload.activityType?.toUpperCase() ?? "",
        };
        return {
          ...p,
          count_regi: p.count_regi + 1,
          pgtProjectRegistrations: [
            ...(p.pgtProjectRegistrations || []),
            newReg,
          ],
        };
      }),
    );
  };

  const applyProjectUpdated = (payload: ProjectUpdatedPayload) => {
    if (payload.countRegi == null) return;
    setProjects((prev) =>
      prev.map((p) =>
        String(p.id) === String(payload.projectId)
          ? { ...p, count_regi: payload.countRegi! }
          : p,
      ),
    );
  };

  // Realtime Connection
  const { status } = usePgtRealtime({
    token: getToken() ?? "",
    onRegistrationCreated: (payload) => {
      applyRegistrationCreated(payload); // อัปเดต UI ทันที
      throttledFetchDataProjects(); // sync กับ API ใน background
    },
    onProjectUpdated: (payload) => {
      applyProjectUpdated(payload); // อัปเดต count ทันที
      throttledFetchDataProjects(); // sync กับ API ใน background
    },
  });

  useEffect(() => {
    if (hasFetchedDataRef.current) return;
    hasFetchedDataRef.current = true;

    fetchDataProjects();
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const email = (user as any).email || "";
      const response = await Get_ProjectsList(email);

      if (response?.success) {
        const normalized = (response.results || []).map(normalizeProject);
        setProjects(normalized);
      }
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // /*----Project Card----*/
  const ProjectCard = ({ project }: { project: Project }) => {
    const soldOut = isSoldOut(project.close_regi);
    const open = isRegiOpen(project.open_regi, project.close_regi);
    const closingSoon = isClosingSoon(project.close_regi);
    const earlyBadge = isEarlyBirdNow(project.open_regi);
    const [errors, setErrors] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // เลือกกิจกรรม/แพ็กเกจ
    const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
    const [slipPayment, setSlipPayment] = useState<any>(null);

    // Preselect ถ้ามีรายการเดียว
    useEffect(() => {
      if (!project.activities?.length) return;
      if (project.activities.length === 1) {
        setSelectedType(project.activities[0].type);
      }
    }, [project.activities]);

    // คำนวณราคาปัจจุบันของกิจกรรมที่เลือก
    const selectedActivityPrice = useMemo(() => {
      if (!selectedType) return null;
      const candidates = project.activities.filter(
        (a) => a.type === selectedType,
      );
      if (!candidates.length) return null;
      return Math.min(
        ...candidates.map((a) => getCurrentPrice(a, project.open_regi)),
      );
    }, [selectedType, project.activities, project.open_regi]);

    // แยกเงื่อนไขเลือก/สมัคร
    const canSelect = open && !soldOut && !!user;
    const canRegister = canSelect && !!selectedType && !!slipPayment;

    // /*----API POST----*/
    const handleRegister = async (project: {
      userId: string;
      projectId: number;
      activityType: ActivityType;
      pricingTier: string;
      price: number;
      slipPayment: string;
    }) => {
      setIsLoading(true);
      setErrors("");

      Swal.fire({
        title: "กำลังส่งข้อมูล...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        background: "#111827",
        color: "#e2e8f0",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const binary = base64ToBlob(project.slipPayment, "image/jpeg");
        let binaryName = blobToFile(
          binary,
          `slip_${project.userId}_${project.projectId}_${project.activityType}_${project.pricingTier}_${project.price}.jpg`,
        );

        if (!binaryName) {
          Swal.fire({
            icon: "error",
            title: "ไฟล์ไม่ถูกต้อง",
            text: "Invalid file",
            background: "#111827",
            color: "#e2e8f0",
            confirmButtonColor: "#3b82f6",
            confirmButtonText: "ลองอีกครั้ง",
          });
          return;
        }

        if (binaryName.size > 2 * 1024 * 1024) {
          binaryName = await compressImageToMaxSize(binaryName, {
            maxBytes: 2 * 1024 * 1024,
            targetMime: "image/webp",
            filename: binaryName.name,
          });
        }

        const formData = new FormData();
        formData.append("userId", project.userId);
        formData.append("projectId", project.projectId.toString());
        formData.append("activityType", project.activityType);
        formData.append("pricingTier", project.pricingTier);
        formData.append("price", project.price.toString());
        formData.append("slipPayment", binaryName);

        const response = await Post_Register(formData);
        if (!response?.success) {
          Swal.fire({
            icon: "error",
            title: "สมัครไม่สำเร็จ",
            text: response?.message?.mgs || "Registration failed",
            background: "#111827",
            color: "#e2e8f0",
            confirmButtonColor: "#3b82f6",
            confirmButtonText: "ลองอีกครั้ง",
          });
          return;
        }

        // บล็อก socket event ไม่ให้ trigger re-fetch ระหว่างแสดง success (6 วินาที)
        lastRealtimeReloadRef.current = Date.now() + 6_000;

        Swal.fire({
          icon: "success",
          title: "ลงทะเบียนสำเร็จ!",
          html: "<span style='color:#94a3b8'>ระบบได้รับการสมัครของคุณแล้ว</span>",
          background: "#111827",
          color: "#e2e8f0",
          timer: 5000,
          timerProgressBar: true,
          confirmButtonColor: "#10b981",
          confirmButtonText: "ดูโปรเจคที่สมัคร",
          showCancelButton: true,
          cancelButtonText: "ปิด",
          cancelButtonColor: "#374151",
        }).then((result) => {
          setSlipPayment(null);
          setSelectedType(null);
          handleRefresh();
          if (result.isConfirmed) {
            navigate("/project-registration-list");
          }
        });
      } catch (error) {
        console.error("Registration failed:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดในการสมัคร กรุณาลองอีกครั้ง",
          background: "#111827",
          color: "#e2e8f0",
          confirmButtonColor: "#3b82f6",
          confirmButtonText: "ลองอีกครั้ง",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // /*----FileUpload----*/
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const file = e.target.files?.[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setErrors("กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น (JPG, PNG, GIF, WEBP)");
        e.target.value = "";
        return;
      }

      if (file.size > maxSize) {
        setErrors("ไฟล์มีขนาดใหญ่เกิน 5MB");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSlipPayment(base64);
        setErrors("");
      };
      reader.onerror = () => {
        setErrors("เกิดข้อผิดพลาดในการอ่านไฟล์");
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    };

    // /*----Copy Account Number----*/
    const [copied, setCopied] = useState(false);
    const accountNumber = "667-212002-0"; // เลขบัญชี

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        // ตั้งเวลา 2 วินาทีให้กลับเป็นไอคอนเดิม
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };

    return (
      <div className="group relative  rounded-2xl border border-gray-800 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-blue-500/5 to-purple-500/5 rounded-tr-2xl" />
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/5 rounded-full blur-xl" />

        <div className="relative overflow-hidden rounded-t-2xl">
          <A4Container>
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop";
                e.currentTarget.className += " opacity-50";
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          </A4Container>

          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {soldOut && (
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-red-900/80 to-rose-900/80 backdrop-blur-sm text-red-200 text-xs font-bold px-3 py-2 rounded-full border border-red-800/50">
                <AlertCircle size={12} />
                SOLD OUT
              </div>
            )}
            {!soldOut && closingSoon && (
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-amber-900/80 to-orange-900/80 backdrop-blur-sm text-amber-200 text-xs font-bold px-3 py-2 rounded-full border border-amber-800/50 animate-pulse">
                <Clock size={12} />
                กำลังจะปิด!
              </div>
            )}
            {earlyBadge && open && !soldOut && (
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-yellow-900/80 to-amber-900/80 backdrop-blur-sm text-yellow-200 text-xs font-bold px-3 py-2 rounded-full border border-yellow-800/50">
                <Zap size={12} />
                Early Bird
              </div>
            )}
          </div>

          <div className="absolute bottom-4 right-4">
            {!soldOut && open && (
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-900/80 to-green-900/80 backdrop-blur-sm text-emerald-200 text-xs font-bold px-3 py-2 rounded-full border border-emerald-800/50">
                <CheckCircle size={12} />
                เปิดรับสมัคร
              </div>
            )}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Title Section */}
          <div>
            <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-1">
              {project.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {project.detail}
          </p>

          {/* Activity Selection */}
          {!isClosed(project.close_regi) && !isNotYetOpen(project.open_regi) ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">
                  เลือกแพ็กเกจ/กิจกรรม
                </span>
              </div>

              <div className="space-y-3">
                {project.activities.map((a) => {
                  const price = getCurrentPrice(a, project.open_regi);
                  const isChecked = selectedType === a.type;
                  const activityFull = isActivityFullByRegistrations(
                    project,
                    a,
                  );
                  const regsCount = getRegistrationsCountForPackage(
                    project,
                    a.type,
                  );
                  const remaining = Math.max(
                    0,
                    Number(a.capacity || 0) - regsCount,
                  );

                  const handleSelect = () => {
                    if (activityFull) return;
                    if (isNotYetOpen(project.open_regi)) return;
                    setSelectedType(a.type);
                    setErrors("");
                  };

                  return (
                    <label
                      key={`${a.type}-${a.id ?? Math.random()}`}
                      className={[
                        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all",
                        isChecked && !activityFull
                          ? "border-blue-500 bg-blue-900/20"
                          : activityFull
                            ? "border-gray-700 bg-gray-900/50 cursor-not-allowed opacity-60"
                            : "border-gray-700 bg-gray-900/30 hover:bg-gray-800/50",
                      ].join(" ")}
                      onClick={handleSelect}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${
                                isChecked && !activityFull
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-600"
                              }
                              ${activityFull ? "border-gray-500" : ""}
                            `}
                        >
                          {isChecked && !activityFull && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-semibold ${
                              activityFull ? "text-gray-500" : "text-gray-200"
                            }`}
                          >
                            {activityLabel(a.type)}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {/* {a.capacity} คน */}
                            </span>
                            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                            <span className="text-xs text-gray-500">
                              สมัครแล้ว {regsCount} คน
                            </span>
                            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                            <span
                              className={`text-xs font-medium ${
                                remaining <= 5
                                  ? "text-red-400"
                                  : "text-green-400"
                              }`}
                            >
                              คงเหลือ {remaining} คน
                            </span>
                          </div>
                          {activityFull && (
                            <span className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded bg-red-900/30 border border-red-800/50 text-red-300 w-fit">
                              เต็มแล้ว
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            activityFull ? "text-gray-500" : "text-white"
                          }`}
                        >
                          ฿{price.toLocaleString("th-TH")}
                        </div>
                        <div className="text-xs text-gray-400">
                          {isEarlyBirdNow(project.open_regi)
                            ? "Early Bird"
                            : "Regular"}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-gray-900/50 to-gray-800/50 text-gray-400 text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-700">
              <Clock size={14} />
              ปิดรับสมัคร
            </div>
          )}

          {/* Project Status */}
          <div>
            {(() => {
              const totalCapacity = getTotalCapacity(project.activities);
              const enrolled = Number(project.count_regi ?? 0);
              const closed = isClosed(project.close_regi);
              const notYetOpen = isNotYetOpen(project.open_regi);
              const open = isRegiOpen(project.open_regi, project.close_regi);
              const full = enrolled >= totalCapacity && totalCapacity > 0;

              if (closed) {
                return (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 border border-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-400">
                      ปิดรับสมัคร
                    </span>
                  </div>
                );
              }

              if (full) {
                return (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-900/30 border border-red-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-sm font-medium text-red-300">
                      เต็มแล้ว
                    </span>
                  </div>
                );
              }

              if (notYetOpen) {
                return (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-900/30 border border-yellow-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm font-medium text-yellow-300">
                      เปิดลงทะเบียน {">"} {formatTHDateTime(project.open_regi)}
                    </span>
                  </div>
                );
              }

              if (open) {
                const early = isEarlyBirdNow(project.open_regi);
                return early ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-900/30 border border-yellow-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm font-medium text-yellow-300">
                      Early Bird
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 border border-blue-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm font-medium text-blue-300">
                      เปิดรับสมัคร {formatTHDateTime(project.open_regi)} -{" "}
                      {formatTHDateTime(project.close_regi)}
                    </span>
                  </div>
                );
              }

              return (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 border border-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-400">
                    สถานะไม่ระบุ
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Info Footer */}
          {!isNotYetOpen(project.open_regi) && (
            <>
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} />
                    <span>
                      ปิดรับ {formatRelativeTime(String(project.close_regi))}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>
                      {project.count_regi || 0}/
                      {getTotalCapacity(project.activities)} คน
                    </span>
                  </div> */}
                </div>
              </div>
              {/* Slip Payment */}
              <div className="space-y-4">
                <div className="flex flex-col gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  {/* ส่วนหัวแบบกะทัดรัด */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-200 text-sm">
                      แนบสลิปชำระเงิน
                    </span>
                  </div>

                  {/* ข้อมูลบัญชี — แสดงเฉพาะเมื่อเลือก Package แล้ว */}
                  {selectedType ? (
                    <div className="space-y-2 text-xs">
                      {/* ธนาคาร */}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-14">ธนาคาร:</span>
                        <span className="text-gray-300 font-medium">
                          ไทยพาณิชย์ สาขามหาวิทยาลัยเชียงใหม่
                        </span>
                      </div>

                      {/* ชื่อบัญชี */}
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500 w-14 shrink-0">
                          ชื่อบัญชี:
                        </span>
                        <span className="text-gray-300">
                          คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่
                        </span>
                      </div>

                      {/* เลขบัญชีพร้อมคัดลอก */}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-14">เลขบัญชี:</span>
                        <div className="flex items-center gap-2 flex-1">
                          <div className="font-mono text-gray-100 font-bold tracking-wider bg-gray-800/50 px-2 py-1 rounded border border-gray-700">
                            667-212002-0
                          </div>
                          <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-md hover:bg-gray-800 transition-colors shrink-0"
                            title="คัดลอกเลขบัญชี"
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-blue-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      กรุณาเลือกแพ็กเกจก่อนเพื่อดูข้อมูลบัญชี
                    </p>
                  )}
                </div>
                <div
                  className={`relative rounded-xl border-2 transition-all ${
                    slipPayment && selectedType
                      ? "border-emerald-500/50 bg-emerald-900/10"
                      : canSelect
                        ? "border-gray-700 hover:border-blue-500/50"
                        : "border-gray-800 bg-gray-900/30"
                  }`}
                >
                  {slipPayment && selectedType ? (
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-700 bg-black/50">
                            <img
                              src={slipPayment}
                              alt="สลิป"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-emerald-300">
                              แนบสลิปแล้ว
                            </p>
                            <p className="text-xs text-gray-400">
                              แตะเพื่อเปลี่ยนไฟล์
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSlipPayment(null)}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                          type="button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            canSelect
                              ? "bg-blue-900/20 border border-blue-800/30"
                              : "bg-gray-900 border border-gray-800"
                          }`}
                        >
                          <Upload
                            className={`w-6 h-6 ${
                              canSelect ? "text-blue-400" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              canSelect ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            {selectedType
                              ? "แตะเพื่ออัพโหลดสลิป"
                              : "เลือกแพ็กเกจก่อนแล้วจึงแนบสลิป"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            รูปภาพเท่านั้น • สูงสุด 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <input
                    disabled={!canSelect || !selectedType}
                    onChange={handleFileUpload}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 disabled:opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    title={
                      !selectedType
                        ? "กรุณาเลือกแพ็กเกจก่อนแนบสลิป"
                        : "อัพโหลดสลิปการชำระเงิน"
                    }
                  />
                </div>
                {/* Error Message */}
                {errors && (
                  <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-red-300 font-medium">
                        คำเตือน
                      </p>
                      <p className="text-sm text-red-200">{errors}</p>
                      <ul className="text-[12px] text-red-200">
                        <p>
                          - ตรวจสอบอีเมลที่ท่านได้ลงทะเบียนไว้ หรือ
                          ดูโปรเจคที่สมัคร
                        </p>
                        <p>- กรณีได้รับโควต้า ดูโปรเจคที่สมัคร</p>
                      </ul>
                    </div>
                  </div>
                )}
                {/* Helper Tips */}
                <div className="text-sm text-gray-400 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-900/30 border border-green-800/50 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    </div>
                    <span>อัพโหลดรูปภาพสลิปการโอนเงิน</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-900/30 border border-green-800/50 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    </div>
                    <span>เห็นเลขบัญชีและยอดโอนได้ชัดเจน</span>
                  </div>
                  {!slipPayment && selectedType && (
                    <div className="flex items-center gap-3 text-amber-300">
                      <div className="w-5 h-5 rounded-full bg-amber-900/30 border border-amber-800/50 flex items-center justify-center">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                      </div>
                      <span>กรุณาแนบสลิปก่อนสมัคร</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <button
            disabled={!canRegister || isLoading}
            onClick={() => {
              if (!canRegister || isLoading) return;
              if (!selectedType) return;
              if (!slipPayment) return;

              const payload = {
                userId: user?.codeId,
                projectId: Number(project.id),
                activityType: selectedType!,
                pricingTier: earlyBadge ? "EARLY" : "REGULAR",
                price: Number(selectedActivityPrice!),
                slipPayment,
              };
              handleRegister(payload);
            }}
            className={`w-full px-4 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
              canRegister && !isLoading
                ? "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                : "bg-gray-900 border border-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>กำลังสมัคร...</span>
              </>
            ) : !user ? (
              <>
                <AlertCircle size={18} />
                <span>เข้าสู่ระบบ</span>
              </>
            ) : soldOut ? (
              "ปิดรับสมัคร"
            ) : !open ? (
              "เปิดลงทะเบียน " + formatTHDateTime(project.open_regi)
            ) : !selectedType ? (
              "เลือกแพ็กเกจเพื่อสมัคร"
            ) : !slipPayment ? (
              "แนบสลิปก่อน"
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>
                  สมัครเข้าร่วม • ฿
                  {Number(selectedActivityPrice).toLocaleString("th-TH")}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Filter and sort logic
  const sorted = useMemo(() => {
    // Filter out projects that are sold out (by date) or full (by capacity)
    let filtered = projects.filter((p) => {
      const soldOut = isSoldOut(p.close_regi);
      const totalCapacity = getTotalCapacity(p.activities);
      const enrolled = Number(p.count_regi ?? 0);
      const isFull = enrolled >= totalCapacity && totalCapacity > 0;
      return !soldOut && !isFull;
    });

    // Filter by status
    if (filter === "open") {
      filtered = filtered.filter((p) => isRegiOpen(p.open_regi, p.close_regi));
    }

    // Search
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.subtitle.toLowerCase().includes(term),
      );
    }

    // Sort: open (soonest first)
    filtered.sort((a, b) => safeToMs(a.close_regi) - safeToMs(b.close_regi));

    return filtered;
  }, [projects, filter, search]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const sliceStart = (currentPage - 1) * PAGE_SIZE;
  const visible = sorted.slice(sliceStart, sliceStart + PAGE_SIZE);

  // Calculate stats
  // const stats = useMemo(() => {
  //   const availableProjects = projects.filter((p) => {
  //     const soldOut = isSoldOut(p.close_regi);
  //     const totalCapacity = getTotalCapacity(p.activities);
  //     const enrolled = Number(p.count_regi ?? 0);
  //     const isFull = enrolled >= totalCapacity && totalCapacity > 0;
  //     return !soldOut && !isFull;
  //   });

  //   return [
  //     {
  //       label: "โปรเจ็กต์ทั้งหมด",
  //       value: availableProjects.length,
  //       icon: <Database className="w-5 h-5" />,
  //       color: "from-blue-500 to-cyan-500",
  //       bg: "bg-blue-900/20",
  //       border: "border-blue-800/30",
  //     },
  //     {
  //       label: "กำลังเปิดรับ",
  //       value: availableProjects.filter((p) =>
  //         isRegiOpen(p.open_regi, p.close_regi),
  //       ).length,
  //       icon: <CheckCircle className="w-5 h-5" />,
  //       color: "from-emerald-500 to-green-500",
  //       bg: "bg-emerald-900/20",
  //       border: "border-emerald-800/30",
  //     },
  //     {
  //       label: "จะปิดเร็วนี้",
  //       value: availableProjects.filter((p) => isClosingSoon(p.close_regi))
  //         .length,
  //       icon: <Clock className="w-5 h-5" />,
  //       color: "from-amber-500 to-orange-500",
  //       bg: "bg-amber-900/20",
  //       border: "border-amber-800/30",
  //     },
  //   ];
  // }, [projects]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-[#111829] to-[#0d1420] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#172131] rounded-2xl border border-gray-800">
                <TrendingUp className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  โครงการทั้งหมด
                </h1>

                {status === "disconnected" ? (
                  <span className="inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 inset-ring inset-ring-red-500/20">
                    {status.split(":")[0].toUpperCase()}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 inset-ring inset-ring-green-500/20">
                    {status.split(":")[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 bg-[#172131] hover:bg-[#1a2438] border border-gray-800 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 text-blue-400 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`${stat.bg} border ${stat.border} rounded-2xl p-5 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center text-white`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Controls */}
        <div className="bg-[#161f2f] border border-gray-800 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Results Info */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-900/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  โปรเจ็กต์ที่พบ
                </h2>
                <p className="text-sm text-gray-400">
                  แสดง {Math.min(PAGE_SIZE, visible.length)} จาก {sorted.length}{" "}
                  โปรเจ็กต์
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as any);
                    setPage(1);
                  }}
                  className="pl-12 pr-10 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none w-full sm:w-48"
                >
                  <option value="all" className="bg-gray-900">
                    โปรเจ็กต์ทั้งหมด
                  </option>
                  <option value="open" className="bg-gray-900">
                    เปิดรับสมัคร
                  </option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="ค้นหาโครงการ ชื่อ หรือคำอธิบาย..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-12 pr-10 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filter !== "all" || search) && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">กรองแล้วด้วย:</span>
                <div className="flex flex-wrap gap-2">
                  {filter === "open" && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 text-blue-300 text-xs font-medium rounded-lg border border-blue-800/50">
                      เปิดรับสมัคร
                      <button
                        onClick={() => setFilter("all")}
                        className="hover:text-blue-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-900/30 text-purple-300 text-xs font-medium rounded-lg border border-purple-800/50">
                      ค้นหา: "{search}"
                      <button
                        onClick={() => setSearch("")}
                        className="hover:text-purple-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setFilter("all");
                    setSearch("");
                  }}
                  className="ml-auto text-sm text-gray-500 hover:text-gray-300"
                >
                  ล้างทั้งหมด
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {visible.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#161f2f] rounded-2xl border border-gray-800">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-900/50 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              ไม่พบโปรเจ็กต์
            </h3>
            <p className="text-gray-400 mb-6">
              ลองเปลี่ยนคำค้นหาหรือประเภทโปรเจ็กต์ดูนะ
            </p>
            <button
              onClick={() => {
                setFilter("all");
                setSearch("");
              }}
              className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              ล้างตัวกรอง
            </button>
          </div>
        )}

        {/* Pagination */}
        {sorted.length > 0 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-gray-400 text-sm">
              แสดง {sliceStart + 1} -{" "}
              {Math.min(sliceStart + PAGE_SIZE, sorted.length)} จาก{" "}
              {sorted.length} โปรเจ็กต์
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  currentPage <= 1
                    ? "bg-gray-900 border border-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600"
                }`}
              >
                <ChevronLeft size={18} />
                ก่อนหน้า
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-gray-900 border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  currentPage >= totalPages
                    ? "bg-gray-900 border border-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-blue-500/20"
                }`}
              >
                ถัดไป
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
