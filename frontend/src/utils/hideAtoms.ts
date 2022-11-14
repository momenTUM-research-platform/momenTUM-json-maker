import produce from "immer";
import { State } from "../state";

export function hideAtoms(
  set: (
    partial: State | Partial<State> | ((state: State) => State | Partial<State>),
    replace?: boolean | undefined
  ) => void,
  get: () => State
): () => void {
  return () =>
    set(
      produce((state: State) => {
        console.time("hide");

        const focus = state.selectedNode;

        //only on first render
        if (!focus) {
          console.timeEnd("hide");
          return;
        }

        console.timeLog("hide", "Show all");
        // Show only subtree of nodes
        const node = state.atoms.get(focus);

        let nodesToShow: string[] = []; // Ids of nodes selected to be shown
        nodesToShow.push(focus);

        const recursivelyFindIdsOfParentNodes = (id: string) => {
          const { parent } = state.atoms.get(id)!;
          if (parent) {
            nodesToShow.push(parent);
            // Get siblings while filtering out itself. BTW, are you your own sibling?
            const siblings = state.atoms.get(parent)!.subNodes;
            siblings && nodesToShow.push(...siblings.filter((s) => s !== id));
            recursivelyFindIdsOfParentNodes(parent);
          }
        };

        const recursivelyFindIdsOfSubNodes = (id: string) => {
          const subs = state.atoms.get(id)!.subNodes;

          if (subs) {
            nodesToShow.push(...subs);
            subs.forEach(recursivelyFindIdsOfSubNodes);
          }
        };

        recursivelyFindIdsOfSubNodes(focus);
        console.timeLog("hide", "Children");
        recursivelyFindIdsOfParentNodes(focus);
        console.timeLog("hide", "Parents");
        // hide all, then unhide subnodes + edges
        console.log(nodesToShow);
        state.hideAllAtoms(true);
        console.assert(get().atoms.get("study")!.hidden === true);
        console.timeLog("hide", "hide all");
        nodesToShow.forEach((a) => state.hideAtom(a, true));

        console.timeLog("hide", "unhide selected nodes");
        console.timeEnd("hide");
        console.assert(get().atoms.get("study")!.hidden === true);
      })
    );
}
