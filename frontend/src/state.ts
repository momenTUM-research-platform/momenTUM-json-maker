import create from "zustand";

import { nanoid } from "nanoid";
import produce from "immer";
import Ajv, { ValidateFunction } from "ajv";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "reactflow";
import { alignNodes } from "./utils/alignNodes";
import { hideAtoms } from "./utils/hideAtoms";
import { deleteNode } from "./utils/deleteNode";
import { study } from "../schema/study";
import { isModule, isQuestion, isSection } from "./utils/typeGuards";
import {
  initialModule,
  initialQuestion,
  initialSection,
  initialStudy,
} from "./utils/initialValues";
import { calcGraphFromAtoms } from "./utils/calcGraphFromAtoms";

export interface State {
  selectedNode: string | null; // ID of the currently selected Node
  mode: Mode;
  nodes: Node[];
  edges: Edge[];
  direction: "TB" | "LR";
  validator: ValidateFunction;
  atoms: Atoms;
  conditions: string[];
  modal: null | "download" | "upload";
  invertDirection: () => void;
  invertMode: () => void;
  setAtom: (id: string, content: Study | Question | Module | Section) => void;
  setAtoms: (atoms: Atoms) => void;
  setModal: (value: null | "upload" | "download") => void;
  saveAtoms: () => void;
  addNewNode: (type: AtomVariants, parent: string) => void;
  deleteNode: (id: string) => void;
}

export const useStore = create<State>()((set, get) => ({
  conditions: ["*", "Treatment", "Control"],
  modal: null,
  validator: new Ajv().compile(study),
  direction: "LR",
  mode: "graph",
  atoms: new Map([
    [
      "study",
      {
        parent: null,
        subNodes: [],
        type: "study",
        childType: "module",
        title: "Properties",
        hidden: false,
        actions: ["create", "count"],
        content: initialStudy(nanoid()),
      },
    ],
  ]),
  selectedNode: null,
  nodes: [],
  edges: [],

  invertDirection: () => {
    set({ direction: get().direction === "LR" ? "TB" : "LR" });
    redraw();
  },
  invertMode: () => {
    set({ mode: get().mode === "graph" ? "timeline" : "graph" });
    redraw();
  },
  addNewNode: (type, parent) => {
    const id = nanoid();
    console.debug("Creating new node " + id + " of type " + type + " with parent " + parent);

    set(
      produce((state: State) => {
        switch (type) {
          case "module": {
            state.atoms.set(id, {
              parent,
              subNodes: [],
              type: "module",
              childType: "section",
              title: "New Module",
              hidden: false,
              actions: ["create", "count", "delete"],
              content: initialModule(id),
            });
            // If no parent exists, you've got a bigger issue
            break;
          }
          case "section": {
            state.atoms.set(id, {
              parent,
              subNodes: [],
              type: "section",
              childType: "question",
              title: "New Section",
              hidden: false,
              actions: ["create", "count", "delete"],
              content: initialSection(id),
            });
            break;
          }
          case "question": {
            state.atoms.set(id, {
              parent,
              subNodes: null,
              type: "question",
              childType: null,
              title: "New Question",
              hidden: false,
              actions: ["delete"],
              content: initialQuestion(id),
            });
            break;
          }
        }
        state.atoms.get(parent)!.subNodes!.push(id);
      })
    );
    get().selectedNode = id;
    redraw();
    //  console.timeEnd("create");
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setAtom: (id, content) =>
    set(
      produce((state: State) => {
        const atom = state.atoms.get(id)!;
        atom.content = content;
        if ((isSection(content) || isModule(content)) && content.name) {
          atom.title = content.name.length > 32 ? content.name.slice(0, 32) + "..." : content.name;
        }
        if (isQuestion(content) && content.text) {
          atom.title = content.text.length > 32 ? content.text.slice(0, 60) + "..." : content.text;
        }
      })
    ),
  setAtoms(atoms) {
    set(
      produce((state: State) => {
        state.atoms = atoms;
      })
    );
  },
  setModal(value) {
    set({ modal: value });
  },
  saveAtoms: async () => {
    console.log("saving to local storage");
    // Saving all atoms takes some time and we don't want it to block rendering changes to atoms
    localStorage.setItem("atoms", JSON.stringify([...get().atoms]));
  },

  deleteNode: deleteNode(set, get),
}));

export function redraw() {
  let { atoms, selectedNode, direction, mode } = useStore.getState();
  console.log(atoms);
  // @ts-ignore Existence is guaranteed, but can't be expressed in typescript
  let properties = atoms.get("study")!.content.properties;
  selectedNode = selectedNode || "study";
  atoms = hideAtoms(selectedNode, atoms);
  let [nodes, edges] = calcGraphFromAtoms(atoms);
  [nodes, edges] = alignNodes(nodes, edges, direction);
  useStore.setState({ nodes, edges });
}
