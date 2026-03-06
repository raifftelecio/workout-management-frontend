import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getHomeData } from "@/app/_lib/api/fetch-generated";
import type { GetHomeData200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";
import { headers } from "next/headers";
import { requireOnboardingCheck } from "@/app/_lib/onboarding";
import { NavBar } from "@/app/_components/nav-bar";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { ConsistencyTracker } from "@/app/_components/consistency-tracker";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  await requireOnboardingCheck(await headers());

  const response = await getHomeData(dayjs().format("YYYY-MM-DD"));
  if (response.status === 401) redirect("/auth");

  const homeData =
    response.status === 200
      ? response.data
      : {
          todayWorkoutDay: undefined,
          workoutStreak: 0,
          consistencyByDay: {} as GetHomeData200ConsistencyByDay,
        };

  const todayIndex = (dayjs().day() + 6) % 7;
  const userName =
    session.data.user.name ??
    (session.data.user.email?.split("@")[0]) ??
    "Usuário";

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <header className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            alt=""
            src="/home-banner.jpg"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(243deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)",
            }}
          />
        </div>
        <p className="relative text-[22px] font-normal uppercase leading-[1.15] text-primary-foreground tracking-wide">
          Fit.ai
        </p>
        <div className="relative flex items-end justify-between w-full">
          <div className="flex flex-col gap-1.5">
            <p className="text-2xl font-semibold leading-tight text-primary-foreground">
              Olá, {userName}
            </p>
            <p className="text-sm leading-[1.15] text-primary-foreground/70">
              Bora treinar hoje?
            </p>
          </div>
          <Button
            asChild
            className="rounded-full px-4 py-2 h-auto text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90"
          >
            <Link href="/">Bora!</Link>
          </Button>
        </div>
      </header>

      <section className="flex flex-col gap-3 pt-5 px-5 w-full">
        <div className="flex items-center justify-between w-full leading-normal">
          <h2 className="text-lg font-semibold text-foreground">
            Consistência
          </h2>
          <Link
            href="/evolucao"
            className="text-xs text-primary hover:underline"
          >
            Ver histórico
          </Link>
        </div>
        <ConsistencyTracker
          consistencyByDay={homeData.consistencyByDay}
          todayIndex={todayIndex}
          workoutStreak={homeData.workoutStreak}
        />
      </section>

      <section className="flex flex-col gap-3 p-5 w-full max-w-[390px]">
        <div className="flex items-center justify-between w-full leading-normal">
          <h2 className="text-lg font-semibold text-foreground">
            Treino de Hoje
          </h2>
          <button
            type="button"
            className="text-xs text-primary"
          >
            Ver treinos
          </button>
        </div>
        {homeData.todayWorkoutDay ? (
          <WorkoutDayCard day={homeData.todayWorkoutDay} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] rounded-xl border border-border bg-muted/30 text-muted-foreground text-sm">
            Nenhum treino para hoje
          </div>
        )}
      </section>

      <NavBar />
    </div>
  );
}
