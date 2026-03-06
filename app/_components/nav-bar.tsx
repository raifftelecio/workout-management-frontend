import Link from "next/link";
import {
  Calendar,
  ChartNoAxesColumn,
  Home,
  Sparkles,
  UserRound,
} from "lucide-react";

export function NavBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-6 border-t border-border bg-card px-6 py-4 rounded-t-[20px]"
      aria-label="Navegação principal"
    >
      <Link
        href="/"
        className="flex items-center justify-center p-3 text-foreground hover:text-primary"
        aria-label="Início"
      >
        <Home className="size-6" />
      </Link>
      <button
        type="button"
        className="flex items-center justify-center p-3 text-foreground"
        aria-label="Calendário"
      >
        <Calendar className="size-6" />
      </button>
      <button
        type="button"
        className="flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground"
        aria-label="Treinos"
      >
        <Sparkles className="size-6" />
      </button>
      <button
        type="button"
        className="flex items-center justify-center p-3 text-foreground"
        aria-label="Estatísticas"
      >
        <ChartNoAxesColumn className="size-6" />
      </button>
      <button
        type="button"
        className="flex items-center justify-center p-3 text-foreground"
        aria-label="Perfil"
      >
        <UserRound className="size-6" />
      </button>
    </nav>
  );
}
