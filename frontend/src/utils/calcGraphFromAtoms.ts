import { Edge, Node } from "reactflow";

const position = { x: 0, y: 0 }; // Specified position does not matter as overwritten by dagre graph layout

export function calcGraphFromAtoms(atoms: Atoms): [Node[], Edge[]] {
  let nodes: Node[] = [];
  let edges: Edge[] = [];
  atoms.forEach((atom, id) => {
    // Create a node for each atom
    nodes.push({ id, data: { label: atom.title }, hidden: atom.hidden, position });
    // Create a node for each action of an atom, like deleting or creating
    atom.actions.forEach((action) => {
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
  return [nodes, edges];
}
