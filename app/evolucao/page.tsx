import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getStats } from "@/app/_lib/api/fetch-generated";
import { headers } from "next/headers";
import { requireOnboardingCheck } from "@/app/_lib/onboarding";
import { NavBar } from "@/app/_components/nav-bar";
import { EvolutionStreakBanner } from "@/app/_components/evolution-streak-banner";
import { EvolutionConsistencyHeatmap } from "@/app/_components/evolution-consistency-heatmap";
import { CircleCheck, CirclePercent, Hourglass } from "lucide-react";

function formatTotalTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h${minutes.toString().padStart(2, "0")}m`;
}

export default async function EvolucaoPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  await requireOnboardingCheck(await headers());

  const from = dayjs().subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = dayjs().endOf("month").format("YYYY-MM-DD");
  const response = await getStats({ from, to });

  if (response.status === 401) redirect("/auth");

  const data =
    response.status === 200
      ? response.data
      : {
          workoutStreak: 0,
          consistencyByDay: {},
          completedWorkoutsCount: 0,
          conclusionRate: 0,
          totalTimeInSeconds: 0,
        };

  const conclusionPercent = Math.round(data.conclusionRate * 100);

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <header className="flex h-14 shrink-0 items-center px-5">
        <p className="text-[22px] font-normal uppercase leading-[1.15] tracking-wide text-foreground">
          Fit.ai
        </p>
      </header>

      <section className="flex flex-col items-start px-5 w-full">
        <div className="relative w-full max-w-[390px] self-center">
          <EvolutionStreakBanner workoutStreak={data.workoutStreak} />
        </div>
      </section>

      <section className="flex flex-col gap-3 p-5 w-full">
        <div className="flex items-center gap-3 w-full">
          <h2 className="text-lg font-semibold leading-normal text-foreground">
            Consistência
          </h2>
        </div>
        <EvolutionConsistencyHeatmap
          consistencyByDay={data.consistencyByDay}
          from={from}
          to={to}
        />
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-3 items-center w-full">
            <div className="flex flex-1 flex-col gap-5 items-center min-h-0 min-w-0 rounded-xl bg-primary/10 p-5">
              <div className="flex items-center rounded-full bg-primary/10 p-2.5 w-[34px]">
                <CircleCheck className="size-4 text-foreground" />
              </div>
              <div className="flex flex-col gap-1.5 items-center text-center">
                <p className="text-2xl font-semibold leading-[1.15] text-foreground">
                  {data.completedWorkoutsCount}
                </p>
                <p className="text-xs leading-normal text-muted-foreground">
                  Treinos Feitos
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-5 items-center min-h-0 min-w-0 rounded-xl bg-primary/10 p-5">
              <div className="flex items-center rounded-full bg-primary/10 p-2.5 w-[34px]">
                <CirclePercent className="size-4 text-foreground" />
              </div>
              <div className="flex flex-col gap-1.5 items-center text-center">
                <p className="text-2xl font-semibold leading-[1.15] text-foreground">
                  {conclusionPercent}%
                </p>
                <p className="text-xs leading-normal text-muted-foreground">
                  Taxa de conclusão
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center rounded-xl bg-primary/10 p-5 w-full">
            <div className="flex items-center rounded-full bg-primary/10 p-2.5 w-[34px]">
              <Hourglass className="size-4 text-foreground" />
            </div>
            <div className="flex flex-col gap-1.5 items-center text-center">
              <p className="text-2xl font-semibold leading-[1.15] text-foreground">
                {formatTotalTime(data.totalTimeInSeconds)}
              </p>
              <p className="text-xs leading-normal text-muted-foreground">
                Tempo Total
              </p>
            </div>
          </div>
        </div>
      </section>

      <NavBar />
    </div>
  );
}
