import { constructStudy } from "./construct";
import { describe, expect, it } from "vitest";
import { generateDictionary, validateStudy } from "./actions";
import sleep_study from "../../../studies/sleep.json";
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
});

describe("Validate study", () => {
  it("Validates Annas sleep study", () => {
    // @ts-ignore
    const study: Study = sleep_study;
    expect(validateStudy(study)).toBe(true);
    expect(validateStudy(constructStudy(deconstructStudy(study)))).toBe(true);
  });
});

describe("Generate Dictionary", () => {
  it("Generates a dictionary from study", () => {
    // @ts-ignore
    const study: Study = sleep_study;
    const dictionary = generateDictionary(study);
    console.log(dictionary);
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
