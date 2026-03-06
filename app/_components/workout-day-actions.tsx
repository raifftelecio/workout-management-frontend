"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  startSessionAction,
  completeSessionAction,
} from "@/app/workout-plans/[id]/days/[dayId]/actions";

export interface WorkoutDayActionsProps {
  workoutPlanId: string;
  workoutDayId: string;
  sessionInProgress: { id: string } | null;
  sessionCompleted: boolean;
}

export function WorkoutDayActions({
  workoutPlanId,
  workoutDayId,
  sessionInProgress,
  sessionCompleted,
}: WorkoutDayActionsProps) {
  const [isPending, startTransition] = useTransition();

  if (sessionCompleted) {
    return (
      <Button variant="ghost" className="w-full rounded-full" disabled>
        Concluído!
      </Button>
    );
  }

  if (sessionInProgress) {
    return (
      <CompleteWorkoutButton
        workoutPlanId={workoutPlanId}
        workoutDayId={workoutDayId}
        sessionId={sessionInProgress.id}
        isPending={isPending}
        startTransition={startTransition}
      />
    );
  }

  return (
    <Button
      type="button"
      className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await startSessionAction(workoutPlanId, workoutDayId);
        });
      }}
    >
      Iniciar Treino
    </Button>
  );
}

function CompleteWorkoutButton({
  workoutPlanId,
  workoutDayId,
  sessionId,
  isPending,
  startTransition,
}: {
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
  isPending: boolean;
  startTransition: (fn: () => void) => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full rounded-full border-border text-foreground"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await completeSessionAction(workoutPlanId, workoutDayId, sessionId);
        });
      }}
    >
      Marcar como concluído
    </Button>
  );
}
