import produce from "immer";
import { State } from "../state";

export function deleteNode(set: (partial: State | Partial<State> | ((state: State) => State | Partial<State>), replace?: boolean | undefined) => void, get: () => State): (direction?: string) => void {
    return (id: string) => set(produce((state: State) => {
            
    }))}