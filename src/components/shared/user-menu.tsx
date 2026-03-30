"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { getAuth, clearAuth } from "@/components/shared/role-guard";

export function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<{ name?: string; role: string } | null>(null);

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setUser({ name: auth.name, role: auth.role });
    }
  }, []);

  if (!user) return null;

  function handleLogout() {
    clearAuth();
    queryClient.clear();
    router.push("/login");
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right text-sm">
        <p className="font-medium leading-none">{user.name ?? "User"}</p>
        <p className="text-muted-foreground capitalize">{user.role}</p>
      </div>
      <button
        onClick={handleLogout}
        aria-label="Sign out"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
