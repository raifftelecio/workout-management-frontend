import Image from "next/image";
import { Flame } from "lucide-react";

export interface EvolutionStreakBannerProps {
  workoutStreak: number;
}

export function EvolutionStreakBanner({ workoutStreak }: EvolutionStreakBannerProps) {
  const isZero = workoutStreak === 0;

  return (
    <div className="relative flex min-h-[220px] w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-5 py-10">
      <Image
        alt=""
        src="/home-banner.jpg"
        fill
        className="object-cover"
      />
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          backgroundColor: isZero
            ? "var(--evolution-banner-streak-zero)"
            : "var(--evolution-banner-streak-active)",
          opacity: 0.9,
        }}
      />
      <div className="relative flex flex-col items-center gap-3">
        <div className="flex flex-col items-start rounded-full border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
          <Flame className="size-8 text-white" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            {workoutStreak} dias
          </p>
          <p className="text-base leading-[1.15] text-white/60">
            Sequência Atual
          </p>
        </div>
      </div>
    </div>
  );
}
