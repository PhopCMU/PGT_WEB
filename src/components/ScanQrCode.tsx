import { useState, useRef, useEffect } from "react";
import { X, Zap, ZapOff, HelpCircle, ArrowBigLeftDash } from "lucide-react";
import jsQR from "jsqr";
import type { UserDataScanQrCode } from "../types/types";
import { getUserFromToken } from "../utils/authService";
import { useNavigate } from "react-router-dom";
import { Post_checkin } from "../services/PostServer";

interface ScanResult {
  data: string;
  timestamp: Date;
}

interface QRLocation {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ขนาดกรอบสแกนบน DOM (ตามหน้ากากที่คุณใช้)
const MASK_SIZE_PX = 280;

// ความกว้างแคนวาสสำหรับประมวลผล (ยืดหยุ่นได้)
const PROCESSING_WIDTH = 960;

/**
 * คำนวณขนาด canvas สำหรับประมวลผลตามอัตราส่วนวิดีโอ
 */
const getProcessingCanvasDimensions = (
  video: HTMLVideoElement,
  targetWidth: number,
) => {
  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 720;
  const aspect = vh / vw;
  const cw = targetWidth;
  const ch = Math.round(targetWidth * aspect);
  return { cw, ch, vw, vh };
};

/**
 * คำนวณ ROI ให้ตรงกับหน้ากาก 280×280 บน DOM โดยแมปพิกัดจาก DOM → video pixel → canvas pixel
 * รองรับกรณี <video> มี object-cover ทำให้ถูก crop ในแนวใดแนวหนึ่ง
 */
const computeROICanvasRect = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  maskSizePx = MASK_SIZE_PX,
): { x: number; y: number; width: number; height: number } => {
  const videoRect = video.getBoundingClientRect();
  const ew = videoRect.width;
  const eh = videoRect.height;

  // พิกัดกรอบหน้ากาก (DOM) – อยู่ตรงกลาง element
  const cx = ew / 2;
  const cy = eh / 2;
  const m = maskSizePx;
  const elemX = cx - m / 2; // top-left x ในพิกัด element
  const elemY = cy - m / 2; // top-left y ในพิกัด element

  // ขนาดวิดีโอต้นฉบับ (pixel)
  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 720;

  // object-cover: ใช้ scale สูงสุดด้านใดด้านหนึ่งเพื่อให้ครอบเต็ม element
  const s = Math.max(ew / vw, eh / vh);

  // ขนาดวิดีโอที่ถูก scale แล้วใน CSS pixel
  const cssVW = vw * s;
  const cssVH = vh * s;

  // offset การครอบ (crop) ภายใน element
  const cropX = Math.max((cssVW - ew) / 2, 0); // ถ้ากว้างเกิน element จะถูกครอบสองข้าง
  const cropY = Math.max((cssVH - eh) / 2, 0); // ถ้าสูงเกิน element จะถูกครอบบน/ล่าง

  // พิกัด mask ใน video pixel space
  const videoX = (elemX + cropX) / s;
  const videoY = (elemY + cropY) / s;
  const videoW = m / s;
  const videoH = m / s;

  // แมปไปยัง canvas pixel space (เรา drawImage(video, 0, 0, cw, ch))
  const cw = canvas.width;
  const ch = canvas.height;
  const canvasX = (videoX / vw) * cw;
  const canvasY = (videoY / vh) * ch;
  const canvasW = (videoW / vw) * cw;
  const canvasH = (videoH / vh) * ch;

  // ปรับให้ ROI อยู่ในขอบเขต canvas
  const x = Math.max(0, Math.min(canvasX, cw - 1));
  const y = Math.max(0, Math.min(canvasY, ch - 1));
  const width = Math.max(
    1,
    Math.min(canvasW, cw - x), // ไม่ให้ล้น
  );
  const height = Math.max(1, Math.min(canvasH, ch - y));

  return { x, y, width, height };
};

/**
 * แปลงพิกัดมุมจาก canvas pixel space → DOM video element pixel space
 * เพื่อวาดกรอบเขียวที่ตำแหน่งถูกต้องบนหน้าจอ
 */
