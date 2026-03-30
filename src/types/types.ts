export type UserType =
  | "student"
  | "scientist"
  | "veterinarian"
  | "vet_nurse"
  | "vet_tech";
export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}
export interface RegisterRequestData {
  userType: UserType;
  email: string;
  password: string; // จะถูกเข้ารหัสก่อนส่ง
  confirmPasswordEmail: string;
  confirmPassword: string; // อาจไม่ต้องส่ง แต่เก็บไว้เพื่อความสมบูรณ์
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
}

export interface LoginRequestData {
  email: string;
  password: string;
}

export interface Get_ProjectsList_Data {
  email: string;
  codeId: string;
}

export type ActivityType = "LECTURE" | "LAB" | "WORKSHOP";

export type ActivityInput = {
  id: number;
  type: ActivityType;
  capacity: number;
  earlyPrice: number;
  regularPrice: number;
};

// Interface สำหรับข้อมูลโครงการ (Project)
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  image: string; // URL รูปสัดส่วน A4 (portrait)
  count_regi: number;
  price_regi: number; // ราคาเต็ม (บาท)
  discount: string; // มาจาก DB เป็น string เช่น "5", "5%", "0.05"
  open_regi: string; // ISO datetime
  close_regi: string; // ISO datetime
  createdAt: string;
  updatedAt: string;
  enrolled?: number;
  // activities
  activities: ActivityInput[];
  // pgtProjectRegistrations?: { projectId: number | string; packageName: string }[];
  pgtProjectRegistrations?: any[];
};

export type ProjectList = {
  id: string;
  title: string;
  open_regi: string;
};

// Interface สำหรับการลงทะเบียนโครงการ
export interface PgtProjectRegistration {
  id: number;
  projectId?: number;
  userId?: string;
  totalAmount: number;
  discountAmount?: number;
  pricingTier: string;
  packageName?: string;
  paymentStatus: string;
  transferSlipUrl: string;
  transferSlipStatus: string;
  paidAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  cancelledAt?: string | null;
  project: ProjectList; // เพิ่ม field นี้
}

// Interface หลักสำหรับผู้ใช้ (User)
export interface User {
  id?: number;
  email?: string;
  fnameTh?: string;
  fnameEn?: string;
  lnameTh?: string;
  lnameEn?: string;
  ethnicity?: string;
  county?: string;
  zipcode?: string;
  prefix?: string;
  nationality?: string;
  sex?: string;
  idCard?: string;
  address?: string;
  parish?: string;
  district?: string;
  schoolEnd?: string;
  schoolYear?: string;
  worklocaltion?: string; // อาจสะกดผิด → ควรตรวจสอบว่าควรเป็น "workLocation"
  workaddress?: string;
  phone?: string;
  lineId?: string;
  foodtype?: string;
  certName?: string;
  hdb?: string;
  pdpa?: string;
  role?: string;
  codeId: string;
  cecode?: string;
  admp?: string;
  points?: number;
  createdAt?: string;
  updatedAt?: string;
  pgtProjectRegistrations?: PgtProjectRegistration[];
}

export interface UserDataScanQrCode {
  email: string;
  codeId: string;
  data: string;
}
