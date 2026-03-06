import dayjs from "dayjs";
import type { GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const MONTH_LABELS = [
  "Jan", "Fev", "Mar", "Abril", "Maio", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export interface EvolutionConsistencyHeatmapProps {
  consistencyByDay: GetStats200ConsistencyByDay;
  from: string;
  to: string;
}

function getMonthGrid(year: number, month: number) {
  const firstDay = dayjs().year(year).month(month).date(1);
  const lastDay = firstDay.endOf("month");
  const startWeek = firstDay.subtract((firstDay.day() + 6) % 7, "day");
  const rows: { date: dayjs.Dayjs; inRange: boolean }[][] = [];
  let current = startWeek;
  while (!current.isAfter(lastDay)) {
    const row: { date: dayjs.Dayjs; inRange: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = current.add(d, "day");
      const inRange = !cellDate.isBefore(firstDay) && !cellDate.isAfter(lastDay);
      row.push({ date: cellDate, inRange });
    }
    rows.push(row);
    current = current.add(7, "day");
  }
  return { firstDay, lastDay, rows };
}

function getCellState(
  dateKey: string,
  inRange: boolean,
  consistencyByDay: GetStats200ConsistencyByDay
) {
  if (!inRange) return "empty";
  const state = consistencyByDay[dateKey];
  if (!state) return "empty";
  if (state.workoutDayCompleted) return "completed";
  if (state.workoutDayStarted) return "started";
  return "empty";
}

export function EvolutionConsistencyHeatmap({
  consistencyByDay,
  from,
  to,
}: EvolutionConsistencyHeatmapProps) {
  const fromDate = dayjs(from);
  const toDate = dayjs(to);
  const months: { year: number; month: number; label: string; grid: ReturnType<typeof getMonthGrid> }[] = [];
  let d = fromDate.startOf("month");
  while (!d.isAfter(toDate)) {
    const grid = getMonthGrid(d.year(), d.month());
    months.push({
      year: d.year(),
      month: d.month(),
      label: MONTH_LABELS[d.month()],
      grid,
    });
    d = d.add(1, "month");
  }

  return (
    <div className="flex gap-1 overflow-x-auto p-5 rounded-xl border border-border">
      {months.map(({ label, grid }) => (
        <div
          key={`${grid.firstDay.format("YYYY-MM")}`}
          className="flex shrink-0 flex-col gap-1.5"
        >
          <p className="text-xs leading-normal text-muted-foreground">
            {label}
          </p>
          <div className="flex gap-1 items-start">
            {grid.rows.map((weekRow, weekIdx) => (
              <div
                key={weekIdx}
                className="flex flex-col gap-1"
              >
                {weekRow.map(({ date, inRange }, dayIdx) => {
                  const dateKey = date.format("YYYY-MM-DD");
                  const state = getCellState(dateKey, inRange, consistencyByDay);
                  let cellClass = "size-5 shrink-0 rounded-md border border-border";
                  if (state === "completed") {
                    cellClass = "size-5 shrink-0 rounded-md border border-transparent bg-primary";
                  } else if (state === "started") {
                    cellClass = "size-5 shrink-0 rounded-md border border-transparent bg-consistency-started";
                  }
                  return <div key={dayIdx} className={cellClass} />;
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