const mapCanvasRectToDOM = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  rectCanvas: { x: number; y: number; width: number; height: number },
): QRLocation => {
  const videoRect = video.getBoundingClientRect();
  const ew = videoRect.width; // กว้าง element บนจอ
  const eh = videoRect.height; // สูง element บนจอ

  // ขนาดวิดีโอต้นฉบับ
  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 720;

  // --- ขั้นตอนที่ 1: แปลงพิกัด Canvas -> พิกัดวิดีโอต้นฉบับ ---
  const videoX = (rectCanvas.x / canvas.width) * vw;
  const videoY = (rectCanvas.y / canvas.height) * vh;
  const videoW = (rectCanvas.width / canvas.width) * vw;
  const videoH = (rectCanvas.height / canvas.height) * vh;

  // --- ขั้นตอนที่ 2: คำนวณ object-fit: cover ---
  // Scale factor: ค่าที่วิดีโอขยายใหญ่ขึ้นเพื่อเต็มจอ
  const s = Math.max(ew / vw, eh / vh);

  // ขนาดวิดีโอเมื่อถูก scale แล้ว (หน่วยเป็น pixel บนจอ)
  const cssVW = vw * s;
  const cssVH = vh * s;

  // ระยะห่าง (Crop): ส่วนของวิดีโอที่ถูกซ่อนอยู่ข้างนอก (เช่น ถ้าภาพกว้างเกินหน้าจอ)
  const cropX = (cssVW - ew) / 2;
  const cropY = (cssVH - eh) / 2;

  // --- ขั้นตอนที่ 3: แปลงพิกัดวิดีโอต้นฉบับ -> พิกัด DOM ---
  // ตำแหน่งบน DOM = (ตำแหน่งบนวิดีโอ * scale) - (ระยะที่ถูกครอปไป)
  const domX = videoX * s - cropX;
  const domY = videoY * s - cropY;
  const domW = videoW * s;
  const domH = videoH * s;

  return {
    x: domX,
    y: domY,
    width: domW,
    height: domH,
  };
};

