import { redirect } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/app/_lib/auth-client";
import { getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { headers } from "next/headers";
import { NavBar } from "@/app/_components/nav-bar";
import { ProfileLogoutButton } from "@/app/_components/profile-logout-button";
import {
  Weight,
  Ruler,
  BicepsFlexed,
  User,
} from "lucide-react";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const trainDataResponse = await getUserTrainData({
    headers: await headers(),
  });

  const trainData =
    trainDataResponse.status === 200 && trainDataResponse.data !== null
      ? trainDataResponse.data
      : null;

  const userName =
    session.data.user.name ??
    (session.data.user.email?.split("@")[0]) ??
    trainData?.userName ??
    "Usuário";

  const weightKg = trainData
    ? (trainData.weightInGrams / 1000).toFixed(1)
    : "—";
  const heightCm = trainData ? trainData.heightInCentimeters.toString() : "—";
  const bodyFat = trainData
    ? `${trainData.bodyFatPercentage}%`
    : "—";
  const age = trainData ? trainData.age.toString() : "—";

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <header className="flex h-14 shrink-0 items-center px-5">
        <p className="text-[22px] font-normal uppercase leading-[1.15] tracking-wide text-foreground">
          Fit.ai
        </p>
      </header>

      <section className="flex flex-col gap-5 items-center justify-center p-5 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-3 items-center shrink-0">
            <div className="relative size-[52px] shrink-0 overflow-hidden rounded-[54px]">
              {session.data.user.image ? (
                <Image
                  alt=""
                  src={session.data.user.image}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5 items-start justify-center shrink-0">
              <p className="text-lg font-semibold leading-[1.05] text-foreground">
                {userName}
              </p>
              <p className="text-sm leading-[1.15] text-foreground/70">
                Plano Básico
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="flex flex-col gap-5 items-center justify-stretch rounded-xl bg-primary/10 p-5">
            <div className="flex items-center rounded-full bg-primary/10 p-2.5 w-[34px]">
              <Weight className="size-4 text-foreground" />
            </div>
            <div className="flex flex-col gap-1.5 items-center min-w-0 w-12">
              <p className="text-2xl font-semibold leading-[1.15] text-foreground">
                {weightKg}
              </p>
              <p className="text-xs leading-normal text-muted-foreground uppercase text-center">
                Kg
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center justify-stretch rounded-xl bg-primary/10 p-5">
            <div className="flex items-center rounded-full bg-primary/10 p-2.5 w-[34px]">
              <Ruler className="size-4 text-foreground" />
            </div>
            <div className="flex flex-col gap-1.5 items-center justify-center">
              <p className="text-2xl font-semibold leading-[1.15] text-foreground">
                {heightCm}
              </p>
              <p className="text-xs leading-normal text-muted-foreground uppercase">
                Cm
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center justify-stretch rounded-xl bg-primary/10 p-5">
            <div className="flex items-center rounded-full bg-primary/10 p-2.5 w-[34px]">
              <BicepsFlexed className="size-4 text-foreground" />
            </div>
            <div className="flex flex-col gap-1.5 items-center justify-center">
              <p className="text-2xl font-semibold leading-[1.15] text-foreground">
                {bodyFat}
              </p>
              <p className="text-xs leading-normal text-muted-foreground uppercase">
                Gc
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center justify-stretch rounded-xl bg-primary/10 p-5">
            <div className="flex items-center rounded-full bg-primary/10 p-2.5 w-[34px]">
              <User className="size-4 text-foreground" />
            </div>
            <div className="flex flex-col gap-1.5 items-center justify-center min-w-[29px]">
              <p className="text-2xl font-semibold leading-[1.15] text-foreground">
                {age}
              </p>
              <p className="text-xs leading-normal text-muted-foreground uppercase">
                Anos
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center justify-center px-4 py-2 rounded-full shrink-0">
          <ProfileLogoutButton />
        </div>
      </section>

      <NavBar />
    </div>
  );
}
