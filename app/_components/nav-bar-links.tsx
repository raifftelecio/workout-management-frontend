"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryState, parseAsBoolean } from "nuqs";
import {
  Calendar,
  ChartNoAxesColumn,
  Home,
  Sparkles,
  UserRound,
} from "lucide-react";

export interface NavBarLinksProps {
  todayWorkoutLink: string | null;
}

export function NavBarLinks({ todayWorkoutLink }: NavBarLinksProps) {
  const pathname = usePathname();
  const [, setChatOpen] = useQueryState("chat_open", parseAsBoolean);
  const [, setChatInitialMessage] = useQueryState("chat_initial_message");
  const isOnWorkoutDayPage = pathname.includes("/workout-plans/") && pathname.includes("/days/");
  const calendarHref = todayWorkoutLink ?? "/";
  const calendarActive = isOnWorkoutDayPage;
  const statsActive = pathname === "/evolucao";
  const profileActive = pathname === "/profile";

  const openChat = () => {
    setChatOpen(true);
    setChatInitialMessage(null);
  };

  return (
    <>
      <Link
        href="/"
        className="flex items-center justify-center p-3 text-foreground hover:text-primary"
        aria-label="Início"
      >
        <Home className="size-6" />
      </Link>
      <Link
        href={calendarHref}
        className={`flex items-center justify-center p-3 ${calendarActive ? "text-primary" : "text-foreground hover:text-primary"}`}
        aria-label="Calendário"
      >
        <Calendar className="size-6" />
      </Link>
      <button
        type="button"
        className="flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground"
        aria-label="Abrir Coach AI"
        onClick={openChat}
      >
        <Sparkles className="size-6" />
      </button>
      <Link
        href="/evolucao"
        className={`flex items-center justify-center p-3 ${statsActive ? "text-primary" : "text-foreground hover:text-primary"}`}
        aria-label="Estatísticas"
      >
        <ChartNoAxesColumn className="size-6" />
      </Link>
      <Link
        href="/profile"
        className={`flex items-center justify-center p-3 ${profileActive ? "text-primary" : "text-foreground hover:text-primary"}`}
        aria-label="Perfil"
      >
        <UserRound className="size-6" />
      </Link>
    </>
  );
}
