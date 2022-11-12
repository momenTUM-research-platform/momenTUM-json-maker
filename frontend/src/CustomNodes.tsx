import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

import {  Nodes, useStore } from "./state";
import Plus from "../assets/plus";

export function NewNode({ data }: NodeProps<{ type: Nodes; parent: string }>) {
  const {direction, addNewNode} = useStore()


  const colors: { [key in Nodes]: string } = {
    module: "bg-green-500",
    section: "bg-main",
    question: "bg-amber-500",
    properties: "bg-black", // Properties and PVT not in use currently
    pvt: "bg-violet-700",
  };

  return (
    <div
      className={`${colors[data.type]} hover:opacity-80 p-2 rounded-lg h-8 w-8`}
      onClick={() => addNewNode(data.type, data.parent)}
    >

      <Plus /> <Handle type="target" position={direction  === "LR" ? Position.Left: Position.Top} />
    </div>
  );
}


export function CountNode({ data }: NodeProps<{ count: number; parent: string }>) {
  const {direction, getNode} = useStore()
  return (
    <div
      className={` bg-black hover:opacity-80 p-2  text-white text-center pt-1   rounded-lg h-8 w-8`}
      onClick={() => useStore.setState({ selectedNode: data.parent })}
    >

      {getNode(data.parent).subNodes?.length} <Handle type="target" position={direction  === "LR" ? Position.Left: Position.Top} />
    </div>
  );
}