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
import { isModule } from "./utils/typeGuards";
import {
  initialModule,
  initialQuestion,
  initialSection,
  initialStudy,
} from "./utils/initialValues";
import { module } from "../schema/module";
import { section } from "../schema/section";
import { question } from "../schema/question";
import { Atom, Module, Question, Section, Study } from "../types";

export enum Actions {
  Create = "create",
  Count = "count",
  Delete = "delete",
}

export enum Atoms {
  // Properties = "properties",
  Module = "module",
  Section = "section",
  Question = "question",
  PVT = "pvt",
  Study = "study",
}

export interface State {
  selectedNode: string | null; // ID of the currently selected Node
  nodes: Node[];
  edges: Edge[];
  direction: "TB" | "LR";
  validator: ValidateFunction;
  atoms: Map<string, Atom<Study | Question | Module | Section>>;
  calcGraphFromAtoms: (add?: string) => void; // if an id to add is provided, Graph will not be completely recalculated
  hideAllAtoms: (hide?: boolean) => void;
  hideAtom: (id: string, hide?: boolean) => void;
  invertDirection: () => void;
  setStudy: (from: JSON) => void; // Parse from Study JSON file to State, fails on invalid data
  setAtom: (id: string, content: Study | Question | Module | Section) => void;
  addNewNode: (type: Atoms, parent: string) => void;
  deleteNode: (id: string) => void;
  alignNodes: (direction?: string) => void;
  hideAtoms: () => void;
  redraw: () => void;
}

const position = { x: 0, y: 0 }; // Specified position does not matter as overwritten by dagre graph layout

export const useStore = create<State>()(
  //@ts-ignore
  subscribeWithSelector((set, get) => ({
    validator: new Ajv().compile(study),
    direction: "LR",
    atoms: new Map([
      [
        "study",
        {
          parent: null,
          subNodes: [],
          type: Atoms.Study,
          childType: Atoms.Module,
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

    hideAllAtoms: (hide = true) => {
      get().atoms.forEach((_, id) => {
        set(
          produce((state: State) => {
            // @ts-ignore
            state.atoms.get(id)!.hidden = true;
          })
        );
      });
      console.assert(get().atoms.get("study")!.hidden === true);
    },
    hideAtom: (id, hide = true) =>
      set(
        produce((state: State) => {
          console.debug("Hiding: ", id, hide);
          state.atoms.get(id)!.hidden = hide;
        })
      ),

    calcGraphFromAtoms: () => {
      console.assert(get().atoms.get("study")!.hidden === true);
      set(
        produce((state: State) => {
          console.time("calc");
          console.log("Calculating new Graph", state.atoms.size, state.atoms.get("study")?.hidden);
          console.assert(get().atoms.get("study")!.hidden === true);

          let nodes: Node[] = [];
          let edges: Edge[] = [];
          state.atoms.forEach((atom, id) => {
            console.log(id, atom.hidden);
            nodes.push({ id, data: { label: atom.title }, hidden: atom.hidden, position });
            atom.actions.forEach((action) => {
              nodes.push({
                id: id + "_" + action,
                type: action,
                zIndex: 1001,
                hidden: atom.hidden,
                data: { childType: atom.childType, parent: id },
                position,
              });
            });
            atom.subNodes?.forEach((sub) => {
              edges.push({
                id: id + "_->_" + sub,
                source: id,
                target: sub,
                hidden: atom.hidden || state.atoms.get(sub)!.hidden,
              });
            });
          }),
            (state.edges = edges);
          state.nodes = nodes;
          console.timeEnd("calc");
        })
      );
    },

    invertDirection: () => {
      set({ direction: get().direction === "LR" ? "TB" : "LR" });
      get().alignNodes();
    },
    setStudy: (_file) => {},
    addNewNode: (type, parent) => {
      console.time("create");
      const id = nanoid();
      console.debug("Creating new node " + id + " of type " + type + " with parent " + parent);

      set(
        produce((state: State) => {
          switch (type) {
            case Atoms.Module: {
              state.atoms.set(id, {
                parent,
                subNodes: [],
                type: Atoms.Module,
                childType: Atoms.Section,
                title: "New Module",
                schema: module,
                hidden: false,
                actions: new Set([Actions.Create, Actions.Count, Actions.Delete]),
                content: initialModule(id),
              });
              // If no parent exists, you've got a bigger issue
              break;
            }
            case Atoms.Section: {
              state.atoms.set(id, {
                parent,
                subNodes: [],
                type: Atoms.Section,
                childType: Atoms.Question,
                title: "New Section",
                schema: section,
                hidden: false,
                actions: new Set([Actions.Create, Actions.Count, Actions.Delete]),
                content: initialSection(id),
              });
              break;
            }
            case Atoms.Question: {
              state.atoms.set(id, {
                parent,
                subNodes: null,
                type: Atoms.Question,
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
      get().calcGraphFromAtoms();
      get().redraw();
      console.timeEnd("create");
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
          const atom = state.atoms.get(id);
          if (!atom) {
            console.error("Could not find atom " + id);
            return;
          }

          atom.content = content;
          if (isModule(content)) {
            atom.title =
              content.name.length > 32 ? content.name.slice(0, 32) + "..." : content.name;
          }
        })
      ),

    alignNodes: alignNodes(set, get),
    deleteNode: deleteNode(set, get),
    hideAtoms: hideAtoms(set, get),
    redraw: () => {
      useStore.getState().hideAtoms();
      console.assert(useStore.getState().atoms.get("study")!.hidden === true);
      useStore.getState().calcGraphFromAtoms();
      useStore.getState().alignNodes();
    },
  }))
);
