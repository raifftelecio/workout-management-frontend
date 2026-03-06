import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { WorkoutDayPageClient } from "@/app/_components/workout-day-page-client";

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { dayId: workoutDayId } = await params;

  return <WorkoutDayPageClient workoutDayId={workoutDayId} />;
}
