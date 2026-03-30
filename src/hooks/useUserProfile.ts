import { useState, useEffect, useCallback, useRef } from "react";
import { fetchUserProfile } from "../utils/authService";

export const useUserProfile = () => {
  const [user, setUser] = useState<Awaited<
    ReturnType<typeof fetchUserProfile>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasRefetched = useRef(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await fetchUserProfile();

      setUser(profile);
    } catch (err) {
      setError("โหลดข้อมูลผู้ใช้ล้มเหลว");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasRefetched.current) return;
    hasRefetched.current = true;
    refetch();
  }, [refetch]);

  return { user, loading, error, refetch };
};
