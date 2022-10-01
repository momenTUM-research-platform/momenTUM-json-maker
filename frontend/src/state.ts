import create from "zustand";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { schema } from "../schema/schema";
import { section } from "../schema/section";
import { nanoid } from "nanoid";
import produce from "immer";

interface State {
  study: Study;
  selectedNode: string | null; // ID of the currently selected Node
  schema: typeof properties | typeof module | typeof section | typeof question | null;
  questions: { [id: string]: Question };
  modules: { [id: string]: Module };
  sections: { [id: string]: Section };
  setProperties: (from: Properties) => void;
  setModule: (from: Module) => void;
  setSection: (from: Section) => void;
  setQuestion: (from: Question) => void;
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
};

export const useStore = create<State>((set) => ({
  study: emptyStudy,
  schema: null,
  selectedNode: null,
  modules: {},
  sections: {},
  questions: {},
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
}));
