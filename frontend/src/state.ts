import create from "zustand";
import dagre from "dagre";

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
  Position,
} from "reactflow";

export interface State {
  study: Study;
  selectedNode: string | null; // ID of the currently selected Node
  questions: {
    [id: string]: Question;
  };
  modules: { [id: string]: Module };
  sections: { [id: string]: Section };
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setProperties: (from: Properties) => void;
  setModule: (from: Module) => void;
  setSection: (from: Section) => void;
  setQuestion: (from: Question) => void;
  addNewNode: (type: Nodes, parent: string) => void;
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
};

const initialNodes: Node[] = [
  { id: "properties", position: { x: 200, y: 100 }, data: { label: "Properties" } },
  {
    id: "new_module",
    type: "newNode",
    data: { type: "module", parent: "properties" },
    position: { x: 200, y: 205 },
  },
];

const initialEdges: Edge[] = [
  { id: "properties_->_new_module", source: "properties", target: "new_module" },
];

export enum Nodes {
  Properties = "properties",
  Module = "module",
  Section = "section",
  Question = "question",
  PVT = "pvt",
}

export const useStore = create<State>()(
  subscribeWithSelector((set, get) => ({
    study: emptyStudy,
    selectedNode: null,
    modules: {},
    sections: {},
    questions: {},
    nodes: initialNodes,
    edges: initialEdges,
    addNewNode: (type, parent) => {
      console.log(type, get().selectedNode);
      const id = nanoid();
      switch (type) {
        case Nodes.Module: {
          const module: Module = {
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
              state.modules[id] = module;
              state.study.subNodes.push(id);
              state.nodes.push(
                {
                  id,
                  position: { x: Object.keys(state.modules).length * 170 + 30, y: 200 },
                  data: { label: "New Module" },
                },
                {
                  id: id + "new_section",
                  type: "newNode",
                  data: { type: "section", parent: id },
                  position: { x: Object.keys(state.modules).length * 170 + 30, y: 305 },
                }
              );

              state.nodes.find((node) => node.id === "new_module")!.position.x += 170;
              state.edges.push({
                id: id + "_->_new_section",
                source: id,
                target: id + "new_section",
              });
            })
          );
          break;
        }
        case Nodes.Section: {
          const section: Section = {
            id,
            name: "",
            questions: [],
            subNodes: [],
            shuffle: false,
          };

          set(
            produce((state: State) => {
              state.sections[id] = section;
              state.modules[parent].subNodes.push(id);
              state.nodes.push(
                {
                  id,
                  position: { x: Object.keys(state.sections).length * 170 + 30, y: 300 },
                  data: { label: "New Section" },
                },
                {
                  id: id + "new_question",
                  type: "newNode",
                  data: { type: "question", parent: id },
                  position: { x: 200, y: 405 },
                }
              );
              state.edges.push({
                id: id + "_->_new_question",
                source: id,
                target: id + "new_section",
              });
              state.nodes.find(
                (node) => node.id === state.selectedNode + "new_section"
              )!.position.x += 170;
            })
          );
          break;
        }

        case Nodes.Question: {
          const question: TextQuestion = {
            id,
            rand_group: "",
            required: true,
            text: "",
            type: "text",
            subtype: "short",
          };
          set(
            produce((state: State) => {
              state.questions[id] = question;
              state.sections[parent].subNodes.push(id);

              state.nodes.push({
                id,
                position: { x: Object.keys(state.questions).length * 170 + 30, y: 400 },
                data: { label: "New Question" },
              });
              state.nodes.find((node) => node.id === "new_question")!.position.x += 170;
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
          state.modules[module.id] = module;
          const index = state.nodes.findIndex((n) => n.id === module.id);
          state.nodes[index].data.label = module.name;
        })
      ),
    setSection: (section) =>
      set(
        produce((state: State) => {
          state.sections[section.id] = section;
        })
      ),
    setQuestion: (question) =>
      set(
        produce((state: State) => {
          state.questions[question.id] = question;
        })
      ),
  }))
);

const unsubFromSelectedNodes = useStore.subscribe(
  (state) => state.selectedNode,
  (selectedNode) => updateDisplayedNodes(selectedNode)
);

// Is it possible to write this generically with TS?
// const hide = (hidden: boolean) => <T, >(nodeOrEdge: Node|Edge) =>  {
//   nodeOrEdge.hidden = hidden;
//   return nodeOrEdge;
// };

const hideNode = (hidden: boolean) => (node: Node) => {
  node.hidden = hidden;
  return node;
};
const hideEdge = (hidden: boolean) => (edge: Edge) => {
  edge.hidden = hidden;
  return edge;
};
function updateDisplayedNodes(selectedNode: State["selectedNode"]) {
  const { nodes, edges, modules, sections, questions } = useStore.getState();

  // Show all nodes
  if (!selectedNode || "properties") {
    useStore.setState({ nodes: nodes.map(hideNode(false)), edges: edges.map(hideEdge(false)) });
    return;
  }

  // Show only subtree of nodes
  const node: Module | Section | Question =
    modules[selectedNode] || sections[selectedNode] || questions[selectedNode];

  let subNodes: Node[] = [];
  const recursivelyFindSubNodes = (node: Module | Section | Question) => {
    if (!node["subNodes"]) return;
    node["subNodes"].forEach((sub: string) => {
      subNodes.push(nodes.find((n) => (n.id = sub))!);
      const n = sections[sub] || questions[sub];
      recursivelyFindSubNodes(n);
    });
  };
  recursivelyFindSubNodes(node);

  let subEdges = edges.filter((e) => subNodes.forEach((n) => e.id.includes(n.id))); // This is O(n**2), can it be better?

  // hide all, then unhide subnodes + edges
  useStore.setState({ nodes: nodes.map(hideNode(true)), edges: edges.map(hideEdge(true)) });
  useStore.setState({ nodes: subNodes.map(hideNode(false)), edges: subEdges.map(hideEdge(false)) });

  alignNodes(nodes, edges);
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

function alignNodes(nodes: Node[], edges: Edge[], direction = "TB") {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });
}
