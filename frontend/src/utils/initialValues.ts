export const initialStudy  =  (id: string) : Study => { return {
    _type: Atoms.Study,
    properties: {
      study_name: "",
      study_id: id,
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
}
  };
export const  initialModule = (id: string):  Module => { return {
    _type: Atoms.Module,
    parent: "properties", // While not correct in the study JSON, where modules and properties are siblings, in the graph properties is the parent. Needed for hiding logic
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
    subNodes: [],
    shuffle: false,
    submit_text: "Submit",
    type: "info",
    unlock_after: [],
  }};  

  export const initialSection = (id: string): Section => { return  {
    _type: Atoms.Section,
    id,
    name: "",
    questions: [],
    shuffle: false,
  }}


  export const initialQuestion = (id: string) : TextQuestion => {return {
    _type: Atoms.Question,
    id,
    rand_group: "",
    required: true,
    text: "",
    type: "text",
    subtype: "short",

  }};