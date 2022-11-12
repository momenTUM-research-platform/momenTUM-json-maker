import { State, useStore } from "../state";

export function updateDisplayedNodes(selectedNode: State["selectedNode"]) {
    const { nodes, edges, hideEdge, hideNode, getNode } = useStore.getState();
  
  
    // Show all nodes
    if (!selectedNode || selectedNode === "properties") {
      nodes.map(node => hideNode(node.id, false))
      edges.map(edge => hideEdge(edge.id, false));
      useStore.getState().alignNodes();
  
      return;
    }
  
    // Show only subtree of nodes
    const node = getNode(selectedNode)
  
    let nodesToShow: string[] = []; // Ids of nodes selected to be shown
    nodesToShow.push(selectedNode)
  
    const recursivelyFindIdsOfParentNodes = (id: string,) => {
      const { parent, subNodes } = getNode(id)
      console.log(parent)
      if (parent) {
        nodesToShow.push(parent)
        nodesToShow.push(parent + "_new_node")
        nodesToShow.push(parent + "_count")
        // Also show siblings and their create button and subnode count. 
        const siblings = getNode(parent).subNodes
        // Get siblings while filtering out itself. BTW, are you your own sibling?
        // Don't push new node and count node when node will never have subnodes
        siblings?.filter(s => s !== id).map(s => subNodes ? nodesToShow.push(s, s + "_new_node", s + "_count", s + "_delete") : nodesToShow.push(s, s + "_delete"))
  
        recursivelyFindIdsOfParentNodes(parent)
      }
    }
  
    const recursivelyFindIdsOfSubNodes = (id: string) => {
      const subs = getNode(id).subNodes
      console.log(subs)
  
      if (subs) {
        nodesToShow.push(id + "_new_node") // Add "newNode" to displayed nodes 
        nodesToShow.push(id + "_count")
        nodesToShow.push(id + "_delete")
        nodesToShow.push(...subs)
        subs.forEach(recursivelyFindIdsOfSubNodes);
        ;
      }
    };
  
  
    recursivelyFindIdsOfSubNodes(selectedNode);
    recursivelyFindIdsOfParentNodes(selectedNode);
  
    let edgesToShow = edges.filter((e) => nodesToShow.find((n) => e.target === n)); // This is O(n**2), can it be better?
    console.log(edgesToShow)
    // hide all, then unhide subnodes + edges
    nodes.map(node => hideNode(node.id, true))
    edges.map(edge => hideEdge(edge.id, true));
    nodesToShow.map(node => hideNode(node, false))
    edgesToShow.map(edge => hideEdge(edge.id, false));
    edges.filter(e =>  (e.id.includes("_new_node") || e.id.includes("_count")) || e.id.includes("_delete")).map(e => hideEdge(e.id, false)) 
    useStore.getState().alignNodes();
  }
  