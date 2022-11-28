import { Edge, Node } from "reactflow";

const position = { x: 0, y: 0 }; // Specified position does not matter as overwritten by dagre graph layout

export function calcGraphFromAtoms(atoms: Atoms): [Node[], Edge[]] {
  let nodes: Node[] = [];
  let edges: Edge[] = [];

  atoms.forEach((atom, id) => {
    nodes.push({ id, data: { label: atom.title }, hidden: atom.hidden, position });
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
    atom.subNodes?.forEach((sub) => {
      edges.push({
        id: id + "_->_" + sub,
        source: id,
        target: sub,
        hidden: atom.hidden || atoms.get(sub)!.hidden,
      });
    });
  });

  return [nodes, edges];
}
