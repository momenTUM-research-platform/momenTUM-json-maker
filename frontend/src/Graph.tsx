import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
// 👇 you need to import the reactflow styles
import "reactflow/dist/style.css";
import { CountNode, NewNode, DeleteNode } from "./CustomNodes";
import { useStore } from "./state";

const nodeTypes = { create: NewNode , count: CountNode, delete: DeleteNode};
export function Graph() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={(_, node) =>
        node.type !== "newNode" && node.type !== "countNode"   && node.type !== "deleteNode" && useStore.setState({ selectedNode: node.id })
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
