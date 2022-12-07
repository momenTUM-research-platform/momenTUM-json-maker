import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { Edge, Node } from "reactflow";
import { schedule } from "./scheduler";
import { isModule } from "./typeGuards";

export function calcTimelineFromAtoms(atoms: Atoms, properties: Properties): Day[] {
  const FORECAST_LENGTH = 1000; // days
  const currentDate = dayjs();
  let date = dayjs();
  let days: Day[] = [];

  for (let i = 0; i < FORECAST_LENGTH; i++) {
    days.push({
      date: date.format("YYYY-MM-DD"),
      events: [],
      isCurrentMonth: currentDate.isSame(date, "month"),
      isSelected: false,
      isToday: currentDate.isSame(date, "day"),
    });
    date = date.add(1, "day");
  }

  atoms.forEach((atom, id) => {
    if (!isModule(atom)) {
      return;
    }
    // Get schedules occurances of module
    const events = schedule(atom, properties);
    events
      .filter((event) => event.module === id)
      .forEach((event) => {
        const offsetFromToday = dayjs(event.timestamp).diff(currentDate, "days");
        days[offsetFromToday].events.push(event);
      });
  });

  return days;
}
