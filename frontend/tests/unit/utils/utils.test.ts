import { constructStudy } from "../../../src/utils/construct";
import { describe, expect, it } from "vitest";
import { download, upload, validateStudy, validateStudyFromObj } from '../../../src/services/actions';
import sleep_study from "../../../../studies/sleep.json";
import atoms_long from "../../../../studies/atoms.json";
import monster_study from "../../../../studies/monster.json";
import maydel_study from "../../../../studies/maydel.json";
import { useStore } from "../../../src/state";
import { deconstructStudy } from "../../../src/utils/deconstruct";

describe("Example studies", () => {
  it("Validates example studies", () => {
    const res = validateStudyFromObj(sleep_study);
    expect(res).toBe(true);
  });
});

// Not working
// describe("Upload and Download", async () => {
//   it("Uploads and downloads a study", async () => {
//     const study = sleep_study as Study;
//     const id = await upload(study);
//     const downloaded = await download(id);
//     expect(downloaded.properties).toEqual(study.properties);
//     expect(downloaded.modules).toEqual(study.modules);
//   });
// });

// describe("Constructing a study from atoms", () => {
//   it("Creates basic study from nearly empty atoms", () => {
//     const { atoms } = useStore.getState();
//     const constructedStudy = constructStudy(atoms);
//     const study: Study = {
//       properties: {
//         _type: "properties",
//         study_name: "Study",
//         study_id: constructedStudy.properties.study_id, // is randomly generated, therefore needs to be substitued
//         created_by: "",
//         instructions: "",
//         post_url: "https://tuspl22-momentum.srv.mwn.de/api/v1",
//         empty_msg: "",
//         banner_url: "",
//         support_url: "",
//         support_email: "",
//         conditions: ["Control", "Treatment"],
//         cache: false,
//         ethics: "",
//         pls: "",
//       },
//       modules: [],
//       _type: "study",
//     };
//     expect(constructedStudy).toEqual(study);
//   });

//   it("Creates advanced study from atoms", async () => {
//     // @ts-ignore
//     const atoms = new Map(atoms_long) as Atoms;
//     const constructedStudy = constructStudy(atoms);

//     expect(constructedStudy.modules.length).toBe(4);
//     expect(constructedStudy.modules[0].sections[0].questions.length).toBe(9);
//     expect(constructedStudy.modules[1].sections[0].questions.length).toBe(3);
//     expect(constructedStudy.modules[2].sections[0].questions.length).toBe(3);
//     expect(constructedStudy.modules[3].sections[0].questions.length).toBe(3);
//     // it("Creates a study from monster study atoms", () => {
//     //   const atoms = new Map(JSON.parse(monsterAtoms)) as Atoms;
//     //   expect(constructStudy(atoms)).toEqual(monster_study);
//     // });
//   });
// });

// describe("Deconstructing a study into atoms", () => {
//   it("Deconstructs basic study", () => {
//     const { atoms } = useStore.getState();
//     const constructedStudy = constructStudy(atoms);
//     const study: Study = {
//       properties: {
//         _type: "properties",
//         study_name: "Study",
//         study_id: constructedStudy.properties.study_id, // is randomly generated, therefore needs to be substitued
//         created_by: "",
//         instructions: "",
//         post_url: "https://tuspl22-momentum.srv.mwn.de/api/v1",
//         empty_msg: "",
//         banner_url: "",
//         support_url: "",
//         support_email: "",
//         conditions: ["Control", "Treatment"],
//         cache: false,
//         ethics: "",
//         pls: "",
//       },
//       modules: [],
//       _type: "study",
//     };
//     const deconstructedStudy = deconstructStudy(study);
//     expect(deconstructedStudy).toEqual(atoms);
//   });

//   it("Creates atoms from annas study", () => {
//     const study = sleep_study as Study;
//     const atoms = deconstructStudy(study);
//     expect(atoms).toBeTypeOf("object");
//     expect(atoms.size).toBe(11);
//   });

//   it("Creates atoms from maydels study", () => {
//     const study = maydel_study as Study;
//     const atoms = deconstructStudy(study);
//     expect(atoms).toBeTypeOf("object");
//     expect(atoms.size).toBe(28);
//     expect(atoms.get("03seh31m_rw8kgrc")?.content._type).toBe("question");
//   });

