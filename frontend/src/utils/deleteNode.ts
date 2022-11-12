import produce from "immer";
import { State } from "../state";

export function deleteNode(set: (partial: State | Partial<State> | ((state: State) => State | Partial<State>), replace?: boolean | undefined) => void, get: () => State): (id: string) => void {
    return (id: string) => set(produce((state: State) => {

        const nodesToDelete = [id]

        console.log(nodesToDelete)
        const recursivelyFindIdsOfSubNodes = (id: string) => {
            const subs = get().getNode(id).subNodes
            nodesToDelete.push(id + "_delete")

            if (subs) {
                nodesToDelete.push(id + "_new_node") // Add "newNode" to displayed nodes 
                nodesToDelete.push(id + "_count")
                nodesToDelete.push(...subs)
                  subs.forEach(recursivelyFindIdsOfSubNodes);
                ;
            }
        };


        recursivelyFindIdsOfSubNodes(id);

        state.nodes = state.nodes.filter(n => !nodesToDelete.find(nodes => nodes === n.id))
        nodesToDelete.forEach(n => state.modules.delete(n) || state.sections.delete(n) || state.questions.delete(n))

    }))
}