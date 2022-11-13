import { State, useStore } from "../state";

export function updateDisplayedNodes(selectedNode: State["selectedNode"]) {
    const { nodes, edges, hideEdge, hideNode, atoms } = useStore.getState();
    console.time("hide")

    // Show all nodes
    if (!selectedNode || selectedNode === "study") {
      nodes.map(node => hideNode(node.id, false))
      edges.map(edge => hideEdge(edge.id, false));
      useStore.getState().alignNodes();
  
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
        nodesToShow.push(parent + "_create")
        nodesToShow.push(parent + "_count")
        parent !== "study" && nodesToShow.push(parent+ "_delete")
        // Also show siblings and their create button and subnode count. 
        const siblings = atoms.get(parent)!.subNodes
        // Get siblings while filtering out itself. BTW, are you your own sibling?
        // Don't push new node and count node when node will never have subnodes
        siblings?.filter(s => s !== id).map(s => subNodes ? nodesToShow.push(s, s + "_create", s + "_count", s + "_delete") : nodesToShow.push(s, s + "_delete"))
  
        recursivelyFindIdsOfParentNodes(parent)
      }
    }
    
    const recursivelyFindIdsOfSubNodes = (id: string) => {
      const subs = atoms.get(id)!.subNodes
      
      if (subs) {
        nodesToShow.push(id + "_create") // Add "newNode" to displayed nodes 
        nodesToShow.push(id + "_count")
        nodesToShow.push(id + "_delete")
        nodesToShow.push(...subs)
        subs.forEach(recursivelyFindIdsOfSubNodes);
        ;
      }
    };
    
    
    recursivelyFindIdsOfSubNodes(selectedNode);
    console.timeLog("hide", "Children")
    recursivelyFindIdsOfParentNodes(selectedNode);
    console.timeLog("hide", "Parents")
  
    let edgesToShow = edges.filter((e) => nodesToShow.find((n) => e.target === n)); // This is O(n**2), can it be better?
    console.timeLog("hide", "Edges")
    // hide all, then unhide subnodes + edges
    nodes.map(node => hideNode(node.id, true))
    edges.map(edge => hideEdge(edge.id, true));
    console.timeLog("hide", "hide all")
    nodesToShow.map(node => hideNode(node, false))
    console.timeLog("hide", "unhide nodes")
    edgesToShow.map(edge => hideEdge(edge.id, false));
    console.timeLog("hide", "unhide edges")
    useStore.getState().alignNodes();
    console.timeEnd("hide")
  }
  