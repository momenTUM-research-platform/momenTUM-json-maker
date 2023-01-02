import { constructStudy } from "./construct";
import { describe, expect, it } from "vitest";
import { download, generateDictionary, upload, validateStudy } from "./actions";
import sleep_study from "../../../studies/sleep.json";
import { useStore } from "../state";
import { deconstructStudy } from "./deconstruct";
describe("Upload and Download", async () => {
  it("Uploads and downloads a study", async () => {
    const study = sleep_study as Study;
    const id = await upload(study);
    const downloaded = await download(id);
    expect(downloaded.properties).toEqual(study.properties);
    expect(downloaded.modules).toEqual(study.modules);
  });
});
describe("Constructing a study from atoms", () => {
  it("Creates basic study from nearly empty atoms", () => {
    const { atoms } = useStore.getState();
    const constructedStudy = constructStudy(atoms);
    const study: Study = {
      properties: {
        study_name: "",
        study_id: constructedStudy.properties.study_id, // is randomly generated, therefore needs to be substitued
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
      _type: "study",
    };
    expect(constructedStudy).toEqual(study);
  });
});

describe("Deconstructing a study into atoms", () => {
  it("Deconstructs basic study", () => {
    const { atoms } = useStore.getState();
    const constructedStudy = constructStudy(atoms);
    const study: Study = {
      properties: {
        study_name: "",
        study_id: constructedStudy.properties.study_id, // is randomly generated, therefore needs to be substitued
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
      _type: "study",
    };
    const deconstructedStudy = deconstructStudy(study);
    expect(deconstructedStudy).toEqual(atoms);
  });

  it("Creates atoms from annas study", () => {
    const study = sleep_study as Study;
    const atoms = deconstructStudy(study);
    expect(atoms).toBeTypeOf("object");
    expect(atoms.size).toBe(10);
  });
  it("Deconstructs a study", () => {
    const study: Study = {
      _id: {
        $oid: "63b2dc19b698c1722a6deea5",
      },
      _type: "study",
      timestamp: 1672666137078,
      properties: {
        study_id: "TUM_2022_env_trial01",
        study_name: "Environmental effects on sleep",
        instructions: "This is a trial",
        banner_url: "https://getschema.app/img/schema_banner.png",
        support_email: "anna.biller@tum.de",
        support_url: "",
        ethics:
          "This study was approved by the ethics committee of the TUM with approval #2022-578-S-KH",
        pls: "",
        empty_msg: "You're all up to date",
        post_url: "https: //tuspl22-momentum.srv.mwn.de/post.php",
        conditions: [],
        cache: false,
        created_by: "Anna Biller",
      },
      modules: [
        {
          type: "survey",
          _type: "module",
          name: "Daily sleep diary",
          submit_text: "Submit",
          condition: "*",
          alerts: {
            title: "Good morning!",
            message: "Please fill out your daily sleep diary",
            start_offset: 0,
            duration: 24,
            times: [
              {
                hours: 11,
                minutes: 0,
              },
            ],
            random: false,
            random_interval: 0,
            sticky: true,
            sticky_label: "",
            timeout: false,
            timeout_after: 0,
          },
          graph: {
            display: true,
            variable: "",
            title: "",
            blurb: "",
            type: "bar",
            max_points: 10,
          },
          id: "Sleep Diary",
          unlock_after: [],
          sections: [
            {
              id: "FsQaZ2ftBNUu4gtM21M4J",
              name: "Questions for sleep diary",
              _type: "section",
              shuffle: true,
              questions: [
                {
                  type: "instruction",
                  id: "hSE7rsNlqwPLfPjexIJgk",
                  _type: "question",
                  text: "Here we will ask you about your last main sleep episode. This is usually but does not have to be the the previous night-time sleep episode. Please fill out the diary every morning after waking up.",
                  required: true,
                  rand_group: "",
                  hide_id: "",
                  hide_value: "",
                  hide_if: false,
                },
                {
                  type: "datetime",
                  id: "BtcFLqU9v0T07TxjICTwE",
                  _type: "question",
                  text: "When did you fall asleep yesterday?",
                  required: true,
                  rand_group: "",
                  subtype: "datetime",
                  hide_id: "",
                  hide_value: "",
                  hide_if: false,
                },
                {
                  type: "datetime",
                  id: "juDISNtklXpBK1EVpnHjj",
                  _type: "question",
                  text: "When did you wake up today?",
                  required: true,
                  rand_group: "",
                  subtype: "datetime",
                  hide_id: "",
                  hide_value: "",
                  hide_if: false,
                },
                {
                  type: "slider",
                  id: "JNzZp-Z6iJS7291H2f1OU",
                  _type: "question",
                  text: "How would you rate your sleep quality today?",
                  required: true,
                  rand_group: "",
                  min: 1,
                  max: 4,
                  hint_left: "very good",
                  hint_right: "very bad",
                  hide_id: "",
                  hide_value: "",
                  hide_if: false,
                },
                {
                  type: "multi",
                  id: "grbDZ4rA_QJzStWEM9HkY",
                  _type: "question",
                  text: "Did you use an alarm clock to wake up?",
                  required: true,
                  rand_group: "",
                  radio: true,
                  modal: false,
                  options: [
                    "yes",
                    "no but something else woke me up (e.g. bed partner, pet, noise...)",
                    "no",
                  ],
                  shuffle: false,
                  hide_id: "",
                  hide_value: "",
                  hide_if: false,
                },
                {
                  type: "multi",
                  id: "BIRjLhE8QL_tuDQ5QPR9w",
                  _type: "question",
                  text: "Do you need to work today?",
                  required: false,
                  rand_group: "",
                  radio: true,
                  modal: false,
                  options: [
                    "yes and I can choose my start time flexibly",
                    "yes but I cannot choose my start time",
                    "no ",
                  ],
                  shuffle: false,
                  hide_id: "",
                  hide_value: "",
                  hide_if: false,
                },
                {
                  type: "slider",
                  id: "wwvhQUyE_UJHHAGIx1iug",
                  _type: "question",
                  text: "How alert/sleepy are you at the moment?",
                  required: true,
                  rand_group: "",
                  min: 1,
                  max: 10,
                  hint_left: "very alert",
                  hint_right: "extremely sleepy, can't keep awake",
                  hide_id: "",
                  hide_value: "",
                  hide_if: false,
                },
              ],
            },
          ],
          shuffle: false,
        },
      ],
    };
    const atoms = deconstructStudy(study);
    expect(atoms).toBeTypeOf("object");
    expect(atoms.size).toBe(10);
  });
});

describe("Validate study", () => {
  it("Validates Annas sleep study", () => {
    // @ts-ignore
    const study: Study = sleep_study;
    expect(validateStudy(study)).toBe(true);
    expect(validateStudy(constructStudy(deconstructStudy(study)))).toBe(true);
  });
  it("Invalidates study with wrong ID", () => {
    const atoms_raw =
      '[["study",{"parent":null,"subNodes":["PVBzIbbve9cNOA9jMEmYs","JV7jo924H3MPaQCgbtJL9","1uGym1kcgfYN_EX6NjPWu","jOiFRpKhJJl8jb9Kv-XrO"],"type":"study","childType":"module","title":"Properties","hidden":false,"actions":["create" ],"content":{"study_name":"","study_id":"hello_wolrd","created_by":"","instructions":"","post_url":"https://tuspl22-momentum.srv.mwn.de/post.php","empty_msg":"","banner_url":"","support_url":"","support_email":"","cache":false,"ethics":"","pls":"","conditions":["Control","Treatment"],"_type":"study","properties":{"study_name":"","study_id":"4TKNdW2fyndn-S9LQf95-","created_by":"","instructions":"","post_url":"https://tuspl22-momentum.srv.mwn.de/api/v1","empty_msg":"","banner_url":"","support_url":"","support_email":"","conditions":["Control","Treatment"],"cache":false,"ethics":"","pls":""},"modules":[]}}],["PVBzIbbve9cNOA9jMEmYs",{"parent":"study","subNodes":[],"type":"module","childType":"section","title":"New Module","hidden":false,"actions":["create" ,"delete"],"content":{"_type":"module","id":"PVBzIbbve9cNOA9jMEmYs","alerts":{"title":"","duration":0,"message":"","random":false,"random_interval":0,"start_offset":0,"sticky":false,"sticky_label":"","timeout":false,"timeout_after":0,"times":[{"hours":8,"minutes":30}]},"condition":"","graph":{"display":false},"name":"","sections":[],"shuffle":false,"submit_text":"Submit","type":"info","unlock_after":[]}}],["JV7jo924H3MPaQCgbtJL9",{"parent":"study","subNodes":[],"type":"module","childType":"section","title":"New Module","hidden":false,"actions":["create" ,"delete"],"content":{"_type":"module","id":"JV7jo924H3MPaQCgbtJL9","alerts":{"title":"","duration":0,"message":"","random":false,"random_interval":0,"start_offset":0,"sticky":false,"sticky_label":"","timeout":false,"timeout_after":0,"times":[{"hours":8,"minutes":30}]},"condition":"","graph":{"display":false},"name":"","sections":[],"shuffle":false,"submit_text":"Submit","type":"info","unlock_after":[]}}],["1uGym1kcgfYN_EX6NjPWu",{"parent":"study","subNodes":[],"type":"module","childType":"section","title":"New Module","hidden":false,"actions":["create" ,"delete"],"content":{"_type":"module","id":"1uGym1kcgfYN_EX6NjPWu","alerts":{"title":"","duration":0,"message":"","random":false,"random_interval":0,"start_offset":0,"sticky":false,"sticky_label":"","timeout":false,"timeout_after":0,"times":[{"hours":8,"minutes":30}]},"condition":"","graph":{"display":false},"name":"","sections":[],"shuffle":false,"submit_text":"Submit","type":"info","unlock_after":[]}}],["jOiFRpKhJJl8jb9Kv-XrO",{"parent":"study","subNodes":[],"type":"module","childType":"section","title":"New Module","hidden":false,"actions":["create" ,"delete"],"content":{"_type":"module","id":"jOiFRpKhJJl8jb9Kv-XrO","alerts":{"title":"","duration":0,"message":"","random":false,"random_interval":0,"start_offset":0,"sticky":false,"sticky_label":"","timeout":false,"timeout_after":0,"times":[{"hours":8,"minutes":30}]},"condition":"","graph":{"display":false},"name":"","sections":[],"shuffle":false,"submit_text":"Submit","type":"info","unlock_after":[]}}]]';
    const atoms: Atoms = new Map(JSON.parse(atoms_raw));
    const study = constructStudy(atoms);
    expect(validateStudy(study)).toBe(false);
  });
});

describe("Generate Dictionary", () => {
  it("Generates a dictionary from study", () => {
    // @ts-ignore
    const study: Study = sleep_study;
    const dictionary = generateDictionary(study);
    expect(dictionary)
      .toEqual(`"Variable / Field Name","Form Name","Section Header","Field Type","Field Label","Choices, Calculations, OR Slider Labels","Field Note","Text Validation Type OR Show Slider Number","Text Validation Min","Text Validation Max",Identifier?,"Branching Logic (Show field only if...)","Required Field?","Custom Alignment","Question Number (surveys only)","Matrix Group Name","Matrix Ranking?","Field Annotation"
BtcFLqU9v0T07TxjICTwE,Sleep Diary,,text,When did you fall asleep yesterday?,,,,,,,,,,,,,
juDISNtklXpBK1EVpnHjj,Sleep Diary,,text,When did you wake up today?,,,,,,,,,,,,,
JNzZp-Z6iJS7291H2f1OU,Sleep Diary,,text,How would you rate your sleep quality today?,,,,,,,,,,,,,
grbDZ4rA_QJzStWEM9HkY,Sleep Diary,,text,Did you use an alarm clock to wake up?,,,,,,,,,,,,,
BIRjLhE8QL_tuDQ5QPR9w,Sleep Diary,,text,Do you need to work today?,,,,,,,,,,,,,
wwvhQUyE_UJHHAGIx1iug,Sleep Diary,,text,How alert/sleepy are you at the moment?,,,,,,,,,,,,,
`);
  });
});
