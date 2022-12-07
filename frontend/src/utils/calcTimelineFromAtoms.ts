import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { Edge, Node } from "reactflow";
import { schedule } from "./scheduler";
import { isModule } from "./typeGuards";

export function calcTimelineFromAtoms(atoms: Atoms, properties: Properties): Days {
  const FORECAST_LENGTH = 1000; // days
  const currentDate = dayjs();
  let days: Days = Array.from({ length: 1000 }, (_) => []); // Create an array of arrays of length 1000

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
        days[offsetFromToday].push(event);
      });
  });

  return days;
}
