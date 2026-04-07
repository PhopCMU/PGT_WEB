import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getPgtSocket() {
  if (!socket) {
    const origin = import.meta.env.VITE_API_BASE_URL;
    const namespace = import.meta.env.VITE_SOCKET_NAMESPACE || "/pgt";
    const path = import.meta.env.VITE_SOCKET_PATH || "/socket.io";

    socket = io(`${origin}${namespace}`, {
      path, // "/ws/pgt/socket.io" (ต้องตรงกับ nginx + server)
      transports: ["websocket", "polling"],
      autoConnect: false, // สำคัญ: คุม connect เอง
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      timeout: 10000,
    });
  }
  return socket;
}
