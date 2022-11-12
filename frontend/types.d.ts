declare interface Study {
  _id?: { $oid: string };
  timestamp?: number;
  properties: Properties;
  parent: null
  modules: Module[];
  subNodes: string[]; // list of module ids used to build linked list during editing, similiar for sections, questions. Upon finalization, replaced with module object
}

declare interface Commit {
  id: string;
  timestamp: number;
}

declare interface Properties {
  study_id: string;
  study_name: string;
  instructions: string;
  banner_url: string;
  support_email: string;
  support_url: string;
  ethics: string;
  pls: string;
  created_by: string;
  empty_msg: string;
  post_url: string;
  conditions: string[];
  cache: boolean;
}

declare interface Module {
  type: string;
  name: string;
  submit_text: string;

  condition: string;
  alerts: {
    title: string;
    message: string;
    start_offset: number;
    duration: number;
    times: {
      hours: number;
      minutes: number;
    }[];
    random: boolean;
    random_interval: number;
    sticky: boolean;
    sticky_label: string;
    timeout: boolean;
    timeout_after: number;
  };
  graph:
    | {
        display: true;
        variable: string;
        title: string;
        blurb: string;
        type: "bar" | "line";
        max_points: number;
      }
    | { display: false };
  sections: Section[];
  parent: string
  subNodes: string[];
  id: string;
  unlock_after: string[];
  shuffle: boolean;
}

interface Section {
  id: string;
  name: string;
  shuffle: boolean;
  questions: Question[];
  parent: string
  subNodes: string[];
}

interface Question {
  id: string;
  text: string;
  type: "instruction" | "datetime" | "multi" | "text" | "slider" | "media" | "yesno" | "external";
  required: boolean;
  rand_group: string;

  // find out whats really needed
  noToggle?: boolean;
  response?: number | string | [];
  hideSwitch?: boolean;
  model?: string | number;
  hideError?: boolean;
  value?: number;
  parent: string
  subNodes: null // Currently, Questions will never have subnodes; necessary for recursive search for subNodes

}

interface Instruction extends Question {
  type: "instruction";
}
interface TextQuestion extends Question {
  type: "text";
  subtype: "short" | "long" | "numeric";
}
interface DateTime extends Question {
  type: "datetime";
  subtype: "date" | "time" | "datetime";
}
interface YesNo extends Question {
  type: "yesno";
  yes_text: string;
  no_text: string;
  hide_id?: string;
  hide_value?: boolean;
  hide_if?: boolean;
}
interface Slider extends Question {
  type: "slider";
  min: number;
  max: number;
  hint_left: string;
  hint_right: string;
  hide_id?: string;
  hide_value?: string; //  prefix with < or > => <50
  hide_if?: boolean;
}
interface Multi extends Question {
  type: "multi";
  radio: boolean;
  modal: boolean;
  options: string[];
  optionsChecked?: Option[]; // adjust in Generator
  shuffle: boolean;
  hide_id?: string;
  hide_value?: string;
  hide_if?: boolean;
}
interface Media extends Question {
  type: "media";
  subtype: "image" | "video" | "audio";
  src: string;
  thumb: string;
}
interface External extends Question {
  type: "external";
  src: string;
}

interface Option {
  text: string;
  checked: boolean;
}
