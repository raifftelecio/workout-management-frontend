import { redirect } from "next/navigation";
import Image from "next/image";
import { Goal } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import type { GetWorkoutPlan200WorkoutDaysItemWeekDay } from "@/app/_lib/api/fetch-generated";
import { headers } from "next/headers";
import { NavBar } from "@/app/_components/nav-bar";
import { WorkoutPlanDayCard } from "@/app/_components/workout-plan-day-card";

const WEEK_DAY_ORDER: GetWorkoutPlan200WorkoutDaysItemWeekDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { id: workoutPlanId } = await params;
  const response = await getWorkoutPlan(workoutPlanId);
  if (response.status === 401) redirect("/auth");
  if (response.status !== 200) redirect("/");

  const plan = response.data;
  const sortedDays = [...plan.workoutDays].sort(
    (a, b) =>
      WEEK_DAY_ORDER.indexOf(a.weekDay) - WEEK_DAY_ORDER.indexOf(b.weekDay)
  );

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <header className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
        <div className="absolute inset-0 overflow-hidden rounded-b-[20px]">
          <Image
            alt=""
            src="/home-banner.jpg"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 rounded-b-[20px]"
            style={{
              background:
                "linear-gradient(238.089deg, transparent 0%, var(--login-hero-bg) 100%)",
            }}
          />
        </div>
        <p className="relative text-[22px] font-normal uppercase leading-[1.15] text-primary-foreground tracking-wide">
          Fit.ai
        </p>
        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex gap-1 items-center justify-center rounded-full bg-primary px-2.5 py-1.5">
              <Goal className="size-4 shrink-0 text-primary-foreground" />
              <span className="text-xs font-semibold uppercase leading-none text-primary-foreground">
                {plan.name}
              </span>
            </div>
            <p className="text-2xl font-semibold leading-tight text-primary-foreground">
              Plano de Treino
            </p>
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-3 p-5">
        {sortedDays.map((day) => (
          <WorkoutPlanDayCard
            key={day.id}
            workoutPlanId={workoutPlanId}
            day={day}
          />
        ))}
      </section>

      <NavBar />
    </div>
  );
}
