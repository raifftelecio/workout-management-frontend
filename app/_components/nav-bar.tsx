import dayjs from "dayjs";
import { getHomeData } from "@/app/_lib/api/fetch-generated";
import { NavBarLinks } from "@/app/_components/nav-bar-links";

export async function NavBar() {
  const response = await getHomeData(dayjs().format("YYYY-MM-DD"));
  const todayWorkoutLink =
    response.status === 200 && response.data.todayWorkoutDay
      ? `/workout-plans/${response.data.todayWorkoutDay.workoutPlanId}/days/${response.data.todayWorkoutDay.id}`
      : null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-6 border-t border-border bg-card px-6 py-4 rounded-t-[20px]"
      aria-label="Navegação principal"
    >
      <NavBarLinks todayWorkoutLink={todayWorkoutLink} />
    </nav>
  );
}