//   it("Deconstructs a study", () => {
//     const study: Study = {
//       _id: {
//         $oid: "63b2dc19b698c1722a6deea5",
//       },
//       _type: "study",
//       timestamp: 1672666137078,
//       properties: {
//         _type: "properties",
//         study_id: "TUM_2022_env_trial01",
//         study_name: "Environmental effects on sleep",
//         instructions: "This is a trial",
//         banner_url: "https://getschema.app/img/schema_banner.png",
//         support_email: "anna.biller@tum.de",
//         support_url: "",
//         ethics:
//           "This study was approved by the ethics committee of the TUM with approval #2022-578-S-KH",
//         pls: "",
//         empty_msg: "You're all up to date",
//         post_url: "https: //tuspl22-momentum.srv.mwn.de/post.php",
//         conditions: [],
//         cache: false,
//         created_by: "Anna Biller",
//       },
//       modules: [
//         {
//           type: "survey",
//           _type: "module",
//           name: "Daily sleep diary",
//           submit_text: "Submit",
//           condition: "*",
//           alerts: {
//             title: "Good morning!",
//             message: "Please fill out your daily sleep diary",
//             start_offset: 0,
//             duration: 24,
//             times: [
//               {
//                 hours: 11,
//                 minutes: 0,
//               },
//             ],
//             random: false,
//             random_interval: 0,
//             sticky: true,
//             sticky_label: "",
//             timeout: false,
//             timeout_after: 0,
//           },
//           graph: {
//             display: true,
//             variable: "",
//             title: "",
//             blurb: "",
//             type: "bar",
//             max_points: 10,
//           },
//           id: "Sleep Diary",
//           unlock_after: [],
//           sections: [
//             {
//               id: "FsQaZ2ftBNUu4gtM21M4J",
//               name: "Questions for sleep diary",
//               _type: "section",
//               shuffle: true,
//               questions: [
//                 {
//                   type: "instruction",
//                   id: "hSE7rsNlqwPLfPjexIJgk",
//                   _type: "question",
//                   text: "Here we will ask you about your last main sleep episode. This is usually but does not have to be the the previous night-time sleep episode. Please fill out the diary every morning after waking up.",
//                   required: true,
//                   rand_group: "",
//                   hide_id: "",
//                   hide_value: "",
//                   hide_if: false,
//                 },
//                 {
//                   type: "datetime",
//                   id: "BtcFLqU9v0T07TxjICTwE",
//                   _type: "question",
//                   text: "When did you fall asleep yesterday?",
//                   required: true,
//                   rand_group: "",
//                   subtype: "datetime",
//                   hide_id: "",
//                   hide_value: "",
//                   hide_if: false,
//                 },
//                 {
//                   type: "datetime",
//                   id: "juDISNtklXpBK1EVpnHjj",
//                   _type: "question",
//                   text: "When did you wake up today?",
//                   required: true,
//                   rand_group: "",
//                   subtype: "datetime",
//                   hide_id: "",
//                   hide_value: "",
//                   hide_if: false,
//                 },
//                 {
//                   type: "slider",
//                   id: "JNzZp-Z6iJS7291H2f1OU",
//                   _type: "question",
//                   text: "How would you rate your sleep quality today?",
//                   required: true,
//                   rand_group: "",
//                   min: 1,
//                   max: 4,
//                   hint_left: "very good",
//                   hint_right: "very bad",
//                   hide_id: "",
//                   hide_value: "",
//                   hide_if: false,
//                 },
//                 {
//                   type: "multi",
//                   id: "grbDZ4rA_QJzStWEM9HkY",
//                   _type: "question",
//                   text: "Did you use an alarm clock to wake up?",
//                   required: true,
//                   rand_group: "",
//                   radio: true,
//                   modal: false,
//                   options: [
//                     "yes",
//                     "no but something else woke me up (e.g. bed partner, pet, noise...)",
//                     "no",
//                   ],
//                   shuffle: false,
//                   hide_id: "",
//                   hide_value: "",
//                   hide_if: false,
//                 },
//                 {
//                   type: "multi",
//                   id: "BIRjLhE8QL_tuDQ5QPR9w",
//                   _type: "question",
//                   text: "Do you need to work today?",
//                   required: false,
//                   rand_group: "",
//                   radio: true,
//                   modal: false,
//                   options: [
//                     "yes and I can choose my start time flexibly",
//                     "yes but I cannot choose my start time",
//                     "no ",
//                   ],
//                   shuffle: false,
//                   hide_id: "",
//                   hide_value: "",
//                   hide_if: false,
//                 },
//                 {
//                   type: "slider",
//                   id: "wwvhQUyE_UJHHAGIx1iug",
//                   _type: "question",
//                   text: "How alert/sleepy are you at the moment?",
//                   required: true,
//                   rand_group: "",
//                   min: 1,
//                   max: 10,
//                   hint_left: "very alert",
//                   hint_right: "extremely sleepy, can't keep awake",
//                   hide_id: "",
//                   hide_value: "",
//                   hide_if: false,
//                 },
//               ],
//             },
//           ],
//           shuffle: false,
//         },
//       ],
//     };
//     const atoms = deconstructStudy(study);
//     expect(atoms).toBeTypeOf("object");
//     expect(atoms.size).toBe(11);
//   });
//   it("Deconstructs the monster study", () => {
//     const atoms = deconstructStudy(monster_study as Study);
//     expect(atoms).toBeTypeOf("object");
//     expect(atoms.size).toBe(49);
//   });
// });

// // describe("Validate study", () => {
// //   it("Validates Annas sleep study", () => {
// //     const study_anna: Study = sleep_study;
// //     expect(validateStudy(study_anna)).toBe(true);
// //     expect(validateStudy(constructStudy(deconstructStudy(study_anna)))).toBe(true);
// //   });
// // });