export default function QRScannerApp() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [qrLocation, setQrLocation] = useState<QRLocation | null>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef<boolean>(false);

  const user = getUserFromToken();
  const navigate = useNavigate();

  if (!user) return null;

  const handleBackToHome = () => {
    navigate("/dashboard", { replace: true });
  };

  useEffect(() => {
    startScanner();
    return () => stopScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanner = async () => {
    setIsLoading(true);
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          setIsLoading(false);
          scanningRef.current = true;
          // เริ่ม loop
          scheduleNext();
        };
      }
    } catch (err) {
      setError("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง");
      setIsLoading(false);
    }
  };

  const stopScanner = () => {
    scanningRef.current = false;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchEnabled(false);
  };

  const scheduleNext = () => {
    const video = videoRef.current;
    if (!video || !scanningRef.current) return;

    // ใช้ requestVideoFrameCallback ถ้ามี (แม่นยำกว่า rAF)
    if ("requestVideoFrameCallback" in video) {
      (video as any).requestVideoFrameCallback(() => scanLoop());
    } else {
      requestAnimationFrame(() => scanLoop());
    }
  };

  const scanLoop = () => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current!;
    const canvas = canvasRef.current!;

    // Context 2D พร้อม willReadFrequently เพื่อความเร็วในการ readback
    const ctx =
      canvas.getContext("2d", { willReadFrequently: true } as any) ||
      canvas.getContext("2d");

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      scheduleNext();
      return;
    }

    // คำนวณขนาด canvas ประมวลผล (downscale)
    const { cw, ch } = getProcessingCanvasDimensions(video, PROCESSING_WIDTH);
    canvas.width = cw;
    canvas.height = ch;

    // วาดเฟรมของวิดีโอลง canvas
    (ctx as any).drawImage(video, 0, 0, cw, ch);

    // สแกนเฉพาะ ROI ให้ตรงกับหน้ากากกลางบน DOM
    const roiCanvas = computeROICanvasRect(video, canvas, MASK_SIZE_PX);
    let imageData: ImageData;

    try {
      imageData = (ctx as any).getImageData(
        Math.round(roiCanvas.x),
        Math.round(roiCanvas.y),
        Math.round(roiCanvas.width),
        Math.round(roiCanvas.height),
      );
    } catch (e) {
      // บางกรณี cross-origin หรือ security อาจทำให้ getImageData ล้มเหลว
      console.error("getImageData error:", e);
      scheduleNext();
      return;
    }

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    });

    if (code?.data) {
      // คำนวณกรอบแดงจาก code.location (พิกัดภายใน imageData/ROI)
      if (code.location) {
        const pts = [
          code.location.topLeftCorner,
          code.location.topRightCorner,
          code.location.bottomRightCorner,
          code.location.bottomLeftCorner,
        ];

        // แปลงพิกัดจาก ROI → canvas
        const xs = pts.map((p) => p.x + roiCanvas.x);
        const ys = pts.map((p) => p.y + roiCanvas.y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const rectCanvas = {
          x: minX,
          y: minY,
          width: Math.max(1, maxX - minX),
          height: Math.max(1, maxY - minY),
        };

        // แมปไป DOM เพื่อวาดกรอบ
        const rectDOM = mapCanvasRectToDOM(video, canvas, rectCanvas);
        setQrLocation(rectDOM);
      } else {
        setQrLocation(null);
      }

      handleScanSuccess(code.data);
      return;
    }

    // ไม่พบโค้ดในเฟรมนี้ → ลูปต่อ
    setQrLocation(null);
    scheduleNext();
  };

  const handleScanSuccess = async (data: string) => {
    scanningRef.current = false;
    /**
     * 1. รับค่า data จาก QR Code
     * 2. นำค่าที่อยู่ใน userInfo มาด้วย
     */
    // เพื่ออ่านค่าใน QR Code ตัว QR Code จะถูกเข้ารหัส ด้วย CryptoJS และเปลี่ยนเป็น base64 AES-128-ECB

    // เราจะ แนบ รหัสไป 2 ชุด คือ data บที่เก็ user เอา email กับ codeId และ timestamp ที่เก็บ ใน setScanResult

    const userData = {
      email: user.email,
      codeId: user.codeId,
      data: data,
    };

    const response = await Post_checkin(userData as UserDataScanQrCode);
    if (!response) {
      return null;
    }

    setScanResult({
      data: response.message,
      timestamp: new Date(),
    });
    setTimeout(() => {
      continueScan();
    }, 5000);
    // console.log("QR Code scanned:", data);
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;

    const track = streamRef.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;

    if (!capabilities?.torch) {
      setError("อุปกรณ์นี้ไม่รองรับไฟฉาย");
      return;
    }

    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchEnabled } as any],
      });
      setTorchEnabled(!torchEnabled);
    } catch (err) {
      setError("ไม่สามารถเปิด/ปิดไฟฉายได้");
    }
  };

  // const closeScanner = () => {
  //   setScanResult(null);
  //   setQrLocation(null);
  // };

  const continueScan = () => {
    setScanResult(null);
    setQrLocation(null);
    scanningRef.current = true;
    scheduleNext();
  };

  const InstructionsModal = () => (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">วิธีใช้งาน</h3>
            <button
              onClick={() => setShowInstructions(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">จับกล้องให้มั่น</h4>
                <p className="text-gray-600 text-sm">
                  ถือเครื่องให้นิ่งหรือวางบนพื้นผิวที่มั่นคงเพื่อให้ได้ภาพที่ชัดเจน
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  วาง QR Code ในกรอบ
                </h4>
                <p className="text-gray-600 text-sm">
                  นำ QR Code เข้าไปในกรอบสี่เหลี่ยมตรงกลางให้พอดี
                  ระบบจะตรวจจับอัตโนมัติ
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">ปรับแสงสว่าง</h4>
                <p className="text-gray-600 text-sm">
                  หากแสงสว่างไม่เพียงพอ
                  ให้กดปุ่มไฟฉายด้านล่างเพื่อเพิ่มความสว่าง
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">รอผลลัพธ์</h4>
                <p className="text-gray-600 text-sm">
                  เมื่อสแกนสำเร็จจะปรากฏหน้าต่างผลลัพธ์พร้อมข้อมูลจาก QR Code
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-700">
              <strong>เคล็ดลับ:</strong> สำหรับ iPad
              ให้วางอุปกรณ์ในแนวนอนเพื่อความมั่นคงและพื้นที่สแกนที่กว้างขึ้น
            </p>
          </div>

          <button
            onClick={() => setShowInstructions(false)}
            className="w-full mt-6 bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white py-3 rounded-xl font-semibold"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Main Scanner - Full Screen */}
      <div className="fixed inset-0 flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-4 px-4">
          <div className="flex items-center justify-between bg-black/70 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-bold text-white">QR Scanner</h1>
                <p className="text-xs text-blue-200">
                  กด "?" สําหรับความช่วยเหลือ
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInstructions(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Camera View - Full Screen */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-lg font-medium">
                  กำลังเปิดกล้อง...
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  กรุณาอนุญาตการเข้าถึงกล้อง
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
              <div className="text-center px-6">
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-500">
                  <X className="w-12 h-12 text-red-400" />
                </div>
                <p className="text-white text-xl font-bold mb-3">
                  เกิดข้อผิดพลาด
                </p>
                <p className="text-red-300 text-base mb-6">{error}</p>
                <button
                  onClick={startScanner}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  ลองอีกครั้ง
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Green box when QR detected */}
          {qrLocation && !scanResult && (
            <div
              className="absolute border-4 border-green-500 rounded-xl transition-all duration-300 pointer-events-none z-10"
              style={{
                left: `${qrLocation.x}px`,
                top: `${qrLocation.y}px`,
                width: `${qrLocation.width}px`,
                height: `${qrLocation.height}px`,
                boxShadow: "0 0 40px rgba(34, 197, 94, 0.6)",
              }}
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap shadow-lg">
                พบ QR Code!
              </div>
            </div>
          )}

          {/* Scan Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark overlay with cutout */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <mask id="scanMask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x="50%"
                    y="50%"
                    width={MASK_SIZE_PX}
                    height={MASK_SIZE_PX}
                    rx="20"
                    transform={`translate(-${MASK_SIZE_PX / 2}, -${
                      MASK_SIZE_PX / 2
                    })`}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.5)"
                mask="url(#scanMask)"
              />
            </svg>

            {/* Center scan frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scan Frame */}
                <div className="w-72 h-72 border-3 border-white/80 rounded-3xl relative">
                  {/* Corners with glow */}
                  <div className="absolute -top-2 -left-2 w-10 h-10 border-t-4 border-l-4 border-blue-400 rounded-tl-3xl shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 border-t-4 border-r-4 border-blue-400 rounded-tr-3xl shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                  <div className="absolute -bottom-2 -left-2 w-10 h-10 border-b-4 border-l-4 border-blue-400 rounded-bl-3xl shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-4 border-r-4 border-blue-400 rounded-br-3xl shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>

                  {/* Scan Line */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div
                      className="absolute w-full h-1 bg-linear-to-r from-transparent via-blue-400 to-transparent"
                      style={{
                        animation: "scan 2s linear infinite",
                        willChange: "transform",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-6 px-6">
          <div className="flex items-center justify-between">
            {/* Torch Button */}
            <button
              onClick={handleBackToHome}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all bg-white/10 backdrop-blur-md border border-white/20`}
            >
              <ArrowBigLeftDash className="w-8 h-8 text-white" />
            </button>

            <p className="text-white text-sm font-medium">
              {scanResult
                ? "✅ สแกนสำเร็จ!"
                : qrLocation
                  ? "🎯 กำลังอ่านข้อมูล..."
                  : "🔍 กำลังค้นหา QR Code..."}
            </p>

            <button
              onClick={toggleTorch}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                torchEnabled
                  ? "bg-linear-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50"
                  : "bg-white/10 backdrop-blur-md border border-white/20"
              }`}
            >
              {torchEnabled ? (
                <Zap className="w-8 h-8 text-white" />
              ) : (
                <ZapOff className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scan Result Modal */}
      {scanResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-[#0f1625]/80 backdrop-blur-sm"
            onClick={continueScan}
          />

          {/* Modal container */}
          <div className="relative w-full max-w-md animate-scaleIn">
            {/* Outer linear border */}
            <div className="rounded-2xl bg-linear-to-br from-gray-800/30 via-[#101727] to-[#111829] p-1">
              {/* Main content */}
              <div className="rounded-2xl bg-linear-to-b from-[#0f1625] to-[#101727] p-6">
                {/* Success icon */}
                <div className="mb-5 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-500/20 to-teal-500/10">
                    <svg
                      className="h-8 w-8 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Success message */}
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    สแกนสำเร็จ!
                  </h3>
                  <p className="text-gray-300">
                    ข้อมูลจาก QR Code ถูกอ่านเรียบร้อยแล้ว
                  </p>
                </div>

                {/* Scanned data section */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-1 w-4 rounded-full bg-linear-to-r from-cyan-500 to-blue-500" />
                    <span className="text-sm font-medium text-gray-300">
                      ข้อมูลที่สแกน:
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#111829] p-4">
                    <div className="max-h-32 overflow-y-auto">
                      <p className="font-mono text-sm text-gray-200 ">
                        {scanResult.data}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="mb-6 rounded-lg bg-[#0f1625]/50 p-3">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs text-gray-300">
                      เวลาสแกน:{" "}
                      {scanResult.timestamp.toLocaleString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <button
                    onClick={continueScan}
                    className="relative w-full overflow-hidden rounded-xl bg-linear-to-r from-cyan-600/90 to-blue-600/90 py-3.5 font-semibold text-white transition-all hover:from-cyan-600 hover:to-blue-600 active:scale-[0.98]"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/20 to-transparent" />
                    ดำเนินการต่อ
                  </button>

                  {/* Optional close button if needed */}
                  {/* <button
              onClick={closeScanner}
              className="w-full rounded-xl border border-gray-700 bg-[#111829] py-3.5 font-medium text-gray-300 transition-all hover:bg-[#0f1625] active:scale-[0.98]"
            >
              ปิด
            </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && <InstructionsModal />}
    </div>
  );
}
