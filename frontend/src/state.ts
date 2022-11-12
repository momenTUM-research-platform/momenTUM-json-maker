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
  Position,
} from "reactflow";
import { dagreGraph } from "..";
import dagre from "dagre";

export interface State {
  study: Study;
  selectedNode:  string| null; // ID of the currently selected Node
  questions: Map<
    string,Question>
  modules: Map<string,  Module >;
  sections: Map< string ,Section >;
  nodes: Node[];
  edges: Edge[];
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
  { id: "properties", position: { x: 200, y: 100 }, data: { label: "Properties" } , hidden: false},
  {
    id: "properties_new_node",
    type: "newNode",
    data: { type: "module", parent: "properties" },
    position: { x: 200, y: 205 }, hidden: false
  },
];

let initialEdges: Edge[] = [
  { id: "properties_->_new_node", source: "properties", target: "properties_new_node", hidden: false },
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
    modules: new Map,
    sections: new Map,
    questions: new Map,
    nodes: initialNodes,
    edges: initialEdges,
    setStudy: (_file) => {
      
    },
    addNewNode: (type, parent) => {
      console.log(type, get().selectedNode);
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
              state.modules.set(module.id,  module);
              state.study.subNodes.push(id);
              state.nodes.push(
                {
                  id,
                  position: { x: Object.keys(state.modules).length * 170 + 30, y: 200 },
                  data: { label: "New Module" }, hidden: false
                },
                {
                  id: id + "_new_node",
                  type: "newNode",
                  data: { type: "section", parent: id },
                  position: { x: Object.keys(state.modules).length * 170 + 30, y: 305 }, hidden: false
                }
              );

              state.edges.push({
                id: id + "_->_new_node",
                source: id,
                target: id + "_new_node"
                , hidden: false
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
            parent, 
            subNodes: [],
            shuffle: false,
          };

          set(
            produce((state: State) => {
              state.sections.set(id, section);
              console.log(state.modules.size)
              state.modules.get(parent)!.subNodes.push(id);
              state.nodes.push(
                {
                  id,
                  position: { x: Object.keys(state.sections).length * 170 + 30, y: 300 },
                  data: { label: "New Section" },hidden: false
                },
                {
                  id: id + "_new_node",
                  type: "newNode",
                  data: { type: "question", parent: id },
                  position: { x: 200, y: 405 }, hidden: false
                }
              );
              state.edges.push({
                id: id + "_->_new_node",
                source: id,
                target: id + "_new_node", hidden: false
              });
              
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
              state.questions.set(id , question);
              state.sections.get(parent)!.subNodes.push(id);

              state.nodes.push({
                id,
                position: { x: Object.keys(state.questions).length * 170 + 30, y: 400 },
                data: { label: "New Question" }, hidden: false
              });
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
          state.modules.set(module.id,  module);
          const index = state.nodes.findIndex((n) => n.id === module.id);
          state.nodes[index].data.label = module.name;
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
          state.questions.set(question.id,  question);
        })
      ),
      hideNode: (id, isHidden) => set(produce((state: State) => { 
        console.log(id)
        const index  = state.nodes.findIndex(node => node.id === id) 
        state.nodes[index].hidden  = isHidden 
  })), 
  hideEdge: (id, isHidden) => set(produce((state: State) => { const index  = state.edges.findIndex(node => node.id === id) 
    console.log(index, id, isHidden)
    state.edges[index].hidden  = isHidden
})), 
alignNodes: (direction = "TB") =>  set(produce((state: State) => {

const nodeWidth = 172;
const nodeHeight = 36;
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  state.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  state.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  

  state.nodes.forEach((node) => {
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
  })
}))
  }))
);

const unsubFromSelectedNodes = useStore.subscribe(
  (state) => state.selectedNode,
  (selectedNode) => updateDisplayedNodes(selectedNode)
, { fireImmediately: false});

// Is it possible to write this generically with TS?
// const hide = (hidden: boolean) => <T, >(nodeOrEdge: Node|Edge) =>  {
//   nodeOrEdge.hidden = hidden;
//   return nodeOrEdge;
// };

// const hideNode = (hidden: boolean) => (node: Node) => {
//   console.log(hidden, node.hidden ,node.id)
//   node.hidden = hidden;
//   return node;
// };
// const hideEdge = (hidden: boolean) => (edge: Edge) => {
//   console.log(hidden, edge.hidden ,edge.id)
//   edge.hidden = hidden;
//   return edge;
// };
function updateDisplayedNodes(selectedNode: State["selectedNode"]) {
  console.log("Rendering....")
  const { nodes, edges, modules, sections, questions, hideEdge, hideNode, study } = useStore.getState();

  // Show all nodes
  if (!selectedNode || selectedNode === "properties") {
    nodes.map( node => hideNode(node.id, false))
     edges.map( edge => hideEdge(edge.id, false)) ;
    return;
  }


  const getNode = (id: string)  :  Module | Section | Question | Study => {
    return modules.get(id) || sections.get(id) || questions.get(id) || study
  }

    // Show only subtree of nodes
    const node = getNode(selectedNode)

  let nodesToShow: string[] = []; // Ids of nodes selected to be shown
  nodesToShow.push(selectedNode)

const recursivelyFindIdsOfParentNodes  = (id: string) => {
  const parent = getNode(id).parent

  if (parent) {
  nodesToShow.push(parent)
  nodesToShow.push(parent + "_new_node")
  recursivelyFindIdsOfParentNodes(parent)
  }
}

  const recursivelyFindIdsOfSubNodes = (id: string) => {
    const subs = getNode(id).subNodes
    console.log(subs)

    if (subs) {
      nodesToShow.push(id + "_new_node") // Add "newNode" to displayed nodes 

    nodesToShow.push(...subs)
    subs.forEach(recursivelyFindIdsOfSubNodes);
    ;
    }
  };


 recursivelyFindIdsOfSubNodes(selectedNode);
 recursivelyFindIdsOfParentNodes(selectedNode);

 let edgesToShow = edges.filter((e) => nodesToShow.find((n) => e.target === n || e.source=== n )); // This is O(n**2), can it be better?
  console.log(edgesToShow)
  // hide all, then unhide subnodes + edges
  nodes.map( node => hideNode(node.id, true))
  edges.map( edge => hideEdge(edge.id, true)) ;
   nodesToShow.map(node => hideNode(node, false))
    edgesToShow.map( edge => hideEdge(edge.id, false)) ;

  useStore.getState().alignNodes();
}