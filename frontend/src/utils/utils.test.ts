import { constructStudy } from "./construct";
import { describe, expect, it } from "vitest";
import { generateDictionary, validateStudy } from "./actions";
import sleep_study from "../../../studies/sleep.json";
import atoms_long from "../../../studies/atoms.json";
import { useStore } from "../state";
import { deconstructStudy } from "./deconstruct";

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

  it.only("Creates advanced study from atoms", async () => {
    const atoms = new Map(atoms_long);
    const constructedStudy = constructStudy(atoms);
    console.log(JSON.stringify(constructedStudy, null, 2));

    expect(constructedStudy.modules.length).toBe(4);
    expect(constructedStudy.modules[0].sections[0].questions.length).toBe(9);
    expect(constructedStudy.modules[1].sections[0].questions.length).toBe(3);
    expect(constructedStudy.modules[2].sections[0].questions.length).toBe(3);
    expect(constructedStudy.modules[3].sections[0].questions.length).toBe(3);
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
      '"[["study",{"parent":null,"subNodes":["PVBzIbbve9cNOA9jMEmYs","JV7jo924H3MPaQCgbtJL9","1uGym1kcgfYN_EX6NjPWu","jOiFRpKhJJl8jb9Kv-XrO"],"type":"study","childType":"module","title":"Properties","hidden":false,"actions":["create","count"],"content":{"study_name":"","study_id":"hello_wolrd","created_by":"","instructions":"","post_url":"https://tuspl22-momentum.srv.mwn.de/post.php","empty_msg":"","banner_url":"","support_url":"","support_email":"","cache":false,"ethics":"","pls":"","conditions":["Control","Treatment"],"_type":"study","properties":{"study_name":"","study_id":"4TKNdW2fyndn-S9LQf95-","created_by":"","instructions":"","post_url":"https://tuspl22-momentum.srv.mwn.de/api/v1","empty_msg":"","banner_url":"","support_url":"","support_email":"","conditions":["Control","Treatment"],"cache":false,"ethics":"","pls":""},"modules":[]}}],["PVBzIbbve9cNOA9jMEmYs",{"parent":"study","subNodes":[],"type":"module","childType":"section","title":"New Module","hidden":false,"actions":["create","count","delete"],"content":{"_type":"module","id":"PVBzIbbve9cNOA9jMEmYs","alerts":{"title":"","duration":0,"message":"","random":false,"random_interval":0,"start_offset":0,"sticky":false,"sticky_label":"","timeout":false,"timeout_after":0,"times":[{"hours":8,"minutes":30}]},"condition":"","graph":{"display":false},"name":"","sections":[],"shuffle":false,"submit_text":"Submit","type":"info","unlock_after":[]}}],["JV7jo924H3MPaQCgbtJL9",{"parent":"study","subNodes":[],"type":"module","childType":"section","title":"New Module","hidden":false,"actions":["create","count","delete"],"content":{"_type":"module","id":"JV7jo924H3MPaQCgbtJL9","alerts":{"title":"","duration":0,"message":"","random":false,"random_interval":0,"start_offset":0,"sticky":false,"sticky_label":"","timeout":false,"timeout_after":0,"times":[{"hours":8,"minutes":30}]},"condition":"","graph":{"display":false},"name":"","sections":[],"shuffle":false,"submit_text":"Submit","type":"info","unlock_after":[]}}],["1uGym1kcgfYN_EX6NjPWu",{"parent":"study","subNodes":[],"type":"module","childType":"section","title":"New Module","hidden":false,"actions":["create","count","delete"],"content":{"_type":"module","id":"1uGym1kcgfYN_EX6NjPWu","alerts":{"title":"","duration":0,"message":"","random":false,"random_interval":0,"start_offset":0,"sticky":false,"sticky_label":"","timeout":false,"timeout_after":0,"times":[{"hours":8,"minutes":30}]},"condition":"","graph":{"display":false},"name":"","sections":[],"shuffle":false,"submit_text":"Submit","type":"info","unlock_after":[]}}],["jOiFRpKhJJl8jb9Kv-XrO",{"parent":"study","subNodes":[],"type":"module","childType":"section","title":"New Module","hidden":false,"actions":["create","count","delete"],"content":{"_type":"module","id":"jOiFRpKhJJl8jb9Kv-XrO","alerts":{"title":"","duration":0,"message":"","random":false,"random_interval":0,"start_offset":0,"sticky":false,"sticky_label":"","timeout":false,"timeout_after":0,"times":[{"hours":8,"minutes":30}]},"condition":"","graph":{"display":false},"name":"","sections":[],"shuffle":false,"submit_text":"Submit","type":"info","unlock_after":[]}}]]"';
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
