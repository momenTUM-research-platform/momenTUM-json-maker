import dagre from "dagre";
import produce from "immer";
import { Position } from "reactflow";
import {State} from "../state"

export function alignNodes(set: (partial: State | Partial<State> | ((state: State) => State | Partial<State>), replace?: boolean | undefined) => void, get: () => State): (direction?: string) => void {
    return () => set(produce((state: State) => {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
  
      const nodeWidth = 172;
      const nodeHeight = 36;
  
      const isHorizontal = get().direction === "LR";
      dagreGraph.setGraph({ rankdir: get().direction });

      // Action nodes will be placed manually 
      const nodesToPosition = state.nodes.filter(n => !(n.hidden || n.type === "create" || n.type === "count" || n.type === "delete"))
  
      nodesToPosition.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });
  
      state.edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });
  
      dagre.layout(dagreGraph);
  

      nodesToPosition.forEach((node) => {
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
  
      state.nodes.filter(n => n.type === "count").forEach((node) => {
        const parent = state.nodes.find(n => n.id === node.id.slice(0, -6))!; // removing _count from the id to gain parent
        node.position = {
          x: parent.position.x + 50,
          y: parent.position.y  -25
        };
      });
      state.nodes.filter(n => n.type === "create").forEach((node) => {
        const parent = state.nodes.find(n => n.id === node.id.slice(0, -7))!; // removing _create from the id to gain parent
  
        node.position = {
          x: parent.position.x + 10,
          y: parent.position.y  -25
        };
      });
      state.nodes.filter(n => n.type === "delete").forEach((node) => {
        const parent = state.nodes.find(n => n.id === node.id.slice(0, -7))!; // removing _delete from the id to gain parent
  
        node.position = {
          x: parent.position.x  + 135,
          y: parent.position.y  -10
        };
      });
    }));
  }