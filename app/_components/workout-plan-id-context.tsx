"use client";

import { createContext, useContext } from "react";

const WorkoutPlanIdContext = createContext<string | null>(null);

export function WorkoutPlanIdProvider({
  children,
  workoutPlanId,
}: {
  children: React.ReactNode;
  workoutPlanId: string;
}) {
  return (
    <WorkoutPlanIdContext.Provider value={workoutPlanId}>
      {children}
    </WorkoutPlanIdContext.Provider>
  );
}

export function useWorkoutPlanId(): string {
  const id = useContext(WorkoutPlanIdContext);
  if (id == null)
    throw new Error("useWorkoutPlanId must be used within WorkoutPlanIdProvider");
  return id;
}
