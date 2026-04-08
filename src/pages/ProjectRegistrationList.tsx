import { useEffect, useRef, useState } from "react";
import {
  Eye,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  X,
  Database,
  Download,
  FileText,
  ChevronRight,
  ChevronDown,
  Info,
  Shield,
  BadgeCheck,
  RefreshCw,
} from "lucide-react";
import { getUserFromToken } from "../utils/authService";
import { Get_ProjectUser } from "../services/GetService";
import type { PgtProjectRegistration } from "../types/types";
import { formatThaiDate } from "../utils/helpers";

export default function ProjectRegistrationList() {
  const [registrations, setRegistrations] = useState<PgtProjectRegistration[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRegistration, setSelectedRegistration] =
    useState<PgtProjectRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedMobileCard, setExpandedMobileCard] = useState<number | null>(
    null,
  );
  const user = getUserFromToken() || "";
  const hasFetchDataProject = useRef<boolean>(false);

  if (!user) {
    return null;
  }

  useEffect(() => {
    if (hasFetchDataProject.current) return;
    hasFetchDataProject.current = true;
    fetchDataProject();
  }, []);

  const fetchDataProject = async () => {
    setIsLoading(true);
    try {
      const email = user?.email || "";
      const codeId = user?.codeId || "";

      const response = await Get_ProjectUser(email, codeId);

      if (!response?.success) {
        console.error("Fetch projects failed:", response?.message);
        return;
      }

      setRegistrations(response.results.pgtProjectRegistrations);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" />
            อนุมัติ
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <AlertCircle className="w-3.5 h-3.5" />
            อยู่ระหว่างตรวจสอบ
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            รออนุมัติ
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            ไม่อนุมัติ
          </span>
        );
      default:
        return null;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <BadgeCheck className="w-3.5 h-3.5" />
            ชำระเงินแล้ว
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <Clock className="w-3.5 h-3.5" />
            รอตรวจสอบสลิป
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            ยกเลิก
          </span>
        );
      default:
        return null;
    }
  };

  const handleDownloadSlip = () => {
    if (!selectedRegistration) return;
    const slipUrl = `${import.meta.env.VITE_API_BASE_URL}/app/upload/PGT/Slip/${
      selectedRegistration.transferSlipUrl
    }`;
    window.open(slipUrl, "_blank");
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = reg.project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || reg.transferSlipStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                รายการสมัครโครงการ
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                ตรวจสอบและจัดการการสมัครโครงการทั้งหมดของคุณ
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">ทั้งหมด</div>
              <div className="text-2xl font-bold text-gray-900">
                {registrations.length}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">อนุมัติ</div>
              <div className="text-2xl font-bold text-emerald-600">
                {
                  registrations.filter(
                    (r) => r.transferSlipStatus === "APPROVED",
                  ).length
                }
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">รอตรวจสอบ</div>
              <div className="text-2xl font-bold text-amber-600">
                {
                  registrations.filter(
                    (r) =>
                      r.transferSlipStatus === "UNDER_REVIEW" ||
                      r.transferSlipStatus === "PENDING",
                  ).length
                }
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-gray-500 text-sm mb-1">ไม่อนุมัติ</div>
              <div className="text-2xl font-bold text-red-600">
                {
                  registrations.filter(
                    (r) => r.transferSlipStatus === "REJECTED",
                  ).length
                }
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อโครงการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all shadow-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none shadow-sm"
                >
                  <option value="all" className="bg-white">
                    สถานะทั้งหมด
                  </option>
                  <option value="APPROVED" className="bg-white">
                    อนุมัติ
                  </option>
                  <option value="UNDER_REVIEW" className="bg-white">
                    อยู่ระหว่างตรวจสอบ
                  </option>
                  <option value="PENDING" className="bg-white">
                    รออนุมัติ
                  </option>
                  <option value="REJECTED" className="bg-white">
                    ไม่อนุมัติ
                  </option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
              <button
                onClick={fetchDataProject}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">รีเฟรช</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      โครงการสัมมนา
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      วันที่สมัคร
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      สถานะการสมัคร
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      สถานะการชำระเงิน
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <FileText className="w-12 h-12 opacity-50" />
                        <div className="text-lg text-gray-500">
                          ไม่พบข้อมูลผู้สมัคร
                        </div>
                        <div className="text-sm text-gray-400">
                          ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {reg.project.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatThaiDate(reg.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(reg.transferSlipStatus)}
                      </td>
                      <td className="px-6 py-4">
                        {getVerificationBadge(reg.paymentStatus)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => setSelectedRegistration(reg)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-200 text-sm font-medium group/btn"
                          >
                            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            ดูรายละเอียด
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile & Tablet Card View */}
        <div className="lg:hidden space-y-4 my-10">
          {filteredRegistrations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg mb-2">ไม่พบข้อมูลผู้สมัคร</div>
              <div className="text-sm">ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</div>
            </div>
          ) : (
            filteredRegistrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() =>
                    setExpandedMobileCard(
                      expandedMobileCard === reg.id ? null : Number(reg.id),
                    )
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {reg.project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        {formatThaiDate(reg.createdAt)}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedMobileCard === reg.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">
                        สถานะการสมัคร
                      </p>
                      {getStatusBadge(reg.transferSlipStatus)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">
                        สถานะการชำระเงิน
                      </p>
                      {getVerificationBadge(reg.paymentStatus)}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedMobileCard === reg.id && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {reg.totalAmount === 0 ? "" : "ยอดชำระ"}
                        </div>
                        <div className="text-xl font-bold text-emerald-600">
                          {reg.totalAmount === 0
                            ? "ได้รับโควต้า"
                            : `฿ ${reg.totalAmount.toLocaleString()} .-`}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedRegistration(reg)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                        ดูรายละเอียดเพิ่มเติม
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Detail Modal */}
        {selectedRegistration && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn mt-20">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white px-6 sm:px-8 py-6 flex items-center justify-between rounded-t-2xl border-b border-gray-100 z-10">
                <div className="flex items-center gap-3 pt-10">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    รายละเอียดการสมัคร
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="ปิด"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="px-6 sm:px-8 py-6 space-y-6">
                {/* Slip Image */}
                {selectedRegistration.transferSlipUrl && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        สลิปการโอนเงิน
                      </h3>
                      <button
                        onClick={handleDownloadSlip}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        ดาวน์โหลด
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={`${
                          import.meta.env.VITE_API_BASE_URL
                        }/app/upload/PGT/Slip/${
                          selectedRegistration.transferSlipUrl
                        }`}
                        alt="สลิปโอนเงิน"
                        className="max-w-72 h-auto max-h-300 object-contain rounded-lg border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=ไม่พบรูปภาพ";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Project Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    รายละเอียดโครงการ
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRegistration.project.title}
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-500" />
                    ข้อมูลการชำระเงิน
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-500 text-sm mb-1">
                          ยอดที่ต้องชำระ
                        </div>
                        <div className="text-2xl font-bold text-emerald-600">
                          {selectedRegistration.totalAmount === 0
                            ? "ได้รับโควต้า"
                            : `฿ ${selectedRegistration.totalAmount.toLocaleString()} .-`}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm mb-1">
                          วันที่สมัคร
                        </div>
                        <div className="text-gray-900 font-medium">
                          {formatThaiDate(selectedRegistration.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg">สถานะ</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="text-gray-500 text-sm mb-2">
                        สถานะการสมัคร
                      </div>
                      {getStatusBadge(selectedRegistration.transferSlipStatus)}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="text-gray-500 text-sm mb-2">
                        สถานะการชำระเงิน
                      </div>
                      {getVerificationBadge(selectedRegistration.paymentStatus)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1 py-24 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedRegistration(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl transition-colors duration-200"
                  >
                    ปิดหน้าต่าง
                  </button>
                  {selectedRegistration.transferSlipUrl && (
                    <button
                      onClick={handleDownloadSlip}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200"
                    >
                      <Download className="w-5 h-5" />
                      ดาวน์โหลดสลิป
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
