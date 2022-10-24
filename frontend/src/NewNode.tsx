import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { Nodes, useStore } from "./state";
import Plus from "../assets/plus";

export function NewNode({ data }: NodeProps<{ type: Nodes; parent: string }>) {
  const addNewNode = useStore((state) => state.addNewNode);

  const colors: { [key in Nodes]: string } = {
    module: "bg-green-500",
    section: "bg-main",
    question: "bg-amber-500",
    properties: "bg-black", // Properties and PVT not in use currently
    pvt: "bg-violet-700",
  };

  return (
    <div
      className={`${colors[data.type]} hover:opacity-80 p-2 rounded-lg`}
      onClick={() => addNewNode(data.type, data.parent)}
    >
      <Plus /> <Handle type="target" position={Position.Top} />
    </div>
  );
}
