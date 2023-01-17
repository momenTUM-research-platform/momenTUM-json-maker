import React, { useMemo } from "react";
import ReactFlow, { MiniMap, Controls, Background, Edge, Node } from "reactflow";
// 👇 you need to import the reactflow styles
import "reactflow/dist/style.css";
import { NewNode, DeleteNode } from "./CustomNodes";
import { useStore } from "./state";
import { alignNodes } from "./utils/alignNodes";
import { calcGraphFromAtoms } from "./utils/calcGraphFromAtoms";
import { hideAtoms } from "./utils/hideAtoms";

function useGraph(): [Node[], Edge[]] {
  let { atoms, selectedNode, direction } = useStore();
  console.time("useGraph");
  const visibleAtoms = useMemo(
    () => hideAtoms(selectedNode || "study", atoms),
    [selectedNode, atoms.size]
  );
  console.timeLog("useGraph", "hideAtoms");
  let [nodes, edges] = useMemo(() => calcGraphFromAtoms(visibleAtoms), [visibleAtoms]);
  console.timeLog("useGraph", "calcGraphFromAtoms");
  [nodes, edges] = useMemo(
    () => alignNodes(nodes, edges, direction),
    [nodes, edges, direction, visibleAtoms]
  );
  console.timeEnd("useGraph");
  return [nodes, edges];
}

const nodeTypes = { create: NewNode, delete: DeleteNode };
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
          node.type !== "root" &&
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
