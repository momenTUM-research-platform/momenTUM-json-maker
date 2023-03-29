import create from "zustand";

import { customAlphabet } from "nanoid";
import produce from "immer";
import { deleteNode } from "./utils/deleteNode";
import { study } from "../schema/study";
import { isModule, isQuestion, isSection, isProperties } from "./types/guards";
import {
  initialModule,
  initialQuestion,
  initialSection,
  initialProperties,
} from "./helpers/initialValues";
import { DeleteNode, EarlierNode, LaterNode, NewNode } from "./renderers/CustomNodes";
// Custom alphabet required for redcap handling of ids; they don't allow capital letters or hyphens
const nanoid = customAlphabet("0123456789_abcdefghijklmnopqrstuvwxyz", 16);
export const nodeTypes = {
  create: NewNode,
  delete: DeleteNode,
  earlier: EarlierNode,
  later: LaterNode,
};

export interface State {
  selectedNode: string | null; // ID of the currently selected Node
  mode: Mode;
  forceRedraw: number;
  direction: "TB" | "LR";
  atoms: Atoms;
  conditions: string[];
  modal: null | "download" | "upload" | "qr" | "redcap";
  permalink: string | null;
  liveValidation: boolean;
  editableIds: boolean;
  showHidingLogic: boolean;
  invertDirection: () => void;
  invertMode: () => void;
  setAtom: (id: string, content: Properties | Question | Module | Section) => void;
  setAtoms: (atoms: Atoms) => void;
  setModal: (value: null | "upload" | "download" | "qr" | "redcap") => void;
  saveAtoms: () => void;
  addNewNode: (type: AtomVariants, parent: string) => void;
  deleteNode: (id: string) => void;
  setPermalink: (permalink: string) => void;
  setLiveValidation: (value: boolean) => void;
  setIdsEditable: (value: boolean) => void;
  setShowHidingLogic: (value: boolean) => void;
  moveNode: (id: string, direction: "earlier" | "later") => void;
}

export const useStore = create<State>()((set, get) => ({
  forceRedraw: 0, // This is a hack to force a redraw of the graph. Just increment this when the graph needs to be redrawn.
  permalink: null,
  editableIds: false,
  liveValidation: true,
  showHidingLogic: false,
  setLiveValidation: (value) => set({ liveValidation: value }),
  setShowHidingLogic: (value) => set({ showHidingLogic: value }),
  setIdsEditable: (value) => set({ editableIds: value }),
  conditions: ["*", "Treatment", "Control"],
  modal: null,
  direction: "LR",
  mode: "graph",
  atoms: new Map([
    [
      "study",
      {
        parent: null,
        subNodes: ["properties"], // This is not quite correct as it also has one child of type properties. It is added manually when calculating the graph.
        type: "study",
        childType: "module", // Not quite correct as it also has one child of type properties
        title: "Study",
        hidden: false,
        actions: ["create"],
        content: {
          // These will not be used, but are required for typechecking.
          properties: {} as Properties,
          modules: [],
          _type: "study",
        },
      },
    ],
    [
      "properties",
      {
        parent: "study",
        subNodes: null,
        type: "properties",
        childType: null,
        title: "Properties",
        hidden: false,
        actions: [],
        content: initialProperties,
      },
    ],
  ]),
  selectedNode: null,

  invertDirection: () => {
    set({ direction: get().direction === "LR" ? "TB" : "LR" });
  },
  invertMode: () => {
    set({ mode: get().mode === "graph" ? "timeline" : "graph" });
  },
  addNewNode: (type, parent) => {
    const id = nanoid();

    set(
      produce((state: State) => {
        switch (type) {
          case "module": {
            state.atoms.set(id, {
              parent,
              subNodes: [],
              type: "module",
              childType: "section",
              title: "New Module",
              hidden: false,
              actions: ["create", "delete"],
              content: initialModule(id),
            });
            // If no parent exists, you've got a bigger issue
            break;
          }
          case "section": {
            state.atoms.set(id, {
              parent,
              subNodes: [],
              type: "section",
              childType: "question",
              title: "New Section",
              hidden: false,
              actions: ["create", "delete", "earlier", "later"],
              content: initialSection(id),
            });
            break;
          }
          case "question": {
            state.atoms.set(id, {
              parent,
              subNodes: null,
              type: "question",
              childType: null,
              title: "New Question",
              hidden: false,
              actions: ["delete", "earlier", "later"],
              content: initialQuestion(id),
            });
            break;
          }
        }
        state.atoms.get(parent)!.subNodes!.push(id);
      })
    );
    get().selectedNode = id;
  },

  setAtom: (id, content) =>
    set(
      produce((state: State) => {
        const atom = state.atoms.get(id)!;
        atom.content = content;
        if ((isSection(content) || isModule(content)) && content.name) {
          atom.title = content.name.length > 32 ? content.name.slice(0, 32) + "..." : content.name;
        }
        if (isQuestion(content) && content.text) {
          atom.title = content.text.length > 32 ? content.text.slice(0, 60) + "..." : content.text;
        }
        if (isProperties(content)) {
          // @ts-ignore Because we are using the root node also as the properties node (which is not correct for the study), the properties fields are in the study object
          state.conditions = ["*", ...content.conditions];
        }
      })
    ),
  setAtoms(atoms) {
    // Completely replace the atoms and recalculate the graph
    set({ atoms });
    localStorage.setItem("atoms", JSON.stringify([...atoms]));
  },
  setModal(value) {
    set({ modal: value });
  },
  setPermalink(permalink) {
    set({ permalink });
  },
  saveAtoms: async () => {
    // Saving all atoms takes some time and we don't want it to block rendering changes to atoms
    localStorage.setItem("atoms", JSON.stringify([...get().atoms]));
  },

  deleteNode: deleteNode(set, get),

  moveNode: (id, direction) => {
    set(
      produce((state: State) => {
        // It's assertion hell down here
        const parent_id = state.atoms.get(id)!.parent;
        const siblings = state.atoms.get(parent_id!)!.subNodes!;
        const index = siblings.indexOf(id);
        if (direction === "earlier" && index > 0) {
          siblings.splice(index, 1); // Remove self from array
          siblings.splice(index - 1, 0, id); // Insert self at new position
        }
        if (direction === "later" && index < siblings.length - 1) {
          siblings.splice(index, 1);
          siblings.splice(index + 1, 0, id);
        }
        state.forceRedraw += 1;
      })
    );
  },
}));
