import { NodeProps } from "reactflow";
import React, { useEffect, useState } from "react";
import { useStore } from "../state";
import Plus from "../../assets/plus";
import Delete from "../../assets/delete";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import DialogSelect from "./DialogSelect";


export function NewNode({
  data,
}: NodeProps<{ childType: AtomVariants; parent: string }>) {
  const {
    setSelectedOption,
    addNewNode,
    selectedOption,
    options,
    atoms,
  } = useStore();

  const type = data.childType;
  const parent = data.parent;
  const [dialogVisible, setDialogVisible] = useState(false); // Add a state for controlling the dialog visibility

  const handleShowPopup = () => {
    setDialogVisible(true); // Show the dialog by updating the state
  };

  const handleOptionSelect = (selectedValue: string) => {
    setSelectedOption(selectedValue);
    setDialogVisible(false); // Hide the dialog by updating the state
    addNewNode(type, parent, selectedValue);
  };

  if (!atoms.get(parent)) {
    return <></>;
  }

  const colors: { [key in AtomVariants]: string } = {
    module: "bg-green-500",
    section: "bg-main",
    params: "bg-green-500",
    question: "bg-amber-500",
    study: "bg-black",
    properties: "bg-blue-500",
  };

  return (
    <div
      className={`${colors[type]} cursor-cell hover:opacity-80 p-2 fade  rounded-lg h-8 w-8`}
      onClick={() => {
        if (type === "module") {
          handleShowPopup();
        } else {
          addNewNode(type, parent, "");
        }
      }}
    >
      {dialogVisible && ( // Render the DialogSelect component only when dialogVisible is true
        <DialogSelect
          options={options}
          onSelect={handleOptionSelect}
          onClose={() => setDialogVisible(false)} // Close the dialog by updating the state
        />
      )}
      <Plus />
    </div>
  );
}

export function DeleteNode({ data }: NodeProps<{ parent: string }>) {
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

export function EarlierNode({ data }: NodeProps<{ parent: string }>) {
  const { atoms, moveNode } = useStore();
  if (!atoms.get(data.parent)) {
    return <></>;
  }
  return (
    <div
      className={` bg-blue-600 cursor-cell hover:opacity-80 p-2 fade  rounded-lg h-8 w-8 text-white`}
      onClick={() => moveNode(data.parent, "earlier")}
    >
      <ArrowUpIcon />
    </div>
  );
}

export function LaterNode({ data }: NodeProps<{ parent: string }>) {
  const { atoms, moveNode } = useStore();
  if (!atoms.get(data.parent)) {
    return <></>;
  }
  return (
    <div
      className={` bg-blue-600 cursor-cell hover:opacity-80 p-2 fade  rounded-lg h-8 w-8 text-white`}
      onClick={() => moveNode(data.parent, "later")}
    >
      <ArrowDownIcon />
    </div>
  );
}
