"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

export function ProfileLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="gap-2 rounded-full px-4 py-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={handleLogout}
    >
      <span className="text-base font-semibold leading-none">Sair da conta</span>
      <LogOut className="size-4 shrink-0" />
    </Button>
  );
}
