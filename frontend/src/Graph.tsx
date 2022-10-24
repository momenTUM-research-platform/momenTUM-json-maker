import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
// 👇 you need to import the reactflow styles
import "reactflow/dist/style.css";
import { NewNode } from "./NewNode";
import { useStore } from "./state";

const nodeTypes = { newNode: NewNode };
export function Graph() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={(_, node) =>
        node.type !== "newNode" && useStore.setState({ selectedNode: node.id })
      }
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
