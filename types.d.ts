export interface Form {
  properties: {
    study_id: string;
    study_name: string;
    instructions: string;
    banner_url: string;
    support_email: string;
    support_url: string;
    ethics: string;
    pls: string;
    empty_message: string;
    post_url: string;
    conditions: string[];
    cache: boolean;
  };
  modules: {
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
    sections: {
      name: string;
      shuffle: boolean;
      questions:
        | (Question & { type: "text"; subtype: string })[]
        | (Question & { type: "datetime"; subtype: string })[]
        | (Question & { type: "yesno"; yes_text: string; no_text: string })[]
        | (Question & {
            type: "slider";
            min: number;
            max: number;
            hint_left: string;
            hint_right: string;
          })[]
        | (Question & {
            type: "multi";
            radio: boolean;
            modal: boolean;
            options: string[];
            shuffle: boolean;
          })[]
        | (Question & {
            type: "media";
            subtype: "image" | "video" | "audio";
            src: string;
            thumb: string;
          })[];
    }[];
  }[];
  uuid: string;
  unlock_after: string[];
  shuffle: boolean;
}

interface Question {
  id: string;
  text: string;
  required: boolean;
  hide_id: string;
  hide_value: string | boolean;
  hide_if: boolean;
  rand_group: string;
}
