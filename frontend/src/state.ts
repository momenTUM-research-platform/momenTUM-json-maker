import create from "zustand";

import { nanoid } from "nanoid";
import produce from "immer";
import { subscribeWithSelector } from "zustand/middleware";
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
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
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
import { module } from "../schema/module";
import { section } from "../schema/section";
import { question } from "../schema/question";
import { calcGraphFromAtoms } from "./utils/calcGraphFromAtoms";
import { calcTimelineFromAtoms } from "./utils/calcTimelineFromAtoms";

export enum Actions {
  Create = "create",
  Count = "count",
  Delete = "delete",
}

export enum AtomVariants {
  // Properties = "properties",
  Module = "module",
  Section = "section",
  Question = "question",
  PVT = "pvt",
  Study = "study",
}

export enum Mode {
  Graph = "graph",
  Timeline = "timeline",
}

export interface State {
  selectedNode: string | null; // ID of the currently selected Node
  mode: Mode;
  nodes: Node[];
  edges: Edge[];
  direction: "TB" | "LR";
  validator: ValidateFunction;
  atoms: Atoms;
  days: Day[];
  invertDirection: () => void;
  invertMode: () => void;
  setStudy: (from: JSON) => void; // Parse from Study JSON file to State, fails on invalid data
  setAtom: (id: string, content: Study | Question | Module | Section) => void;
  setAtoms: (atoms: Atoms) => void;
  addNewNode: (type: AtomVariants, parent: string) => void;
  deleteNode: (id: string) => void;
}

export const useStore = create<State>()((set, get) => ({
  validator: new Ajv().compile(study),
  direction: "LR",
  mode: Mode.Graph,
  atoms: new Map([
    [
      "study",
      {
        parent: null,
        subNodes: [],
        type: AtomVariants.Study,
        childType: AtomVariants.Module,
        title: "Properties",
        schema: study,
        hidden: false,
        actions: new Set([Actions.Create, Actions.Count]),
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
    set({ mode: get().mode === Mode.Graph ? Mode.Timeline : Mode.Graph });
    redraw();
  },

  setStudy: (_file) => {},
  addNewNode: (type, parent) => {
    const id = nanoid();
    console.debug("Creating new node " + id + " of type " + type + " with parent " + parent);

    set(
      produce((state: State) => {
        switch (type) {
          case AtomVariants.Module: {
            state.atoms.set(id, {
              parent,
              subNodes: [],
              type: AtomVariants.Module,
              childType: AtomVariants.Section,
              title: "New Module",
              schema: module,
              hidden: false,
              actions: new Set([Actions.Create, Actions.Count, Actions.Delete]),
              content: initialModule(id),
            });
            // If no parent exists, you've got a bigger issue
            break;
          }
          case AtomVariants.Section: {
            state.atoms.set(id, {
              parent,
              subNodes: [],
              type: AtomVariants.Section,
              childType: AtomVariants.Question,
              title: "New Section",
              schema: section,
              hidden: false,
              actions: new Set([Actions.Create, Actions.Count, Actions.Delete]),
              content: initialSection(id),
            });
            break;
          }
          case AtomVariants.Question: {
            state.atoms.set(id, {
              parent,
              subNodes: null,
              type: AtomVariants.Question,
              childType: null,
              title: "New Question",
              schema: question,
              hidden: false,
              actions: new Set([Actions.Delete]),
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
        localStorage.setItem("atoms", JSON.stringify([...state.atoms]));
      })
    ),
  setAtoms(atoms) {
    set(
      produce((state: State) => {
        state.atoms = atoms;
      })
    );
  },
  deleteNode: deleteNode(set, get),
  days: [],
}));

export function redraw() {
  let { atoms, selectedNode, direction, mode } = useStore.getState();
  // @ts-ignore Existence is guaranteed, but can't be expressed in typescript
  let properties = atoms.get("study")!.content.properties;
  selectedNode = selectedNode || "study";
  atoms = hideAtoms(selectedNode, atoms);
  let [nodes, edges] = calcGraphFromAtoms(atoms);
  [nodes, edges] = alignNodes(nodes, edges, direction);
  const days = calcTimelineFromAtoms(atoms, properties);
  useStore.setState({ nodes, edges, days });
}
