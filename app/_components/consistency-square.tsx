export interface ConsistencySquareProps {
  letter: string;
  completed: boolean;
  started: boolean;
  isToday: boolean;
}

export function ConsistencySquare({
  letter,
  completed,
  started,
  isToday,
}: ConsistencySquareProps) {
  let boxClassName =
    "size-5 rounded-md border border-border bg-card shrink-0";
  if (completed) {
    boxClassName =
      "size-5 rounded-md bg-primary shrink-0 border border-transparent";
  } else if (started) {
    boxClassName =
      "size-5 rounded-md bg-consistency-started shrink-0 border border-transparent";
  } else if (isToday) {
    boxClassName =
      "size-5 rounded-md border-2 border-primary bg-card shrink-0";
  }

  return (
    <div className="flex flex-col gap-1.5 items-center shrink-0">
      <div className={boxClassName} />
      <span className="text-xs leading-normal text-muted-foreground">
        {letter}
      </span>
    </div>
  );
}
