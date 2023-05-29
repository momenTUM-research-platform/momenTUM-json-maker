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
      message: "",
      start_offset: 0,
      duration: 0,
      times: [],
      random: false,
      random_interval: 0,
      sticky: false,
      sticky_label: "",
      timeout: false,
      timeout_after: 0
    },
    condition: "",
    graph: {
      display: false,
    },
    name: "",
    submit_text: "Submit",
    unlock_after: [],
    params: {
      _type: "params",
    }
  };
};

export const initialParamSurvey = (id: string): Params => {
  return {
    id,
    _type: "params",
    type: "survey",
    shuffle: false,
    sections: [],
  };
};

export const initialParamPVT = (id: string): Params => {
  return {
    _type: "params",
    id,
    type: "pvt",
    trials: 0,
    min_waiting: 0,
    max_waiting: 0,
    max_reaction: 0,
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
