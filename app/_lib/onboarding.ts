import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";

export async function requireOnboardingCheck(requestHeaders: Headers) {
  const [homeResponse, trainResponse] = await Promise.all([
    getHomeData(dayjs().format("YYYY-MM-DD"), { headers: requestHeaders }),
    getUserTrainData({ headers: requestHeaders }),
  ]);

  if (homeResponse.status === 401 || trainResponse.status === 401) {
    redirect("/auth");
  }

  const hasTrainData =
    trainResponse.status === 200 && trainResponse.data !== null;
  const hasActivePlan =
    homeResponse.status === 200 &&
    !!homeResponse.data?.activeWorkoutPlanId;

  if (!hasTrainData || !hasActivePlan) {
    redirect("/onboarding");
  }
}
