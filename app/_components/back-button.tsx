"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-6 shrink-0 p-0"
      onClick={() => router.back()}
      aria-label="Voltar"
    >
      <ChevronLeft className="size-6" />
    </Button>
  );
}
