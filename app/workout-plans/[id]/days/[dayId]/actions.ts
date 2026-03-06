"use server";

import { revalidatePath } from "next/cache";
import dayjs from "dayjs";
import {
  getWorkoutDay,
  startWorkoutSession,
  updateWorkoutSession,
} from "@/app/_lib/api/fetch-generated";

export async function getWorkoutDayAction(workoutPlanId: string, workoutDayId: string) {
  const response = await getWorkoutDay(workoutPlanId, workoutDayId);
  if (response.status === 401 || response.status !== 200) return null;
  return response.data;
}

export async function startSessionAction(
  workoutPlanId: string,
  workoutDayId: string
) {
  const response = await startWorkoutSession(workoutPlanId, workoutDayId);
  if (response.status === 201 || response.status === 409) {
    revalidatePath(
      `/workout-plans/${workoutPlanId}/days/${workoutDayId}`,
      "page"
    );
  }
}

export async function completeSessionAction(
  workoutPlanId: string,
  workoutDayId: string,
  sessionId: string
) {
  const completedAt = dayjs().toISOString();
  const response = await updateWorkoutSession(
    workoutPlanId,
    workoutDayId,
    sessionId,
    { completedAt }
  );
  if (response.status === 200) {
    revalidatePath(
      `/workout-plans/${workoutPlanId}/days/${workoutDayId}`,
      "page"
    );
  }
}
