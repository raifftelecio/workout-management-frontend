import { WorkoutPlanIdProvider } from "@/app/_components/workout-plan-id-context";

export default async function WorkoutPlanLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: workoutPlanId } = await params;
  return (
    <WorkoutPlanIdProvider workoutPlanId={workoutPlanId}>
      {children}
    </WorkoutPlanIdProvider>
  );
}
