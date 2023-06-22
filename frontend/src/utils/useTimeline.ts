import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useStore } from "../State";
import { calculateTimelineFromAtoms } from "./calculatorsFromAtoms";

/**
 * Uses timeline to return Days, setDate and Days[]
 * @returns Array
 */
export function useTimeline(): [
  dayjs.Dayjs,
  React.Dispatch<React.SetStateAction<dayjs.Dayjs>>,
  Day[]
] {
  const [date, setDate] = useState(dayjs());
  const { atoms } = useStore();
  const [days, setDays] = useState<Days>(
    // @ts-ignore
    calculateTimelineFromAtoms(atoms, atoms.get("properties")!.content)
  );
  const [visibleDays, setVisibleDays] = useState<Day[]>([]);

  useEffect(() => {
    // @ts-ignore
    const events = calculateTimelineFromAtoms(atoms, atoms.get("properties")!.content);
    setDays(events);
    let visibleDays: Day[] = [];
    const offsetFromToday = date.diff(dayjs(), "day");
    // for any month outside of those we explicitely calculated, we need to get x days before dayOfMonth(current day) = x and 42-x days after current day
    // Then, to get the monday before the 1. of the month, subtract the day of the week of the first day of the month
    const dayOfMonth = date.date() - 1; // Subtract one, because we want the distance to the first day of the month, so not counting itself
    const dayOfWeek = (date.subtract(dayOfMonth).day() + 5) % 7; // Day of week is given from sunday to saturday, this converts it to monday to sunday

    const x = dayOfMonth + dayOfWeek;

    for (let i = -x; i < 42 - x; i++) {
      const day = date.add(i, "days"); // Acts as subtract if i is negative
      visibleDays.push({
        date: day.format("YYYY-MM-DD"),
        events:
          offsetFromToday + i >= 0 && offsetFromToday + i < days.length
            ? days[offsetFromToday + i]
            : [],
        isCurrentMonth: date.isSame(day, "month"),
        isToday: dayjs().isSame(day, "day"),
        isSelected: false,
      });
    }

    setVisibleDays(visibleDays);
  }, [date, atoms]);

  return [date, setDate, visibleDays];
}
