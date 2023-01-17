export function hideAtoms(selectedNode: string, atoms: Atoms): Atoms {
  const focus = selectedNode;

  //only on first render
  if (!focus) {
    return atoms;
  }
  // Show only subtree of nodes
  const node = atoms.get(focus);
  const atomsCopy: Atoms = new Map();
  // hide all, then unhide subnodes + edges
  atoms.forEach((atom, id) => atomsCopy.set(id, { ...atom, hidden: true }));

  let nodesToShow: string[] = []; // Ids of nodes selected to be shown
  nodesToShow.push(focus);

  const recursivelyFindIdsOfParentNodes = (id: string) => {
    const { parent } = atoms.get(id)!;
    if (parent) {
      nodesToShow.push(parent);
      // Get siblings while filtering out itself. BTW, are you your own sibling?
      const siblings = atoms.get(parent)!.subNodes;
      siblings && nodesToShow.push(...siblings.filter((s) => s !== id));
      // Also get children of siblings => nieces and nephews? Makes it more fluent
      siblings && siblings.forEach((s) => nodesToShow.push(...(atoms.get(s)!.subNodes || [])));
      recursivelyFindIdsOfParentNodes(parent);
    }
  };

  const recursivelyFindIdsOfSubNodes = (id: string) => {
    const subs = atoms.get(id)!.subNodes;

    if (subs) {
      nodesToShow.push(...subs);
      subs.forEach(recursivelyFindIdsOfSubNodes);
    }
  };

  recursivelyFindIdsOfSubNodes(focus);
  recursivelyFindIdsOfParentNodes(focus);

  nodesToShow.forEach((a) => hideAtom(atomsCopy, a, false));
  //  console.table(atoms);
  return atomsCopy;
}

function hideAtom(nodes: Atoms, id: string, isHidden: boolean) {
  nodes.get(id)!.hidden = isHidden;
}
