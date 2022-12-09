import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { useStore } from "./state";
import Plus from "../assets/plus";
import Delete from "../assets/delete";

export function NewNode({ data }: NodeProps<{ childType: AtomVariants; parent: string }>) {
  const { addNewNode, atoms } = useStore();
  if (!atoms.get(data.parent)) {
    return <></>;
  }
  const colors: { [key in AtomVariants]: string } = {
    module: "bg-green-500",
    section: "bg-main",
    question: "bg-amber-500",
    study: "bg-black",
  };

  return (
    <div
      className={`${
        colors[data.childType]
      } cursor-cell hover:opacity-80 p-2 fade  rounded-lg h-8 w-8`}
      onClick={() => addNewNode(data.childType, data.parent)}
    >
      <Plus />
    </div>
  );
}

export function CountNode({ data }: NodeProps<{ count: number; parent: string }>) {
  const { atoms } = useStore();
  return (
    <div
      className={` bg-black p-2  text-white text-center pt-1   rounded-lg h-8 w-8`}
      onClick={() => useStore.setState({ selectedNode: data.parent })}
    >
      {atoms.get(data.parent)?.subNodes?.length}
    </div>
  );
}

export function DeleteNode({ data }: NodeProps<{ count: number; parent: string }>) {
  const { deleteNode, atoms } = useStore();
  if (!atoms.get(data.parent)) {
    return <></>;
  }
  return (
    <div
      className={` bg-red-600 hover:opacity-80 p-1 cursor-crosshair text-white rounded-2xl h-6 w-6`}
      onClick={() => deleteNode(data.parent)}
    >
      <Delete />
    </div>
  );
}
