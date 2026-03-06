"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getWorkoutDayAction,
} from "@/app/workout-plans/[id]/days/[dayId]/actions";
import type { GetWorkoutDay200 } from "@/app/_lib/api/fetch-generated";
import type { GetWorkoutDay200WeekDay } from "@/app/_lib/api/fetch-generated";
import { useWorkoutPlanId } from "@/app/_components/workout-plan-id-context";
import { NavBar } from "@/app/_components/nav-bar";
import { BackButton } from "@/app/_components/back-button";
import { WorkoutDayExerciseItem } from "@/app/_components/workout-day-exercise-item";
import { WorkoutDayActions } from "@/app/_components/workout-day-actions";
import { Calendar, Dumbbell, Timer } from "lucide-react";

const WEEK_DAY_LABELS: Record<GetWorkoutDay200WeekDay, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

export interface WorkoutDayPageClientProps {
  workoutDayId: string;
}

export function WorkoutDayPageClient({ workoutDayId }: WorkoutDayPageClientProps) {
  const router = useRouter();
  const workoutPlanId = useWorkoutPlanId();
  const [day, setDay] = useState<GetWorkoutDay200 | null>(null);

  useEffect(() => {
    getWorkoutDayAction(workoutPlanId, workoutDayId).then((data) => {
      if (!data) router.replace("/");
      else setDay(data);
    });
  }, [workoutPlanId, workoutDayId, router]);

  if (!day) return null;

  const sessionInProgress =
    day.sessions.find((s) => s.startedAt && !s.completedAt) ?? null;
  const sessionCompleted = day.sessions.some((s) => s.completedAt);
  const coverUrl = day.coverImageUrl ?? "/login-bg.png";
  const durationMin = Math.round(day.estimatedDurationInSeconds / 60);
  const weekDayLabel = WEEK_DAY_LABELS[day.weekDay];

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <section className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between w-full">
          <BackButton />
          <p className="text-lg font-semibold leading-normal text-foreground">
            Treino de Hoje
          </p>
          <div className="size-6 shrink-0" />
        </div>

        <div className="relative flex h-[200px] w-full flex-col justify-between overflow-hidden rounded-xl p-5">
          <Image
            src={coverUrl}
            alt={day.name}
            fill
            className="object-cover"
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
            <h1 className="text-2xl font-semibold leading-tight text-primary-foreground">
              {day.name}
            </h1>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs leading-normal text-primary-foreground/70">
                <Timer className="size-3.5" />
                {durationMin}min
              </span>
              <span className="flex items-center gap-1 text-xs leading-normal text-primary-foreground/70">
                <Dumbbell className="size-3.5" />
                {day.exercises.length} exercícios
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {day.exercises.map((exercise) => (
            <WorkoutDayExerciseItem key={exercise.id} exercise={exercise} />
          ))}
        </div>

        <WorkoutDayActions
          workoutPlanId={workoutPlanId}
          workoutDayId={day.id}
          sessionInProgress={sessionInProgress}
          sessionCompleted={sessionCompleted}
        />
      </section>

      <NavBar />
    </div>
  );
}
