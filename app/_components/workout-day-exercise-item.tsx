"use client";

import { CircleHelp, Zap } from "lucide-react";
import { useQueryState, parseAsBoolean } from "nuqs";
import type { GetWorkoutDay200ExercisesItem } from "@/app/_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";

export interface WorkoutDayExerciseItemProps {
  exercise: GetWorkoutDay200ExercisesItem;
}

export function WorkoutDayExerciseItem({ exercise }: WorkoutDayExerciseItemProps) {
  const [, setChatOpen] = useQueryState("chat_open", parseAsBoolean);
  const [, setChatInitialMessage] = useQueryState("chat_initial_message");
  const restLabel = `${exercise.restTimeInSeconds}S`;

  const openExerciseHelp = () => {
    setChatInitialMessage(
      `Como executar o exercício ${exercise.name} corretamente?`
    );
    setChatOpen(true);
  };

  return (
    <div className="flex h-[96px] items-start justify-between rounded-xl border border-border p-5">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-3">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold leading-normal text-foreground">
            {exercise.name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-5 shrink-0 p-0"
            aria-label="Ajuda"
            onClick={openExerciseHelp}
          >
            <CircleHelp className="size-5 text-foreground" />
          </Button>
        </div>
        <div className="flex gap-1.5 items-start">
          <span className="rounded-full bg-muted px-2.5 py-1.5 text-xs font-semibold uppercase leading-none text-muted-foreground">
            {exercise.sets} séries
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1.5 text-xs font-semibold uppercase leading-none text-muted-foreground">
            {exercise.reps} reps
          </span>
          <span className="flex h-[22px] items-center gap-1 rounded-full bg-muted px-2.5 py-1.5 text-xs font-semibold uppercase leading-none text-muted-foreground">
            <Zap className="size-3.5" />
            {restLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
