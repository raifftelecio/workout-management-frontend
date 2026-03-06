import dayjs from "dayjs";
import { Flame } from "lucide-react";
import type { GetHomeData200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";
import { ConsistencySquare } from "@/app/_components/consistency-square";

const WEEK_DAY_LETTERS = ["S", "T", "Q", "Q", "S", "S", "D"];

function getWeekDatesFromMonday(): string[] {
  const monday = dayjs().day(1).startOf("day");
  return Array.from({ length: 7 }, (_, i) =>
    monday.add(i, "day").format("YYYY-MM-DD")
  );
}

export interface ConsistencyTrackerProps {
  consistencyByDay: GetHomeData200ConsistencyByDay;
  todayIndex: number;
  workoutStreak: number;
}

export function ConsistencyTracker({
  consistencyByDay,
  todayIndex,
  workoutStreak,
}: ConsistencyTrackerProps) {
  const weekDates = getWeekDatesFromMonday();

  return (
    <div className="flex gap-3 items-center justify-center w-full">
      <div className="flex gap-3 items-center justify-between p-5 rounded-xl border border-border w-full max-w-[261px]">
        {weekDates.map((dateKey, index) => {
          const state = consistencyByDay[dateKey];
          const completed = state?.workoutDayCompleted ?? false;
          const started = state?.workoutDayStarted ?? false;
          const isToday = index === todayIndex;

          return (
            <ConsistencySquare
              key={dateKey}
              letter={WEEK_DAY_LETTERS[index]}
              completed={completed}
              started={started}
              isToday={isToday}
            />
          );
        })}
      </div>
      <div className="flex flex-row items-center self-stretch">
        <div className="flex gap-2 items-center h-full px-5 py-2 rounded-xl bg-streak-bg">
          <Flame className="size-5 shrink-0 text-foreground" />
          <span className="text-base font-semibold leading-tight text-foreground">
            {workoutStreak}
          </span>
        </div>
      </div>
    </div>
  );
}
