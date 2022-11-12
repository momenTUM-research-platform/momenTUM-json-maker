import produce from "immer";
import { State } from "../state";

export function deleteNode(set: (partial: State | Partial<State> | ((state: State) => State | Partial<State>), replace?: boolean | undefined) => void, get: () => State): (id: string) => void {
    return (id: string) => set(produce((state: State) => {

        const nodesToDelete = [id]

        console.log(nodesToDelete)
        const recursivelyFindIdsOfSubNodes = (id: string) => {
            const{subNodes } = get().getNode(id)
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
        
        state.getNode(get().getNode(id).parent!).subNodes?.filter(n => n !== id) 
        state.nodes = state.nodes.filter(n => !nodesToDelete.find(nodes => nodes === n.id))
        nodesToDelete.forEach(n => state.modules.delete(n) || state.sections.delete(n) || state.questions.delete(n))
        state.study = {...state.study, subNodes:  state.study.subNodes.filter(n => n !== id)}
         
    }))
}