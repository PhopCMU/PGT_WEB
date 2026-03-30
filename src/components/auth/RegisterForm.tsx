import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  MapPin,
  Phone,
  MessageCircle,
  GraduationCap,
  FileText,
  Building,
  Calendar,
  Eye,
  EyeOff,
  Shield,
  User,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Globe,
  Database,
  Fingerprint,
} from "lucide-react";
import { registerUser } from "../../services/registrationService";
import { isEnglishOnly, validateLicenseFormat } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import { Policy } from "../Policys";

// ====== Translations ======
const translations = {
  en: {
    register: "Register",
    userType: "User Type",
    email: "Email",
    confirmEmail: "Confirm Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    prefixTh: "Title (TH)",
    academicTitle: "Academic Title",
    firstNameTh: "First Name (TH)",
    lastNameTh: "Last Name (TH)",
    firstNameEn: "First Name (EN)",
    lastNameEn: "Last Name (EN)",
    nationality: "Nationality",
    ethnicity: "Ethnicity",
    gender: "Gender",
    address: "Billing address",
    subdistrict: "Subdistrict",
    district: "District",
    province: "Province",
    postalCode: "Postal Code",
    licenseNumber: "License Number",
    university: "University",
    graduationYear: "Graduation Year",
    workplace: "Workplace",
    workProvince: "Work Province",
    mobile: "Mobile",
    lineId: "LINE ID",
    dietaryPreference: "Dietary Preference",
    certificateName: "Name on Certificate",
    agreeTerms: "I agree to the terms and privacy policy",
    submit: "Register",
    select: "Select...",
    general: "General",
    vegetarian: "Vegetarian",
    male: "Male",
    female: "Female",
    other: "Other",
    student: "Student",
    scientist: "Scientist",
    veterinarian: "Veterinarian",
    vet_nurse: "Vet Nurse",
    vet_tech: "Vet Technician",
  },
  th: {
    register: "ลงทะเบียน",
    userType: "ประเภทผู้ใช้",
    email: "อีเมล",
    confirmEmail: "ยืนยันอีเมล",
    password: "รหัสผ่าน",
    confirmPassword: "ยืนยันรหัสผ่าน",
    prefixTh: "คำนำหน้าชื่อ",
    academicTitle: "ตำแหน่งวิชาการ",
    firstNameTh: "ชื่อ (ไทย)",
    lastNameTh: "นามสกุล (ไทย)",
    firstNameEn: "ชื่อ (อังกฤษ)",
    lastNameEn: "นามสกุล (อังกฤษ)",
    nationality: "สัญชาติ",
    ethnicity: "เชื้อชาติ",
    gender: "เพศ",
    address: "ที่อยู่ออกใบเสร็จ",
    subdistrict: "ตำบล",
    district: "อำเภอ",
    province: "จังหวัด",
    postalCode: "รหัสไปรษณีย์",
    licenseNumber: "เลขที่ใบอนุญาต",
    university: "มหาวิทยาลัยที่จบ",
    graduationYear: "ปีที่จบการศึกษา",
    workplace: "สถานที่ทำงาน",
    workProvince: "จังหวัดที่ทำงาน",
    mobile: "เบอร์มือถือ",
    lineId: "ไลน์ไอดี",
    dietaryPreference: "ประเภทการกิน",
    certificateName: "ชื่อที่แสดงในใบเซอร์",
    agreeTerms: "ฉันยอมรับข้อตกลงและนโยบายความเป็นส่วนตัว",
    submit: "ลงทะเบียน",
    select: "เลือก...",
    general: "ทั่วไป",
    vegetarian: "มังสวิรัติ",
    male: "ชาย",
    female: "หญิง",
    other: "อื่น ๆ",
    student: "นักศึกษา",
    scientist: "นักวิทยาศาสตร์",
    veterinarian: "สัตวแพทย์",
    vet_nurse: "พยาบาลสัตว์",
    vet_tech: "เทคนิคการสัตวแพทย์",
  },
} as const;

type Language = "en" | "th";

// ====== Types ======
type PasswordCriteria = {
  isEnOnly: boolean;
  specialChars: boolean;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
};

