import React, { useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Edge,
  Node,
  useReactFlow,
} from "reactflow";
// 👇 you need to import the reactflow styles
import "reactflow/dist/style.css";
import { useStore, nodeTypes } from "../state";
import { hideAtoms } from "../utils/hideAtoms";
import { alignNodes } from "../utils/alignNodes";
import { calculateGraphFromAtoms } from "../utils/calculatorsFromAtoms";

function useGraph(): [Node[], Edge[]] {
  let { atoms, selectedNode, direction, forceRedraw } = useStore();

  const visibleAtoms = useMemo(
    () => hideAtoms(selectedNode || "study", atoms),
    [selectedNode, atoms.size, forceRedraw]
  );
  let [nodes, edges] = useMemo(
    () => calculateGraphFromAtoms(visibleAtoms),
    [visibleAtoms, direction]
  );

  [nodes, edges] = useMemo(
    () => alignNodes(nodes, edges, direction),
    [nodes, edges, direction, visibleAtoms]
  );

  return [nodes, edges];
}

export function Graph() {
  const [nodes, edges] = useGraph();
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodesDraggable={false}
      nodeOrigin={[0, 0]}
      onNodeClick={(_, node) => {
        node.type !== "create" &&
          node.type !== "delete" &&
          node.type !== "earlier" &&
          node.type !== "later" &&
          useStore.setState({ selectedNode: node.id });
      }}
      nodeTypes={nodeTypes}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
