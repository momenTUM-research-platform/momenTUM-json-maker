export const initialProperties: Properties = {
  _type: "properties",
  study_name: "Study",
  study_id: "enter_a_study_id_here",
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
};

export const initialModule = (id: string): Module => {
  return {
    _type: "module",
    id,
    alerts: {
      title: "",
      duration: 0,
      message: "",
      random: false,
      random_interval: 0,
      start_offset: 0,
      sticky: false,
      sticky_label: "",
      timeout: false,
      timeout_after: 0,
      times: [
        {
          hours: 8,
          minutes: 30,
        },
      ],
    },
    condition: "",
    graph: {
      display: false,
    },
    name: "",
    sections: [],
    shuffle: false,
    submit_text: "Submit",
    type: "info",
    unlock_after: [],
  };
};

export const initialSection = (id: string): Section => {
  return {
    _type: "section",
    id,
    name: "",
    questions: [],
    shuffle: false,
  };
};

export const initialQuestion = (id: string): TextQuestion => {
  return {
    _type: "question",
    id,
    rand_group: "",
    required: true,
    text: "",
    type: "text",
    subtype: "short",
  };
};
