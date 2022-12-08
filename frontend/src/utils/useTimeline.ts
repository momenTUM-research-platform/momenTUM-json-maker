import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useStore } from "../state";
import { schedule } from "./scheduler";
import { isModule } from "./typeGuards";

function calcTimelineFromAtoms(atoms: Atoms, properties: Properties): Days {
  const FORECAST_LENGTH = 1000; // days
  const currentDate = dayjs();
  let days: Days = Array.from({ length: FORECAST_LENGTH }, (_) => []); // Create an array of arrays of length 1000
  atoms.forEach((atom, id) => {
    const content = atom.content;
    if (!isModule(content)) {
      return;
    }
    // Get schedules occurances of module
    const events = schedule(content, properties);
    events
      .filter((event) => event.module === id)
      .forEach((event) => {
        const eventDate = dayjs(event.timestamp);
        const offsetFromToday = dayjs(event.timestamp).diff(currentDate, "days");
        days[offsetFromToday].push(event);
      });
  });

  return days;
}

export function useTimeline(): [
  dayjs.Dayjs,
  React.Dispatch<React.SetStateAction<dayjs.Dayjs>>,
  Day[]
] {
  const [date, setDate] = useState(dayjs());
  const { atoms } = useStore();
  const [days, setDays] = useState<Days>(
    // @ts-ignore
    calcTimelineFromAtoms(atoms, atoms.get("study")!.content.properties)
  );
  const [visibleDays, setVisibleDays] = useState<Day[]>([]);

  useEffect(() => {
    console.log("Running");
    // @ts-ignore
    const events = calcTimelineFromAtoms(atoms, atoms.get("study")!.content.properties);
    setDays(events);
    let visibleDays: Day[] = [];
    const offsetFromToday = date.diff(dayjs(), "day");
    // for any month outside of those we explicitely calculated, we need to get x days before dayOfMonth(current day) = x and 42-x days after current day
    // Then, to get the monday before the 1. of the month, subtract the day of the week of the first day of the month
    const dayOfMonth = date.date() - 1; // Subtract one, because we want the distance to the first day of the month, so not counting itself
    const dayOfWeek = date.subtract(dayOfMonth).day();

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
