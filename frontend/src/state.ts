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
import { updateDisplayedNodes } from "./utils/hideNodes";
import { deleteNode } from "./utils/deleteNode";
import { study } from "../schema/study"
import { isModule } from "./utils/typeGuards";
import { initialModule, initialQuestion, initialSection, initialStudy } from "./utils/initialValues";
import { module } from "../schema/module";
import { section } from "../schema/section";
import { question } from "../schema/question";

export interface State {
  // study: Study;
  selectedNode: string | null; // ID of the currently selected Node
  // questions: Map<
  //   string, Question>
  // modules: Map<string, Module>;
  // sections: Map<string, Section>;
  nodes: Node[];
  edges: Edge[];
  direction: "TB" | "LR"
  validator: ValidateFunction

  atoms: Map<string, Atom<Study | Question | Module | Section>>

  calcGraphFromAtoms: () => void
  invertDirection: () => void
  setStudy: (from: JSON) => void; // Parse from Study JSON file to State, fails on invalid data
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setAtom: (id: string, content: Study | Question | Module | Section) => void,
  addNewNode: (type: Atoms, parent: string) => void;
  hideNode: (id: string, isHidden: boolean) => void
  hideEdge: (id: string, isHidden: boolean) => void
  alignNodes: (direction?: string) => void
  deleteNode: (id: string) => void
  // getNode: (id: string) => Atom<Module | Section | Question | Study | null>
}



const position = { x: 0, y: 0 } // Specified position does not matter as overwritten by dagre graph layout


export const useStore = create<State>()(
  //@ts-ignore
  subscribeWithSelector((set, get) => ({
    validator: new Ajv().compile(study),

    direction: "LR",
    atoms: new Map([["study", { parent: null, subNodes: [], type: Atoms.Study, title: "Properties", schema: study, hidden: false, actions: new Set([Actions.Create, Actions.Count]), content: initialStudy(nanoid()) }]]),
    selectedNode: null,
    nodes: [],
    edges: [],




    calcGraphFromAtoms: () => set(produce((state: State) => {
      let nodes: Node[] = []
      let edges: Edge[] = []

      state.atoms.forEach((atom, id) => {
        nodes.push({ id, data: { label: atom.title }, hidden: atom.hidden, position })
        atom.actions.forEach(action => {
          nodes.push({ id: id + "_" + action, type: action, zIndex: 1001, hidden: atom.hidden, data: { type: atom.type, parent: id }, position })
          edges.push({
            id: id + "_->_" + action,
            source: id,
            target: id + "_" + action,
            hidden: atom.hidden
          })
        })
        atom.subNodes?.forEach(sub => {
          edges.push({ id: id + "_->_" + sub, source: id, target: sub, hidden: atom.hidden }

          )

        })
      }),
        state.edges = edges
      state.nodes = nodes
    })),

    invertDirection: () => {
      set({ direction: get().direction === "LR" ? "TB" : "LR" })
      get().alignNodes()
    },
    setStudy: (_file) => {

    },
    addNewNode: (type, parent) => {
      const id = nanoid();
      switch (type) {
        case Atoms.Module: {
          
          set(
            produce((state: State) => {
              state.atoms.set(id, {parent, subNodes: [], type: Atoms.Module, title: "New Module", schema: module, hidden: false, actions: new Set([Actions.Create, Actions.Count, Actions.Delete]), content:  initialModule(id)});
               // If no parent exists, you've got a bigger issue
            })
          );
          break;
        }
        case Atoms.Section: {
          set(
            produce((state: State) => {
              state.atoms.set(id, {parent, subNodes: [], type: Atoms.Section, title: "New Section", schema: section, hidden: false,actions: new Set([Actions.Create, Actions.Count, Actions.Delete]), content: initialSection(id) });
              
            })
          );
          break;
        }

        case Atoms.Question: {
          
          set(
            produce((state: State) => {
              state.atoms.set(id, {parent, subNodes: null, type: Atoms.Question, title: "New Question", schema: question, hidden: false,actions: new Set([ Actions.Delete]), content: initialQuestion(id) });
            })

          );
          break;
        }
      }
      // Actions for all types
      set(
        produce((state: State) => {
          state.atoms.get(parent)!.subNodes!.push(id);
          state.selectedNode = id;
        })
      );
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
          const atom = state.atoms.get(id)
          if (!atom) {
            console.error("Could not find atom " + id)
            return
          }

          atom.content = content;
          if (isModule(content)) {
            atom.title = content.name.length > 32 ? content.name.slice(0, 32) + "..." : content.name;
          }
        })
      ),


    hideNode: (id, isHidden) => set(produce((state: State) => {
      const index = state.nodes.findIndex(node => node.id === id)
      state.nodes[index].hidden = isHidden
    })),
    hideEdge: (id, isHidden) => set(produce((state: State) => {
      const index = state.edges.findIndex(node => node.id === id)
      state.edges[index].hidden = isHidden
    })),
    alignNodes: alignNodes(set, get), deleteNode: deleteNode(set, get),
    // getNode: (id) => get().atoms.get(id) || null
  }))
);

const unsubFromSelectedNodes = useStore.subscribe(
  (state) => state.selectedNode,
  (selectedNode) => updateDisplayedNodes(selectedNode)

  , { fireImmediately: false });
useStore.getState().calcGraphFromAtoms()
useStore.getState().alignNodes()

