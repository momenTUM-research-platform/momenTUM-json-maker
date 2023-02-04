import dayjs from "dayjs";
import { isModule } from "../types/guards";
import { schedule } from "./scheduler";
import { Edge, Node } from "reactflow";

const position = { x: 0, y: 0 }; // Specified position does not matter as overwritten by dagre graph layout


/**
 * Calculates Timeline from Atoms
 * @param atoms 
 * @param properties 
 * @returns Days
 */
export function calculateTimelineFromAtoms(atoms: Atoms, properties: Properties): Days {
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
  

/**
 * 
 * @param atoms 
 * @returns 
 */

export function calculateGraphFromAtoms(atoms: Atoms): [Node[], Edge[]] {
  let nodes: Node[] = [];
  let edges: Edge[] = [];
  atoms.forEach((atom, id) => {
    // Create a node for each atom
    nodes.push({ id, data: { label: atom.title }, hidden: atom.hidden, position });
    // Create a node for each action of an atom, like deleting or creating
    atom.actions.forEach((action) => {
      action === "later" && console.log(action);
      nodes.push({
        id: id + "_" + action,
        type: action,
        zIndex: 1001,
        hidden: atom.hidden,
        data: { childType: atom.childType, parent: id },
        position,
      });
    });
    atom.subNodes?.forEach((sub, i) => {
      edges.push({
        id: id + "_->_" + sub,
        source: id,
        target: sub,
        label: i + 1,
        hidden: atom.hidden || atoms.get(sub)!.hidden,
      });
    });
  });
  console.log(nodes.filter((n) => n.type === "later").length);
  return [nodes, edges];
}