import { constructStudy } from "./construct";
import { describe, expect, it } from "vitest";
import { validateStudy } from "./actions";
describe("Constructing a study from atoms", () => {
  it("Creates valid study from nearly empty atoms", () => {
    expect(validateStudy(constructStudy())).to.be.true;
  });
  it("Creates basic study from nearly empty atoms", () => {
    const constructedStudy = constructStudy();
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
