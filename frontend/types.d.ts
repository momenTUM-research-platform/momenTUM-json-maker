// export interface Study {
//   metadata: {
//     url: string;
//     commits: {
//       id: string;
//       timestamp: number;
//     }[];
//   };
//   properties: {
//     study_id: string;
//     study_name: string;
//     instructions: string;
//     banner_url: string;
//     support_email: string;
//     support_url: string;
//     ethics: string;
//     pls: string;
//     empty_message: string;
//     post_url: string;
//     conditions: string[];
//     cache: boolean;
//   };
//   modules: {
//     type: string;
//     name: string;
//     submit_text: string;

//     condition: string;
//     alerts: {
//       title: string;
//       message: string;
//       start_offset: number;
//       duration: number;
//       times: {
//         hours: number;
//         minutes: number;
//       }[];
//       random: boolean;
//       random_interval: number;
//       sticky: boolean;
//       sticky_label: string;
//       timeout: boolean;
//       timeout_after: number;
//     };
//     graph: {
//       display: boolean;
//       variable: string;
//       title: string;
//       blurb: string;
//       type: "bar" | "line";
//       max_points: number;
//     };
//     sections: {
//       name: string;
//       shuffle: boolean;
//       questions:
//         | (Question & { type: "instruction" })[]
//         | (Question & { type: "text"; subtype: string })[]
//         | (Question & { type: "datetime"; subtype: string })[]
//         | (Question & { type: "yesno"; yes_text: string; no_text: string })[]
//         | (Question & {
//             type: "slider";
//             min: number;
//             max: number;
//             hint_left: string;
//             hint_right: string;
//           })[]
//         | (Question & {
//             type: "multi";
//             radio: boolean;
//             modal: boolean;
//             options: string[];
//             shuffle: boolean;
//           })[]
//         | (Question & {
//             type: "media";
//             subtype: "image" | "video" | "audio";
//             src: string;
//             thumb: string;
//           })[];
//     }[];
//     uuid: string;
//     unlock_after: string[];
//     shuffle: boolean;
//   }[];
// }

// interface Question {
//   id: string;
//   text: string;
//   required: boolean;
//   hide_id: string;
//   hide_value: string | boolean;
//   hide_if: boolean;
//   rand_group: string;
// }

export enum Form {
  Properties = 0,
  Module = 1,
  Section = 2,
  Question = 3,
}

export interface Study {
  _id?: { $oid: string };
  timestamp?: number;
  properties: Properties;
  modules: Module[];
}

export interface Commit {
  id: string;
  timestamp: number;
}

export interface Properties {
  kind: Form.Properties;
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

export interface Module {
  kind: Form.Module;
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
  graph: {
    display: boolean;
    variable: string;
    title: string;
    blurb: string;
    type: "bar" | "line";
    max_points: number;
  };
  sections: Section[];
  uuid: string;
  unlock_after: string[];
  shuffle: boolean;
}

interface Section {
  kind: Form.Section;
  name: string;
  shuffle: boolean;
  questions: (Instruction | Text | DateTime | YesNo | Slider | Multi | External | Media)[];
}

interface Question {
  kind: Form.Question;
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
}

interface Instruction extends Question {
  type: "instruction";
}
interface Text extends Question {
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
