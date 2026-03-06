import Image from "next/image";
import Link from "next/link";
import { Calendar, Dumbbell, Timer, Zap } from "lucide-react";
import type { GetWorkoutPlan200WorkoutDaysItem } from "@/app/_lib/api/fetch-generated";

const WEEK_DAY_LABELS: Record<GetWorkoutPlan200WorkoutDaysItem["weekDay"], string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

export interface WorkoutPlanDayCardProps {
  workoutPlanId: string;
  day: GetWorkoutPlan200WorkoutDaysItem;
}

export function WorkoutPlanDayCard({ workoutPlanId, day }: WorkoutPlanDayCardProps) {
  const weekDayLabel = WEEK_DAY_LABELS[day.weekDay];
  const durationMin = Math.round(day.estimatedDurationInSeconds / 60);
  const isRest = day.isRest;

  if (isRest) {
    return (
      <div className="flex h-[110px] flex-col justify-between rounded-xl bg-muted p-5">
        <div className="flex justify-center">
          <span className="flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-1.5 backdrop-blur-sm">
            <Calendar className="size-3.5 text-foreground" />
            <span className="text-xs font-semibold uppercase leading-none text-foreground">
              {weekDayLabel}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="size-5 shrink-0 text-foreground" />
          <p className="text-2xl font-semibold leading-tight text-foreground">
            Descanso
          </p>
        </div>
      </div>
    );
  }

  const coverUrl = day.coverImageUrl ?? "/login-bg.png";

  return (
    <Link
      href={`/workout-plans/${workoutPlanId}/days/${day.id}`}
      className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5"
    >
      <Image
        src={coverUrl}
        alt={day.name}
        fill
        className="pointer-events-none object-cover"
        sizes="(max-width: 390px) 100vw, 390px"
        unoptimized={coverUrl.startsWith("http")}
      />
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="relative flex justify-center">
        <span className="flex items-center gap-1 rounded-full bg-background/20 px-2.5 py-1.5 backdrop-blur-sm">
          <Calendar className="size-3.5 text-primary-foreground" />
          <span className="text-xs font-semibold uppercase leading-none text-primary-foreground">
            {weekDayLabel}
          </span>
        </span>
      </div>
      <div className="relative flex flex-col gap-2">
        <p className="text-2xl font-semibold leading-tight text-primary-foreground">
          {day.name}
        </p>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs leading-normal text-primary-foreground/70">
            <Timer className="size-3.5" />
            {durationMin}min
          </span>
          <span className="flex items-center gap-1 text-xs leading-normal text-primary-foreground/70">
            <Dumbbell className="size-3.5" />
            {day.exercisesCount} exercícios
          </span>
        </div>
      </div>
    </Link>
  );
}
