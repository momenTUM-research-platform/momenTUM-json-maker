declare type AtomVariants =
  | "study"
  | "module"
  | "section"
  | "question"
  | "properties"
  | "params";

declare type Actions = "create" | "delete" | "earlier" | "later";

declare type Mode = "graph" | "timeline";

declare type Atoms = Map<
  string,
  Atom<Study | Properties | Question | Module | Section | Params>
>;

declare interface SchemaEnum {
  id: string;
  text: string;
}

declare interface Atom<T> {
  parent: string | null;
  subNodes: string[] | null;
  type: AtomVariants;
  childType: AtomVariants | null;
  content: T;
  title: string; // Displayed on node
  actions: Actions[];
  hidden: boolean;
}

declare interface Occurence {
  id: string;
  timestamp: number;
  name: string;
  time: string;
  datetime: string; // YYYY-MM-DD'T'HH:MM,
  condition: string;
  module: string; // id of module
}

declare type Days = Occurence[][]; // Array of 1000 consecutive days starting from today each containing an array of events on that day

declare interface Day {
  date: string; // "YYYY-MM-DD"
  isCurrentMonth?: boolean;
  isSelected?: boolean;
  isToday?: boolean;

  events: Occurence[];
}
declare interface Study {
  _type: "study";
  _id?: { $oid: string };
  timestamp?: number;
  properties: Properties;
  modules: Module[];
}

declare interface Properties {
  _type: "properties";
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
  _type: "module";
  name: string;
  id: string;
  condition: string;
  unlock_after: [];
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
  params: Params;
}

declare interface Params {
  _type: "params";
  id?: string;
  type?: string;
  trials?: number;
  submit_text?: string;
  min_waiting?: number;
  max_waiting?: number;
  show?: boolean;
  max_reaction?: number;
  exit?: boolean;
  shuffle?: boolean;
  sections?: Section[];
}

declare interface Section {
  _type: "section";
  id: string;
  name: string;
  shuffle: boolean;
  questions: (
    | Instruction
    | TextQuestion
    | DateTime
    | YesNo
    | Slider
    | Multi
    | Media
    | External
  )[];
}

declare interface Question {
  _type: "question";
  id: string;
  text: string;
  //  type: "instruction" | "datetime" | "multi" | "text" | "slider" | "media" | "yesno" | "external";
  required: boolean;
  rand_group: string;

  hide_id?: string;
  hide_value?: string | boolean;
  hide_if?: boolean;

  // find out whats really needed
  noToggle?: boolean;
  response?: number | string | [];
  hideSwitch?: boolean;
  model?: string | number;
  hideError?: boolean;
  value?: number;
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
}
interface Slider extends Question {
  type: "slider";
  min: number;
  max: number;
  hint_left: string;
  hint_right: string;
}
interface Multi extends Question {
  type: "multi";
  radio: boolean;
  modal: boolean;
  options: string[];
  optionsChecked?: Option[]; // adjust in Generator
  shuffle: boolean;
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
