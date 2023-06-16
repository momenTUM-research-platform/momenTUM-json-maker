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
    const atom = atoms.get(id);
    if (atom) {
      const { parent } = atom;
      if (parent) {
        nodesToShow.push(parent);
  
        // Get siblings while filtering out itself
        let children = atoms.get(parent)?.subNodes;
  
        // Initialize siblings as an empty array
        const siblings: Array<any> = [];
        siblings.push(...children!);
  
        // Also get first children of siblings
        children?.forEach((s) =>
          siblings.push(...(atoms.get(s)?.subNodes || []))
        );
  
        siblings && nodesToShow.push(...siblings.filter((s) => s !== id));
  
        // Also get children of siblings => nieces and nephews
        siblings &&
          siblings.forEach((s) =>
            nodesToShow.push(...(atoms.get(s)?.subNodes || []))
          );
  
        recursivelyFindIdsOfParentNodes(parent);
      }
    }
  };
  

  const recursivelyFindIdsOfSubNodes = (id: string) => {
    const subs = atoms.get(id)?.subNodes;

    if (subs) {
      nodesToShow.push(...subs);
      subs.forEach(recursivelyFindIdsOfSubNodes);
    }
  };

  recursivelyFindIdsOfSubNodes(focus);
  recursivelyFindIdsOfParentNodes(focus);

  nodesToShow.forEach((a) => hideAtom(atomsCopy, a, false));
  return atomsCopy;
}

function hideAtom(nodes: Atoms, id: string, isHidden: boolean) {
  const atom = nodes.get(id);
  if (atom) {
    atom.hidden = isHidden;
  }
}
