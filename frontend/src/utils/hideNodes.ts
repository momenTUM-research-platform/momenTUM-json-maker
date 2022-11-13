import { State, useStore } from "../state";

export function updateDisplayedNodes(selectedNode: State["selectedNode"]) {
    const { nodes, edges, hideEdge, hideNode, atoms, hideAllAtoms, hideAtom } = useStore.getState();
    
    console.time("hide")
    // Show all nodes
    if (!selectedNode ) {
      useStore.getState().alignNodes();
      console.timeEnd("hide")
      return;
    }


    if (selectedNode === "study") {
      hideAllAtoms(false)
      useStore.getState().alignNodes();
      console.timeEnd("hide")
      return;
    }

    console.timeLog("hide", "Show all")
    // Show only subtree of nodes
    const node = atoms.get(selectedNode)
  
    let nodesToShow: string[] = []; // Ids of nodes selected to be shown
    nodesToShow.push(selectedNode)
  
    const recursivelyFindIdsOfParentNodes = (id: string,) => {
      const { parent, subNodes } = atoms.get(id)!
      if (parent) {
        nodesToShow.push(parent)
        // Get siblings while filtering out itself. BTW, are you your own sibling?
        const siblings = atoms.get(parent)!.subNodes
        siblings && nodesToShow.push(...siblings.filter(s => s !== id))
        // Don't push new node and count node when node will never have subnodes  
        recursivelyFindIdsOfParentNodes(parent)
      }
    }
    
    const recursivelyFindIdsOfSubNodes = (id: string) => {
      const subs = atoms.get(id)!.subNodes
      
      if (subs) {
        nodesToShow.push(...subs)
        subs.forEach(recursivelyFindIdsOfSubNodes);
        ;
      }
    };
    
    
    recursivelyFindIdsOfSubNodes(selectedNode);
    console.timeLog("hide", "Children")
    recursivelyFindIdsOfParentNodes(selectedNode);
    console.timeLog("hide", "Parents")
  
    // hide all, then unhide subnodes + edges
    hideAllAtoms(true)
    console.timeLog("hide", "hide all")
    nodesToShow.forEach(a  => hideAtom(a, false))
    console.timeLog("hide", "unhide selected nodes")
    useStore.getState().alignNodes();
    console.timeEnd("hide")
  }
  