type RegisterFormData = {
  userType: "student" | "scientist" | "veterinarian" | "vet_nurse" | "vet_tech";
  email: string;
  confirmPasswordEmail: string;
  password: string;
  confirmPassword: string;
  prefixTh?: string;
  academicTitle?: string;
  firstNameTh?: string;
  lastNameTh?: string;
  firstNameEn: string;
  lastNameEn: string;
  nationality?: string;
  ethnicity?: string;
  gender?: string;
  address?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  licenseNumber?: string;
  university?: string;
  graduationYear?: string;
  workplace?: string;
  mobile?: string;
  lineId?: string;
  workProvince?: string;
  dietaryPreference?: string;
  agreeTerms: boolean;
};

// ====== Component ======
const RegisterForm = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];
  const { showAlert } = useAlert();
  const [showPolicy, setShowPolicy] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    userType: "veterinarian",
    email: "",
    confirmPasswordEmail: "",
    password: "",
    confirmPassword: "",
    prefixTh: "",
    academicTitle: "",
    firstNameTh: "",
    lastNameTh: "",
    firstNameEn: "",
    lastNameEn: "",
    nationality: "",
    ethnicity: "",
    gender: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
    licenseNumber: "",
    university: "",
    graduationYear: "",
    workplace: "",
    mobile: "",
    lineId: "",
    workProvince: "",
    dietaryPreference: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    isEnOnly: true,
    specialChars: false,
    uppercase: false,
    lowercase: false,
    digits: false,
  });
  const [isLicenseValid, setIsLicenseValid] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [policyVisible, setPolicyVisible] = useState(true);

  // ===== Check Policy Accepted =====
  useEffect(() => {
    const accessPolicy = localStorage.getItem("policyAccepted");
    if (accessPolicy === "true") {
      setPolicyVisible(false);
    }
  }, []);

  // ====== Validation Functions ======
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\ s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const validatePassword = (pwd: string): string | null => {
    if (!pwd) return "Required";
    if (!/^[\x20-\x7E]*$/.test(pwd)) {
      return "Password must contain only English characters and symbols";
    }
    if ((pwd.match(/[^A-Za-z0-9]/g) || []).length < 2) {
      return "Password must contain at least 2 special characters";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least 1 uppercase letter";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least 1 lowercase letter";
    }
    if ((pwd.match(/\d/g) || []).length < 2) {
      return "Password must contain at least 2 digits";
    }
    return null;
  };

  const validateForm = (
    data: RegisterFormData,
    t: any
  ): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Email
    if (!data.email.trim()) {
      errors.email = `${t.email} is required`;
    } else if (!validateEmail(data.email)) errors.email = "Invalid email";

    if (!data.confirmPasswordEmail.trim())
      errors.confirmPasswordEmail = `${t.confirmEmail} is required`;
    else if (data.email !== data.confirmPasswordEmail)
      errors.confirmPasswordEmail = "Emails do not match";

    // Password
    const pwdError = validatePassword(data.password);
    if (pwdError) errors.password = pwdError;

    if (!data.confirmPassword.trim())
      errors.confirmPassword = `${t.confirmPassword} is required`;
    else if (data.password !== data.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    // Personal Info (required)
    if (!data.firstNameTh?.trim())
      errors.firstNameTh = `${t.firstNameTh} is required`;
    if (!data.lastNameTh?.trim())
      errors.lastNameTh = `${t.lastNameTh} is required`;
    if (!data.firstNameEn.trim())
      errors.firstNameEn = `${t.firstNameEn} is required`;
    if (!data.lastNameEn.trim())
      errors.lastNameEn = `${t.lastNameEn} is required`;
    if (!data.nationality?.trim())
      errors.nationality = `${t.nationality} is required`;
    if (!data.ethnicity?.trim())
      errors.ethnicity = `${t.ethnicity} is required`;
    if (!data.gender) errors.gender = `${t.gender} is required`;
    if (!data.address?.trim()) errors.address = `${t.address} is required`;
    if (!data.subdistrict?.trim())
      errors.subdistrict = `${t.subdistrict} is required`;
    if (!data.district?.trim()) errors.district = `${t.district} is required`;
    if (!data.province?.trim()) errors.province = `${t.province} is required`;
    if (!data.postalCode?.trim())
      errors.postalCode = `${t.postalCode} is required`;
    if (!data.mobile?.trim()) errors.mobile = `${t.mobile} is required`;
    if (!data.dietaryPreference)
      errors.dietaryPreference = `${t.dietaryPreference} is required`;

    // License for veterinarian
    if (data.userType === "veterinarian") {
      if (!data.licenseNumber?.trim()) {
        errors.licenseNumber = "License number is required for veterinarians";
      } else if (!validateLicenseFormat(data.licenseNumber)) {
        errors.licenseNumber =
          "Invalid license number format. Example: 01-25666/2568";
      }
    }

    // Terms agreement
    if (!data.agreeTerms) errors.agreeTerms = t.agreeTerms;

    return errors;
  };

  const checkPasswordCriteria = (pwd: string): PasswordCriteria => {
    const isEnOnly = isEnglishOnly(pwd);
    const specialChars = (pwd.match(/[^A-Za-z0-9]/g) || []).length >= 2;
    const uppercase = /[A-Z]/.test(pwd);
    const lowercase = /[a-z]/.test(pwd);
    const digits = (pwd.match(/\d/g) || []).length >= 2;
    return { isEnOnly, specialChars, uppercase, lowercase, digits };
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    // Clear error on change
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "licenseNumber") {
      setIsLicenseValid(validateLicenseFormat(value));
    }
    if (name === "password") {
      setPasswordCriteria(checkPasswordCriteria(value));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (!value.trim() && !errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${t[name as keyof typeof t]} is required`,
      }));
      showAlert({
        type: "warning",
        title: "warning",
        message: `${t[name as keyof typeof t]} is required`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = validateForm(formData, t);

    if (formData.password !== formData.confirmPassword) {
      showAlert({
        type: "error",
        title: "Error",
        message: "Passwords do not match",
      });
      setIsLoading(false);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(formData);

      if (!response.success) {
        showAlert({
          type: "error",
          title: "Error",
          message: response.message,
        });
        setIsLoading(false);
        return;
      }

      // ✅ สำเร็จ
      setIsSuccess(true);

      // ⏱️ รอ 2 วิ แล้วไปหน้า login
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      showAlert({
        type: "error",
        title: "Error",
        message: err.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {policyVisible && (
        <Policy
          isOpen={policyVisible}
          onClose={() => {
            setPolicyVisible(false);
            localStorage.setItem("policyAccepted", "true");
          }}
        />
      )}
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-[#111829] to-[#0d1420] py-8 px-4">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header with Language Toggle */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => navigate("/sign-in")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#172131] hover:bg-[#1a2438] text-gray-300 font-medium rounded-lg transition-all duration-200 border border-gray-800/50"
            >
              <ChevronLeft className="w-4 h-4" />
              {language === "th" ? "กลับ" : "Back"}
            </button>
            <div className="inline-flex items-center bg-[#172131] rounded-lg border border-gray-800/50 p-1.5">
              <button
                type="button"
                onClick={() => setLanguage("th")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                  language === "th"
                    ? "bg-linear-to-r from-blue-600/30 to-purple-600/30 text-white"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/50"
                }`}
              >
                <Globe className="w-3 h-3" />
                TH
              </button>
              <div className="w-px h-4 bg-gray-800 mx-1"></div>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                  language === "en"
                    ? "bg-linear-to-r from-blue-600/30 to-purple-600/30 text-white"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/50"
                }`}
              >
                <Globe className="w-3 h-3" />
                EN
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-[#161f2f] rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-[#172131] to-[#1a2438] px-6 sm:px-8 py-8 border-b border-gray-800/50">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-800/30 backdrop-blur-sm">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {t.register}
                  </h1>
                  <p className="text-gray-400 text-sm font-medium mt-1">
                    {language === "th"
                      ? "กรุณากรอกข้อมูลให้ครบถ้วนเพื่อสมัครสมาชิก"
                      : "Please complete all required fields to register"}
                  </p>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Secure Form</span>
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-gray-400">256-bit SSL</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
              {/* User Type */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800/50">
                  <div className="w-1.5 h-6 bg-linear-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-300">
                    {t.userType}
                  </h2>
                </div>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-3.5 bg-gray-900/50 border border-gray-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-300 backdrop-blur-sm"
                  required
                >
                  <option value="student">{t.student}</option>
                  <option value="scientist">{t.scientist}</option>
                  <option value="veterinarian">{t.veterinarian}</option>
                  <option value="vet_nurse">{t.vet_nurse}</option>
                  <option value="vet_tech">{t.vet_tech}</option>
                </select>
                {errors.userType && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.userType}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/50">
                  <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-800/30">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-300">
                    {language === "th" ? "ข้อมูลอีเมล" : "Email Information"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {t.email} *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-300 placeholder:text-gray-500 backdrop-blur-sm"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {t.confirmEmail} *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="email"
                        name="confirmPasswordEmail"
                        value={formData.confirmPasswordEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-300 placeholder:text-gray-500 backdrop-blur-sm"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                    {errors.confirmPasswordEmail && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPasswordEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/50">
                  <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-800/30">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-300">
                    {language === "th" ? "รหัสผ่าน" : "Password"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        {t.password} *
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Lock className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full pl-12 pr-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-300 placeholder:text-gray-500 backdrop-blur-sm"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.password}
                        </p>
                      )}
                    </div>
                    {formData.password && (
                      <div className="space-y-3 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                        <p className="text-sm font-semibold text-gray-300 mb-3">
                          {language === "th"
                            ? "เกณฑ์รหัสผ่าน"
                            : "Password Criteria"}
                        </p>
                        <div className="grid grid-cols-1 gap-2.5">
                          {[
                            {
                              key: "isEnOnly",
                              label:
                                language === "th"
                                  ? "อักขระภาษาอังกฤษและสัญลักษณ์เท่านั้น"
                                  : "English characters and symbols only",
                            },
                            {
                              key: "specialChars",
                              label:
                                language === "th"
                                  ? "อักขระพิเศษอย่างน้อย 2 ตัว"
                                  : "At least 2 special characters",
                            },
                            {
                              key: "uppercase",
                              label:
                                language === "th"
                                  ? "ตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว"
                                  : "At least 1 uppercase letter",
                            },
                            {
                              key: "lowercase",
                              label:
                                language === "th"
                                  ? "ตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว"
                                  : "At least 1 lowercase letter",
                            },
                            {
                              key: "digits",
                              label:
                                language === "th"
                                  ? "ตัวเลขอย่างน้อย 2 ตัว"
                                  : "At least 2 digits",
                            },
                          ].map((criterion) => (
                            <div
                              key={criterion.key}
                              className="flex items-center gap-3"
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                                  (passwordCriteria as any)[criterion.key]
                                    ? "border-green-500/50 bg-green-900/20"
                                    : "border-gray-700 bg-gray-900/50"
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    (passwordCriteria as any)[criterion.key]
                                      ? "bg-green-500"
                                      : "bg-gray-600"
                                  }`}
                                ></div>
                              </div>
                              <span
                                className={`text-sm ${
                                  (passwordCriteria as any)[criterion.key]
                                    ? "text-green-400 font-medium"
                                    : "text-gray-500"
                                }`}
                              >
                                {criterion.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {t.confirmPassword} *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-12 pr-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-300 placeholder:text-gray-500 backdrop-blur-sm"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/50">
                  <div className="w-1.5 h-6 bg-linear-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-300">
                    {language === "th"
                      ? "ข้อมูลส่วนตัว"
                      : "Personal Information"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                      {language === "th" ? "ภาษาไทย" : "Thai Language"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500">
                          {t.prefixTh}
                        </label>
                        <input
                          type="text"
                          name="prefixTh"
                          value={formData.prefixTh}
                          onChange={handleChange}
                          className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                          placeholder={
                            language === "th" ? "คำนำหน้า" : "Prefix"
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500">
                          {t.academicTitle}
                        </label>
                        <input
                          type="text"
                          name="academicTitle"
                          value={formData.academicTitle}
                          onChange={handleChange}
                          className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                          placeholder={
                            language === "th"
                              ? "ตำแหน่งวิชาการ"
                              : "Academic Title"
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500">
                          {t.firstNameTh} *
                        </label>
                        <input
                          type="text"
                          name="firstNameTh"
                          value={formData.firstNameTh}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                          placeholder={
                            language === "th" ? "ชื่อไทย" : "Thai First Name"
                          }
                          required
                        />
                        {errors.firstNameTh && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.firstNameTh}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500">
                          {t.lastNameTh} *
                        </label>
                        <input
                          type="text"
                          name="lastNameTh"
                          value={formData.lastNameTh}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                          placeholder={
                            language === "th" ? "นามสกุลไทย" : "Thai Last Name"
                          }
                          required
                        />
                        {errors.lastNameTh && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.lastNameTh}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                      {language === "th" ? "ภาษาอังกฤษ" : "English Language"} *
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500">
                          {t.firstNameEn} *
                        </label>
                        <input
                          type="text"
                          name="firstNameEn"
                          value={formData.firstNameEn}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                          placeholder={
                            language === "th"
                              ? "ชื่ออังกฤษ"
                              : "English First Name"
                          }
                          required
                        />
                        {errors.firstNameEn && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.firstNameEn}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500">
                          {t.lastNameEn} *
                        </label>
                        <input
                          type="text"
                          name="lastNameEn"
                          value={formData.lastNameEn}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                          placeholder={
                            language === "th"
                              ? "นามสกุลอังกฤษ"
                              : "English Last Name"
                          }
                          required
                        />
                        {errors.lastNameEn && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.lastNameEn}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800/50">
                      <label className="block text-xs font-medium text-gray-500">
                        {t.certificateName} *
                      </label>
                      <div className="w-full p-3 bg-gray-900/30 border border-gray-800/50 rounded-lg text-gray-300 font-medium">
                        {`${formData.firstNameEn} ${formData.lastNameEn}`.trim() ||
                          (language === "th"
                            ? "ชื่อที่แสดงบนใบเซอร์ติฟิเคต"
                            : "Certificate name")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.nationality} *
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                      placeholder={
                        language === "th" ? "สัญชาติ" : "Nationality"
                      }
                      required
                    />
                    {errors.nationality && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.nationality}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.ethnicity} *
                    </label>
                    <input
                      type="text"
                      name="ethnicity"
                      value={formData.ethnicity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                      placeholder={
                        language === "th" ? "เชื้อชาติ" : "Ethnicity"
                      }
                      required
                    />
                    {errors.ethnicity && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.ethnicity}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.gender} *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                      required
                    >
                      <option value="" className="bg-gray-900 text-gray-300">
                        {t.select}
                      </option>
                      <option
                        value="male"
                        className="bg-gray-900 text-gray-300"
                      >
                        {t.male}
                      </option>
                      <option
                        value="female"
                        className="bg-gray-900 text-gray-300"
                      >
                        {t.female}
                      </option>
                      <option
                        value="other"
                        className="bg-gray-900 text-gray-300"
                      >
                        {t.other}
                      </option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <label className="block text-sm font-medium text-gray-400">
                    {t.address} *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300 resize-none"
                    placeholder={
                      language === "th"
                        ? "ที่อยู่ออกใบเสร็จ"
                        : "Billing address"
                    }
                    required
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="subdistrict"
                        value={formData.subdistrict}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                        placeholder={t.subdistrict}
                        required
                      />
                      {errors.subdistrict && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.subdistrict}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                        placeholder={t.district}
                        required
                      />
                      {errors.district && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.district}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                        placeholder={t.province}
                        required
                      />
                      {errors.province && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.province}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-300"
                        placeholder={t.postalCode}
                        required
                      />
                      {errors.postalCode && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {formData.userType === "veterinarian" && (
                  <div className="mt-6 pt-6 border-t border-gray-800/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-yellow-900/20 rounded-lg border border-yellow-800/30">
                        <FileText className="h-5 w-5 text-yellow-400" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-300">
                        {t.licenseNumber} *
                      </h3>
                    </div>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-3.5 bg-gray-900/50 border-2 rounded-xl transition-all duration-200 text-gray-300 backdrop-blur-sm ${
                        !isLicenseValid && formData.licenseNumber
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-gray-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                      }`}
                      placeholder={
                        language === "th"
                          ? "ตัวอย่าง: 01-22658/2568"
                          : "Example: 01-22658/2568"
                      }
                      required
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      {language === "th"
                        ? "รูปแบบ: [รหัส]-[เลขทะเบียน]/[ปี พ.ศ. 4 หลัก]"
                        : "Format: [code]-[number]/[4-digit year]"}
                    </div>
                    {errors.licenseNumber && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.licenseNumber}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Education & Work */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/50">
                  <div className="p-2 bg-purple-900/20 rounded-lg border border-purple-800/30">
                    <GraduationCap className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-300">
                    {language === "th"
                      ? "การศึกษาและการทำงาน"
                      : "Education & Work"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.university}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <GraduationCap className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        className="w-full pl-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-300 backdrop-blur-sm"
                        placeholder={
                          language === "th" ? "มหาวิทยาลัยที่จบ" : "University"
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.graduationYear}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        className="w-full pl-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-300 backdrop-blur-sm"
                        placeholder={
                          language === "th"
                            ? "ปีที่จบการศึกษา"
                            : "Graduation Year"
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.workplace}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Building className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="workplace"
                        value={formData.workplace}
                        onChange={handleChange}
                        className="w-full pl-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-300 backdrop-blur-sm"
                        placeholder={
                          language === "th" ? "สถานที่ทำงาน" : "Workplace"
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.workProvince}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="workProvince"
                        value={formData.workProvince}
                        onChange={handleChange}
                        className="w-full pl-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-300 backdrop-blur-sm"
                        placeholder={
                          language === "th"
                            ? "จังหวัดที่ทำงาน"
                            : "Work Province"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Preferences */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/50">
                  <div className="p-2 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
                    <Phone className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-300">
                    {language === "th"
                      ? "ติดต่อและความต้องการ"
                      : "Contact & Preferences"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.mobile} *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Phone className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-gray-300 backdrop-blur-sm"
                        placeholder={
                          language === "th" ? "เบอร์มือถือ" : "Mobile Number"
                        }
                        required
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-red-400 text-xs mt-2">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.lineId}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <MessageCircle className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="lineId"
                        value={formData.lineId}
                        onChange={handleChange}
                        className="w-full pl-12 p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-gray-300 backdrop-blur-sm"
                        placeholder={language === "th" ? "ไลน์ไอดี" : "LINE ID"}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      {t.dietaryPreference} *
                    </label>
                    <select
                      name="dietaryPreference"
                      value={formData.dietaryPreference}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full p-3.5 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-gray-300"
                      required
                    >
                      <option value="" className="bg-gray-900 text-gray-300">
                        {t.select}
                      </option>
                      <option
                        value="general"
                        className="bg-gray-900 text-gray-300"
                      >
                        {t.general}
                      </option>
                      <option
                        value="vegetarian"
                        className="bg-gray-900 text-gray-300"
                      >
                        {t.vegetarian}
                      </option>
                    </select>
                    {errors.dietaryPreference && (
                      <p className="text-red-400 text-xs mt-2">
                        {errors.dietaryPreference}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Agreement */}

              <div className="mb-8 p-6 bg-gray-900/30 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-5 h-5 bg-gray-900 border-2 border-gray-700 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 checked:bg-blue-600 checked:border-blue-600"
                      required
                    />
                    {formData.agreeTerms && (
                      <CheckCircle className="w-4 h-4 absolute top-0.5 left-0.5 text-white pointer-events-none" />
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">
                      {t.agreeTerms}{" "}
                      <button
                        type="button"
                        onClick={() => setShowPolicy(true)}
                        className="text-blue-400 hover:text-blue-300 font-medium underline transition-colors"
                      >
                        {language === "th"
                          ? "ข้อตกลงและนโยบายความเป็นส่วนตัว"
                          : "Terms and Privacy Policy"}
                      </button>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.agreeTerms}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              {!isSuccess ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg relative overflow-hidden group ${
                    isLoading
                      ? "bg-gray-800 cursor-not-allowed"
                      : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  }`}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute -inset-100% bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-100% transition-transform duration-700"></div>
                  </div>

                  <div className="relative flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="animate-pulse">
                          {language === "th"
                            ? "กำลังสมัคร..."
                            : "Registering..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5" />
                        <span>{t.submit}</span>
                      </>
                    )}
                  </div>
                </button>
              ) : (
                <div className="w-full py-4 flex items-center justify-center gap-3 bg-linear-to-r from-green-900/20 to-emerald-900/20 border border-emerald-800/50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">
                    {language === "th"
                      ? "ส่งอีเมล์ยืนยันสำเร็จ กำลังนำทางไปหน้าเข้าสู่ระบบ..."
                      : "Registration successful! Redirecting to login..."}
                  </span>
                </div>
              )}

              {/* Security Footer */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-800/50">
                <div className="flex items-center gap-2">
                  <Database className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-gray-500">Data Encrypted</span>
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-gray-500">Secure Auth</span>
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-gray-500">PDPA Compliant</span>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Policy isOpen={showPolicy} onClose={() => setShowPolicy(false)} />
      </div>
    </>
  );
};

export default RegisterForm;
