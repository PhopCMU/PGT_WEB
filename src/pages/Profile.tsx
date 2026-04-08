import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Edit,
  X,
  Check,
  Calendar,
  Briefcase,
  GraduationCap,
  Home,
} from "lucide-react";
import { getUserFromToken } from "../utils/authService";
import { Get_ProfiletUser } from "../services/GetService";
import { Edit_ProjectUser } from "../services/PutService";
import { useAlert } from "../contexts/AlertContext";
import { formatThaiDate } from "../utils/helpers";

interface UserProfile {
  id: number;
  email: string;
  fnameTh: string;
  fnameEn: string;
  lnameTh: string;
  lnameEn: string;
  ethnicity: string;
  county: string;
  zipcode: string;
  prefix: string;
  nationality: string;
  sex: string;
  idCard: string;
  address: string;
  parish: string;
  district: string;
  schoolEnd: string;
  schoolYear: string;
  worklocaltion: string;
  workaddress: string;
  phone: string;
  lineId: string;
  foodtype: string;
  role: string;
  codeId: string;
  admp?: string;
  cecode: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const user = getUserFromToken();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    email: "",
    fnameTh: "",
    fnameEn: "",
    lnameTh: "",
    lnameEn: "",
    ethnicity: "",
    county: "",
    zipcode: "",
    prefix: "",
    nationality: "",
    sex: "",
    idCard: "",
    address: "",
    parish: "",
    district: "",
    schoolEnd: "",
    schoolYear: "",
    worklocaltion: "",
    workaddress: "",
    phone: "",
    lineId: "",
    foodtype: "",
    role: "",
    codeId: "",
    cecode: "",
    admp: "",
    createdAt: "",
    updatedAt: "",
  });
  const hasProfileData = useRef<boolean>(false);
  const { showAlert } = useAlert();
  const [editForm, setEditForm] = useState({ ...profile });

  useEffect(() => {
    if (hasProfileData.current) return;
    hasProfileData.current = true;
    fetchDataUser();
  }, []);

  useEffect(() => {
    setEditForm({ ...profile });
  }, [profile]);

  const fetchDataUser = async () => {
    setIsLoading(true);
    try {
      const email = user?.email || "";
      const codeId = user?.codeId || "";
      const response = await Get_ProfiletUser(email, codeId);

      if (!response?.success) {
        console.error("Fetch projects failed:", response?.message);
        return;
      }

      setProfile(response.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const payload = {
      ...profile, // เริ่มจากข้อมูลเดิม
      ...editForm, // ทับเฉพาะ field ที่แก้ไข
    };

    try {
      setIsLoading(true);
      const response = await Edit_ProjectUser(payload);
      if (!response.success) {
        showAlert({
          type: "error",
          message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          title: "Error",
        });
        return;
      }

      // รีเฟรชข้อมูลใหม่จากเซิร์ฟเวอร์
      await fetchDataUser();
      setIsEditing(false);
      showAlert({
        type: "success",
        message: "บันทึกข้อมูลเรียบร้อย",
        title: "Success",
      });
    } catch (err) {
      showAlert({
        type: "error",
        message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        title: "Network Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const inputClass = (editable: boolean) =>
    `w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base transition-all duration-200 ${
      editable
        ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
        : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
    }`;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-3 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-6 border border-gray-100">
          <div className="relative px-4 sm:px-6 lg:px-8 py-5 sm:py-8 bg-linear-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <User className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-gray-900 flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 break">
                  {profile.prefix} {profile.fnameTh} {profile.lnameTh}
                </h1>
                <p className="text-gray-500 text-sm sm:text-base break">
                  {profile.fnameEn} {profile.lnameEn}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-none bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base shadow-md"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>แก้ไข</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md"
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">บันทึก</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 sm:flex-none bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">ยกเลิก</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 sm:p-6 bg-white">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">
                รหัสผู้ใช้
              </div>
              <div className="font-bold text-blue-700 text-sm sm:text-base">
                {profile.codeId}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 hover:border-purple-200 transition-colors">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">
                ตำแหน่ง
              </div>
              <div className="font-bold text-purple-700 text-sm sm:text-base">
                {profile.role}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              ข้อมูลส่วนตัว
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  ชื่อ (ไทย)
                </label>
                <input
                  type="text"
                  name="fnameTh"
                  value={
                    isEditing ? editForm.fnameTh || "" : profile.fnameTh || ""
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  นามสกุล (ไทย)
                </label>
                <input
                  type="text"
                  name="lnameTh"
                  value={
                    isEditing ? editForm.lnameTh || "" : profile.lnameTh || ""
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  ชื่อ (อังกฤษ)
                </label>
                <input
                  type="text"
                  name="fnameEn"
                  value={
                    isEditing ? editForm.fnameEn || "" : profile.fnameEn || ""
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  นามสกุล (อังกฤษ)
                </label>
                <input
                  type="text"
                  name="lnameEn"
                  value={
                    isEditing ? editForm.lnameEn || "" : profile.lnameEn || ""
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Reference No.1
                </label>
                <input
                  type="text"
                  value={profile.idCard}
                  disabled
                  className={inputClass(false)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  ประเภทอาหาร
                </label>
                <input
                  type="text"
                  value={profile.foodtype}
                  disabled
                  className={inputClass(false)}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              ข้อมูลที่สามารถแก้ไขได้
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  ตำแหน่ง
                </label>
                <input
                  type="text"
                  name="admp"
                  value={isEditing ? editForm.admp || "" : profile.admp || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  คำนำหน้า
                </label>
                <select
                  name="prefix"
                  value={isEditing ? editForm.prefix : profile.prefix}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                >
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  เพศ
                </label>
                <select
                  name="sex"
                  value={isEditing ? editForm.sex : profile.sex}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                >
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  เชื้อชาติ
                </label>
                <input
                  type="text"
                  name="ethnicity"
                  value={isEditing ? editForm.ethnicity : profile.ethnicity}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  สัญชาติ
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={isEditing ? editForm.nationality : profile.nationality}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              {profile.role === "Vet" && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    รหัส CE
                  </label>
                  <input
                    type="text"
                    name="cecode"
                    value={isEditing ? editForm.cecode : profile.cecode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="ระบุรหัส CE"
                    className={inputClass(isEditing)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Line ID
                </label>
                <input
                  type="text"
                  name="lineId"
                  value={isEditing ? editForm.lineId : profile.lineId}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="ระบุ Line ID"
                  className={inputClass(isEditing)}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              ที่อยู่
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  บ้านเลขที่
                </label>
                <input
                  type="text"
                  name="address"
                  value={isEditing ? editForm.address : profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  ตำบล/แขวง
                </label>
                <input
                  type="text"
                  name="parish"
                  value={isEditing ? editForm.parish : profile.parish}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  อำเภอ/เขต
                </label>
                <input
                  type="text"
                  name="district"
                  value={isEditing ? editForm.district : profile.district}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  จังหวัด
                </label>
                <input
                  type="text"
                  name="county"
                  value={isEditing ? editForm.county : profile.county}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  รหัสไปรษณีย์
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={isEditing ? editForm.zipcode : profile.zipcode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                ข้อมูลการศึกษา
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    สถานศึกษาที่จบ
                  </label>
                  <input
                    type="text"
                    name="schoolEnd"
                    value={isEditing ? editForm.schoolEnd : profile.schoolEnd}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="ระบุสถานศึกษา"
                    className={inputClass(isEditing)}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    ปีที่จบการศึกษา
                  </label>
                  <input
                    type="text"
                    name="schoolYear"
                    value={isEditing ? editForm.schoolYear : profile.schoolYear}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="ระบุปี พ.ศ."
                    className={inputClass(isEditing)}
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                ข้อมูลการทำงาน
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    สถานที่ทำงาน
                  </label>
                  <input
                    type="text"
                    name="worklocaltion"
                    value={
                      isEditing ? editForm.worklocaltion : profile.worklocaltion
                    }
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="ระบุสถานที่ทำงาน"
                    className={inputClass(isEditing)}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    ที่อยู่สถานที่ทำงาน
                  </label>
                  <input
                    type="text"
                    name="workaddress"
                    value={
                      isEditing ? editForm.workaddress : profile.workaddress
                    }
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="ระบุที่อยู่"
                    className={inputClass(isEditing)}
                  />
                </div>
              </div>
            </section>
          </div>

          <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
              ข้อมูลติดต่อ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  อีเมล
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className={inputClass(false)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  เบอร์โทรศัพท์
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    disabled
                    className={inputClass(false)}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>สร้างบัญชี: {formatThaiDate(profile.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>อัปเดตล่าสุด: {formatThaiDate(profile.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
