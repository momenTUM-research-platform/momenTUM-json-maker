import * as dagre from "dagre";
import { Edge, Node, Position } from "reactflow";

export function alignNodes(nodes: Node[], edges: Edge[], direction: string): [Node[], Edge[]] {
  const dagreGraph = new dagre.graphlib.Graph({ directed: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 36;

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({
    rankdir: direction,
    marginx: 100,
    marginy: 200,
    compound: true,
    ranker: "tight-tree",
    nodesep: 70,
  });

  // Action nodes will be placed manually
  const nodesToPosition = nodes.filter(
    (n) =>
      !(
        n.hidden ||
        n.type === "create" ||
        n.type === "delete" ||
        n.type === "earlier" ||
        n.type === "later"
      )
  );

  nodesToPosition.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
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

  nodes
    .filter((n) => n.type === "create")
    .forEach((node) => {
      const parent = nodes.find((n) => n.id === node.id.slice(0, -7))!; // removing _create from the id to gain parent

      node.position = {
        x: parent.position.x + 10,
        y: parent.position.y - 25,
      };
    });
  nodes
    .filter((n) => n.type === "delete")
    .forEach((node) => {
      const parent = nodes.find((n) => n.id === node.id.slice(0, -7))!; // removing _delete from the id to gain parent

      node.position = {
        x: parent.position.x + 135,
        y: parent.position.y - 10,
      };
    });

  nodes
    .filter((n) => n.type === "earlier")
    .forEach((node) => {
      const parent = nodes.find((n) => n.id === node.id.slice(0, -8))!; // removing _earlier from the id to gain parent
      node.position = {
        x: parent.position.x + 50,
        y: parent.position.y - 25,
      };
    });

  nodes
    .filter((n) => n.type === "later")
    .forEach((node) => {
      const parent = nodes.find((n) => n.id === node.id.slice(0, -6))!; // removing _later from the id to gain parent
      node.position = {
        x: parent.position.x + 90,
        y: parent.position.y - 25,
      };
    });
  return [nodes, edges];
}
