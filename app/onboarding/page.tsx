import { redirect } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { ArrowUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ONBOARDING_INITIAL_MESSAGE = "Quero começar a melhorar minha saúde!";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ chat_open?: string; chat_initial_message?: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const params = await searchParams;
  if (
    params.chat_open !== "true" ||
    params.chat_initial_message !== ONBOARDING_INITIAL_MESSAGE
  ) {
    redirect(
      `/onboarding?chat_open=true&chat_initial_message=${encodeURIComponent(ONBOARDING_INITIAL_MESSAGE)}`
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex shrink-0 items-center justify-center rounded-full border border-primary/10 bg-primary/10 p-3">
            <Sparkles className="size-[18px] text-primary" />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="text-base font-semibold leading-[1.05] text-foreground truncate">
              Coach AI
            </p>
            <div className="flex items-center gap-1">
              <div className="size-2 shrink-0 rounded-full bg-primary" />
              <p className="text-xs leading-[1.15] text-primary">Online</p>
            </div>
          </div>
        </div>
        <Button asChild variant="default" size="sm" className="shrink-0">
          <Link href="/">Acessar FIT.AI</Link>
        </Button>
      </header>

      <main className="flex flex-1 flex-col gap-3 px-5 pt-5 pr-[60px]">
        <div className="rounded-xl bg-secondary px-3 py-3 w-fit">
          <p className="text-sm leading-normal text-foreground">
            Bem-vindo ao FIT.AI! 🎉
          </p>
        </div>
        <div className="rounded-xl bg-secondary px-3 py-3 w-full">
          <p className="text-sm leading-normal text-foreground">
            O app que vai transformar a forma como você treina. Aqui você monta
            seu plano de treino personalizado, acompanha sua evolução com
            estatísticas detalhadas e conta com uma IA disponível 24h para te
            guiar em cada exercício.
          </p>
        </div>
        <div className="rounded-xl bg-secondary px-3 py-3 w-fit max-w-[266px]">
          <p className="text-sm leading-normal text-foreground">
            Tudo pensado para você alcançar seus objetivos de forma inteligente
            e consistente.
          </p>
        </div>
        <div className="rounded-xl bg-secondary px-3 py-3 w-fit">
          <p className="text-sm leading-normal text-foreground">
            Vamos configurar seu perfil?
          </p>
        </div>
      </main>

      <div className="flex justify-end px-5 pt-5 pl-[60px] pr-5">
        <Button asChild className="rounded-xl px-3 py-3">
          <Link href="/">Começar!</Link>
        </Button>
      </div>

      <div className="mt-auto border-t border-border p-5">
        <div className="flex gap-2 items-center">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-border bg-muted px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Digite sua mensagem
            </span>
          </div>
          <div className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-primary">
            <ArrowUp className="size-5 text-primary-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
