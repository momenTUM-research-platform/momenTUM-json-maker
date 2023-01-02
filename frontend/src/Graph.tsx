import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
// 👇 you need to import the reactflow styles
import "reactflow/dist/style.css";
import { NewNode, DeleteNode } from "./CustomNodes";
import { redraw, useStore } from "./state";

const nodeTypes = { create: NewNode, delete: DeleteNode };
export function Graph() {
  const { nodes, edges } = useStore();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodesDraggable={false}
      nodeOrigin={[0, 0]}
      onNodeClick={(_, node) => {
        node.type !== "create" &&
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
