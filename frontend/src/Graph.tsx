import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
// 👇 you need to import the reactflow styles
import "reactflow/dist/style.css";
import { CountNode, NewNode, DeleteNode } from "./CustomNodes";
import { useStore } from "./state";

const nodeTypes = { create: NewNode, count: CountNode, delete: DeleteNode };
export function Graph() {
  const { nodes, edges, redraw } = useStore();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodesDraggable={false}
      nodeOrigin={[0, 0]}
      onNodeClick={(_, node) => {
        node.type !== "create" &&
          node.type !== "count" &&
          node.type !== "delete" &&
          useStore.setState({ selectedNode: node.id });
        redraw();
      }}
      nodeTypes={nodeTypes}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
