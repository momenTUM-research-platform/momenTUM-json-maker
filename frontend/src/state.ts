import create from "zustand";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { schema } from "../schema/schema";
import { section } from "../schema/section";
import { Form, Study } from "../types";
import {nanoid} from 'nanoid'

interface State {
  study: Study ;
  schema: typeof properties | typeof module | typeof section | typeof question | null;
  setStudy: (from: Form ) => void ;
}

const emptyStudy : Study = {
    properties: {
        kind: Form.Properties,
        "study_name": "",
        "study_id": nanoid(),
        "created_by": "",
        "instructions": "",
        "post_url": "https://tuspl22-momentum.srv.mwn.de/api/v1",
        "empty_msg": "",
        "banner_url": "",
        "support_url": "",
        "support_email": "",
        "conditions": [
            "Control",
            "Treatment"
        ],
        "cache": false,
        "ethics": "",
        "pls": ""
    },
    "modules": [
       
    ]
}

export const useStore = create<State>((set) => ({
  study: emptyStudy,
  schema: null,
  setStudy: form => {
    switch (form) {
        case Form.Properties:
            set({study})
            break;
    
        default:
            break;
    }
}));

