import create from "zustand";

import { nanoid } from "nanoid";
import produce from "immer";
import { subscribeWithSelector } from "zustand/middleware";
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

export interface State {
  study: Study;
  selectedNode: string | null; // ID of the currently selected Node
  questions: Map<
    string, Question>
  modules: Map<string, Module>;
  sections: Map<string, Section>;
  nodes: Node[];
  edges: Edge[];
  direction: "TB" | "LR"
  invertDirection: () => void
  setStudy: (from: JSON) => void; // Parse from Study JSON file to State, fails on invalid data
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setProperties: (from: Properties) => void;
  setModule: (from: Module) => void;
  setSection: (from: Section) => void;
  setQuestion: (from: Question) => void;
  addNewNode: (type: Nodes, parent: string) => void;
  hideNode: (id: string, isHidden: boolean) => void
  hideEdge: (id: string, isHidden: boolean) => void
  alignNodes: (direction?: string) => void
  deleteNode: (id: string) => void
  getNode: (id: string) => Module | Section | Question | Study
}

const emptyStudy: Study = {
  properties: {
    study_name: "",
    study_id: nanoid(),
    created_by: "",
    instructions: "",
    post_url: "https://tuspl22-momentum.srv.mwn.de/api/v1",
    empty_msg: "",
    banner_url: "",
    support_url: "",
    support_email: "",
    conditions: ["Control", "Treatment"],
    cache: false,
    ethics: "",
    pls: "",
  },
  modules: [],
  subNodes: [],
  parent: null
};

let initialNodes: Node[] = [
  { id: "properties", position: { x: 200, y: 100 }, data: { label: "Properties" }, hidden: false },
  {
    id: "properties_new_node",
    type: "newNode",
    data: { type: "module", parent: "properties" },
    zIndex: 1001, 
    position: { x: 200, y: 205 }, hidden: false
  },
  {
    id: "properties_count",
    type: "countNode",
    zIndex: 1001, 

    data: { parent: "properties" },
    position: { x: 240, y: 205 }, hidden: false
  },

];

// let initialEdges: Edge[] = [
//   { id: "properties_->_count", source: "properties", target: "properties_count", hidden: false },
//   { id: "properties_->_new_node", source: "properties", target: "properties_new_node", hidden: false },
// ];

export enum Nodes {
  Properties = "properties",
  Module = "module",
  Section = "section",
  Question = "question",
  PVT = "pvt",
}

export const useStore = create<State>()(
  //@ts-ignore
  subscribeWithSelector((set, get) => ({
    direction: "LR",
    study: emptyStudy,
    selectedNode: null,
    modules: new Map,
    sections: new Map,
    questions: new Map,
    nodes: initialNodes,
    edges: [],
    invertDirection: () => {
      set({ direction: get().direction === "LR" ? "TB" : "LR" })
      get().alignNodes()
    },
    setStudy: (_file) => {

    },
    addNewNode: (type, parent) => {
      const id = nanoid();
      switch (type) {
        case Nodes.Module: {
          const module: Module = {
            parent: "properties", // While not correct in the study JSON, where modules and properties are siblings, in the graph properties is the parent. Needed for hiding logic
            id,
            alerts: {
              title: "",
              duration: 0,
              message: "",
              random: false,
              random_interval: 0,
              start_offset: 0,
              sticky: false,
              sticky_label: "",
              timeout: false,
              timeout_after: 0,
              times: [
                {
                  hours: 8,
                  minutes: 30,
                },
              ],
            },
            condition: "",
            graph: {
              display: false,
            },
            name: "",
            sections: [],
            subNodes: [],
            shuffle: false,
            submit_text: "Submit",
            type: "info",
            unlock_after: [],
          };
          set(
            produce((state: State) => {
              state.modules.set(module.id, module);
              state.study.subNodes.push(id);
              state.nodes.push(
                {
                  id,
                  position: { x: 100, y: 200 },
                  data: { label: "New Module" }, hidden: false

                },
                {
                  id: id + "_new_node",
                  type: "newNode",
                  data: { type: "section", parent: id },
                  position: { x: 100, y: 305 }, hidden: false, zIndex: 1001
                }
                , { id: id + "_count", type: "countNode", data: { parent: id }, position: { x: 150, y: 305 }, hidden: false, zIndex: 1001 }, {id: id+ "_delete", type: "deleteNode", data: {parent: id}, zIndex: 1001,  position: {x: 100, y: 100}}
              );

             
            })
          );
          break;
        }
        case Nodes.Section: {
          const section: Section = {
            id,
            name: "",
            questions: [],
            parent,
            subNodes: [],
            shuffle: false,
          };

          set(
            produce((state: State) => {
              state.sections.set(id, section);
              state.modules.get(parent)!.subNodes.push(id);
              state.nodes.push(
                {
                  id,
                  position: { x: 100, y: 300 },
                  data: { label: "New Section" }, hidden: false
                },
                {
                  id: id + "_new_node",
                  zIndex: 1001, 
                  type: "newNode",
                  data: { type: "question", parent: id },
                  position: { x: 100, y: 405 }, hidden: false
                }
                , { id: id + "_count", type: "countNode", data: { parent: id }, position: { x: 150, y: 305 }, hidden: true, zIndex: 1001 }, {id: id+ "_delete", type: "deleteNode", data: {parent: id}, zIndex: 1001,  position: {x: 100, y: 100}}

              );
             

            })
          );
          break;
        }

        case Nodes.Question: {
          const question: TextQuestion = {
            id,
            parent,
            rand_group: "",
            required: true,
            text: "",
            type: "text",
            subtype: "short",
            subNodes: null
          };
          set(
            produce((state: State) => {
              state.questions.set(id, question);
              state.sections.get(parent)!.subNodes.push(id);

              state.nodes.push({
                id,
                position: { x: 100, y: 400 },
                data: { label: "New Question" }, hidden: false
              }, {id: id+ "_delete", type: "deleteNode", data: {parent: id}, position: {x: 100, y: 100}, zIndex: 1001}
              );
            
            })

          );
          break;
        }
      }
      set(
        produce((state: State) => {
          state.edges.push({
            id: parent + "_->_" + id,
            source: parent,
            target: id,
            hidden: false
          });
          state.selectedNode = id;
        })
      );
    },
    // TODO: Update node label on module rename
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
    setProperties: (properties) =>
      set(
        produce((state: State) => {
          state.study.properties = properties;
        })
      ),
    setModule: (module) =>
      set(
        produce((state: State) => {
          state.modules.set(module.id, module);
          const index = state.nodes.findIndex((n) => n.id === module.id);
          state.nodes[index].data.label = module.name.length > 32 ? module.name.slice(0, 32) + "..." : module.name;
        })
      ),
    setSection: (section) =>
      set(
        produce((state: State) => {
          state.sections.set(section.id, section);
        })
      ),
    setQuestion: (question) =>
      set(
        produce((state: State) => {
          state.questions.set(question.id, question);
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
    alignNodes: alignNodes(set, get),  deleteNode: deleteNode(set, get),  getNode: (id) => get().modules.get(id) || get().sections.get(id) || get().questions.get(id) || get().study
  }))
);

const unsubFromSelectedNodes = useStore.subscribe(
  (state) => state.selectedNode,
  (selectedNode) => updateDisplayedNodes(selectedNode)
  , { fireImmediately: false });

useStore.getState().alignNodes()
