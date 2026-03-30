"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DashboardRole } from "@/lib/types";

const ALLOWED_ROLES: DashboardRole[] = ["admin", "manager", "billing"];

export function getAuth(): { email: string; role: string; name?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === "string" && typeof parsed.role === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  sessionStorage.removeItem("auth");
}

export function useRoleGuard(): {
  authorized: boolean;
  role: DashboardRole | null;
  loading: boolean;
} {
  const [state, setState] = useState<{
    authorized: boolean;
    role: DashboardRole | null;
    loading: boolean;
  }>({ authorized: false, role: null, loading: true });

  useEffect(() => {
    const auth = getAuth();
    if (auth && ALLOWED_ROLES.includes(auth.role as DashboardRole)) {
      setState({ authorized: true, role: auth.role as DashboardRole, loading: false });
    } else {
      setState({ authorized: false, role: null, loading: false });
    }
  }, []);

  return state;
}

interface RoleGuardProps {
  children: React.ReactNode;
}

export function RoleGuard({ children }: RoleGuardProps) {
  const router = useRouter();
  const { authorized, loading } = useRoleGuard();

  useEffect(() => {
    if (!loading && !authorized) {
      router.replace("/login");
    }
  }, [loading, authorized, router]);

  if (loading || !authorized) {
    return null;
  }

  return <>{children}</>;
}
