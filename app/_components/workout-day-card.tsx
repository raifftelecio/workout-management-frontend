import Image from "next/image";
import Link from "next/link";
import { Calendar, Timer, Dumbbell } from "lucide-react";
import type { GetHomeData200TodayWorkoutDay } from "@/app/_lib/api/fetch-generated";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

export interface WorkoutDayCardProps {
  day: GetHomeData200TodayWorkoutDay;
}

export function WorkoutDayCard({ day }: WorkoutDayCardProps) {
  const durationInMinutes = Math.round(day.estimatedDurationInSeconds / 60);

  const coverUrl = day.coverImageUrl ?? "/home-banner.jpg";

  return (
    <Link
      href={`/workout-plans/${day.workoutPlanId}/days/${day.id}`}
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
      <div className="relative">
        <div className="flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm">
          <Calendar className="size-3.5 text-background" />
          <span className="font-heading text-xs font-semibold uppercase text-background">
            {WEEKDAY_LABELS[day.weekDay]}
          </span>
        </div>
      </div>
      <div className="relative flex flex-col gap-2">
        <h3 className="font-heading text-2xl font-semibold leading-[1.05] text-background">
          {day.name}
        </h3>
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-1">
            <Timer className="size-3.5 text-background/70" />
            <span className="font-heading text-xs text-background/70">
              {durationInMinutes}min
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="size-3.5 text-background/70" />
            <span className="font-heading text-xs text-background/70">
              {day.exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
