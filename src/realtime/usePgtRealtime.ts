import { useEffect, useState } from "react";
import { getPgtSocket } from "./pgtSocket";

export type CheckinUpdatedPayload = {
  projectId: number;
  projectName?: string;
  userId: string;
  titleId: number;
  dayIdTH: string;
  dateCheckin: string; // ISO
  user?: {
    codeId: string;
    fnameTh?: string;
    lnameTh?: string;
  };
};

export type RegistrationCreatedPayload = {
  projectId: number;
  userId: string;
  activityType: string;
  pricingTier: string;
  price: number;
};

export type ProjectUpdatedPayload = {
  projectId: number;
  countRegi?: number;
};

type UsePgtRealtimeOptions = {
  token?: string; // JWT ถ้ามี
  projectId?: number; // ถ้าต้องการ join room ตาม project
  onCheckinUpdated?: (payload: CheckinUpdatedPayload) => void;
  onRegistrationCreated?: (payload: RegistrationCreatedPayload) => void;
  onProjectUpdated?: (payload: ProjectUpdatedPayload) => void;
};

export function usePgtRealtime(opts: UsePgtRealtimeOptions) {
  const [status, setStatus] = useState("disconnected");

  useEffect(() => {
    const socket = getPgtSocket();

    // แนะนำส่ง token/projectId ผ่าน auth (ฝั่ง server ต้องอ่าน client.handshake.auth)
    socket.auth = {
      token: opts.token ?? "",
      projectId: opts.projectId,
    };

    const onConnect = () => setStatus(`connected: ${socket.id}`);
    const onDisconnect = (reason: string) =>
      setStatus(`disconnected:${reason}`);
    const onConnectError = (err: any) =>
      setStatus(`connect_error:${err?.message ?? err}`);

    const onCheckinUpdated = (payload: CheckinUpdatedPayload) => {
      opts.onCheckinUpdated?.(payload);
    };

    const onRegistrationCreated = (payload: RegistrationCreatedPayload) => {
      opts.onRegistrationCreated?.(payload);
    };

    const onProjectUpdated = (payload: ProjectUpdatedPayload) => {
      opts.onProjectUpdated?.(payload);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    socket.on("checkin.updated", onCheckinUpdated);
    socket.on("registration.created", onRegistrationCreated);
    socket.on("project.updated", onProjectUpdated);

    // connect เมื่อเข้า page
    if (!socket.connected) socket.connect();

    // cleanup กัน listener ซ้ำ
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("checkin.updated", onCheckinUpdated);
      socket.off("registration.created", onRegistrationCreated);
      socket.off("project.updated", onProjectUpdated);

      // ถ้าต้องการให้ dashboard ออกแล้วตัด socket ทิ้ง:
      //   socket.disconnect();
      //
      // แต่โดยทั่วไป แนะนำไม่ disconnect ถ้าทั้งแอปต้องใช้ realtime ต่อ
    };
  }, [opts.token, opts.projectId]);

  return { status };
}
