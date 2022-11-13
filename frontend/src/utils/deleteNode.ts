import produce from "immer";
import { State, useStore } from "../state";

export function deleteNode(set: (partial: State | Partial<State> | ((state: State) => State | Partial<State>), replace?: boolean | undefined) => void, get: () => State): (id: string) => void {
    const { nodes, edges, hideEdge, hideNode, atoms } = useStore.getState();

    return (id: string) => set(produce((state: State) => {
        const parentId = atoms.get(id)?.parent
        const nodesToDelete = [id]

        console.log(nodesToDelete)
        const recursivelyFindIdsOfSubNodes = (id: string) => {
            const { subNodes } = atoms.get(id)!
            nodesToDelete.push(id + "_delete")

            if (subNodes) {
                nodesToDelete.push(id + "_new_node") // Add "newNode" to displayed nodes 
                nodesToDelete.push(id + "_count")
                nodesToDelete.push(...subNodes)
                subNodes.forEach(recursivelyFindIdsOfSubNodes);
                ;
            }
        };


        recursivelyFindIdsOfSubNodes(id);

        state.nodes = state.nodes.filter(n => !nodesToDelete.find(nodes => nodes === n.id))
        nodesToDelete.forEach(n => state.atoms.delete(n))

        if (parentId) {
            const parent = atoms.get(parentId)!
            atoms.set(parentId, { ...parent, subNodes: parent.subNodes!.filter(s => s !== id) })


        }
    }))
}