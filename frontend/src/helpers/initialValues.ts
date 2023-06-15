export const initialProperties: Properties = {
  _type: "properties",
  study_name: "Study",
  study_id: String(),
  created_by: String(),
  instructions: String(),
  post_url: "https://tuspl22-momentum.srv.mwn.de/api/v1",
  empty_msg: String(),
  banner_url: String(),
  support_url: String(),
  support_email: String(),
  conditions: ["Control", "Treatment"],
  cache: false,
  ethics: String(),
  pls: String(),
};

export const initialModule = (id: string): Module => {
  return {
    _type: "module",
    id,
    alerts: {
      title:  String(),
      message: String(),
      start_offset: 0,
      duration: 0,
      times: [],
      random: false,
      random_interval: 0,
      sticky: false,
      sticky_label: String(),
      timeout: false,
      timeout_after: 0
    },
    condition: String(),
    graph: {
      display: false,
    },
    name: String(),
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
    submit_text: "Submit",
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
    name: String(),
    questions: [],
    shuffle: false,
  };
};

export const initialQuestion = (id: string): TextQuestion => {
  return {
    _type: "question",
    id,
    rand_group: String(),
    required: true,
    text: String(),
    type: "text",
    subtype: "short",
  };
};
