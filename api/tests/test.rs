// use api::generate_metadata;
// use api::Question::{Datetime, Instruction, Media, Multi, Slider, Text, YesNo};
// use api::*;

// #[test]
// fn get_time_stamp() {
//     assert_eq!(timestamp("Mon Jul 25 11:08:10 2022 +0000",), 1658747290000);
// }

// #[test]
// fn create_metadata() {
//     let result = generate_metadata(&"demo".to_string());
//     assert!(result.is_ok());
//     let result = result.unwrap();
//     assert_eq!(result.url , "https://tuspl22-momentum.srv.mwn.de/api/v1/studies/demo".to_string());
//     assert_eq!(result.commits , vec![Commit {
//         id: "386ba053953914f9ea66961c21ffa12b5f346429".to_string(), timestamp: 1658490810000
//     }]);
// }

// #[test]
// fn create_metadata_for_multiple_commits() {
//     let result = generate_metadata(&"mpi_melatonin_validation_2022".to_string());
//     assert!(result.is_ok());
//     let result = result.unwrap();
//     assert_eq!(result.url , "https://tuspl22-momentum.srv.mwn.de/api/v1/studies/mpi_melatonin_validation_2022".to_string());
//     assert_eq!(result.commits , vec![
//         Commit {
//             id: "549302cd9e8a7fd460a171bbf73e81f61e10299a".to_string(),
//             timestamp: 1660237786000,
//         },
//         Commit {
//             id: "1c079564401db3040e7b99f39d68c4f3443988af".to_string(),
//             timestamp: 1658754032000,
//         },
//         Commit {
//             id: "7635e5cb10129a2893fd91b8f703247ec38eaaa1".to_string(),
//             timestamp: 1658753643000,
//         },
//         Commit {
//             id: "77aac52a90b35ea376d97784e1d0f06c03f55f67".to_string(),
//             timestamp: 1658749876000,
//         },
//         Commit {
//             id: "d4749bbe428ff560c3c65339d74df615ddbd24bf".to_string(),
//             timestamp: 1658749413000,
//         },
//         Commit {
//             id: "fee6eb4863f7944128a6d121e33fb987ad564e47".to_string(),
//             timestamp: 1658749291000,
//         },
//         Commit {
//             id: "447503a37759146274ea0c10d786e892ad4a7d6e".to_string(),
//             timestamp: 1658749021000,
//         },
//         Commit {
//             id: "3805c40c7749571ff08e54137feec9d6bfdbe323".to_string(),
//             timestamp: 1658745638000,
//         },
//         Commit {
//             id: "91ce65cf82695e5926cd9b59b818867442487c08".to_string(),
//             timestamp: 1658738422000,
//         },
//     ],);}

// #[test]
// fn it_works() {
//     let result = 2 + 2;
//     assert_eq!(result, 4);
// }
// #[test]
// fn test_testing() {
//     assert_eq!(1, 1);
// }

// #[test]
// fn test_get_study() {
//     let study = Study {
//         metadata : Some(Metadata {
//             commits:vec![Commit {
//                 id: "386ba053953914f9ea66961c21ffa12b5f346429".to_string(), timestamp: 1658490810000
//             }],
//             url: "https://tuspl22-momentum.srv.mwn.de/api/v1/studies/demo".to_string(),
//         }),
//         properties: Properties {
//             study_id: "3ZDOGAH".to_string(),
//             study_name: "Demo".to_string(),
//             instructions: "This is a demo study showing the features of schema".to_string(),
//             banner_url: "https://getschema.app/img/schema_banner.png".to_string(),
//             support_email: "hello@getschema.app".to_string(),
//             support_url: "https://getschema.app".to_string(),
//             ethics: "This study was approved by ethics body with approval #123456789".to_string(),
//             pls: "https://getschema.app/pls-file-link.pdf".to_string(),
//             empty_msg: "You're all up to date".to_string(),
//             post_url: "https://tuspl22-momentum.srv.mwn.de/redcap/import".to_string(),
//             conditions: vec![
//                 "Control".to_string(),
//                 "Treatment".to_string(),
//             ],
//             cache: false,
//             created_by: "Adrian Shatte".to_string(),
//         },
//         modules: vec![
//             Module {
//                 r#type: "info".to_string(),
//                 name: "Welcome".to_string(),
//                 submit_text: "Submit".to_string(),
//                 condition: "Control".to_string(),
//                 alerts: Alert {
//                     title: "Welcome to the study".to_string(),
//                     message: "Tap to open the app".to_string(),
//                     start_offset: 0,
//                     duration: 1,
//                     times: vec![
//                         Time {
//                             hours: 8,
//                             minutes: 30,
//                         },
//                     ],
//                     random: true,
//                     random_interval: 30,
//                     sticky: true,
//                     sticky_label: "Start here".to_string(),
//                     timeout: false,
//                     timeout_after: 0,
//                 },
//                 graph: Graph {
//                     display: false,
//                     variable: None,
//                     title: None,
//                     blurb: None,
//                     r#type: None,
//                     max_points: None,
//                 },
//                 sections: vec![
//                     Section {
//                         name: "Welcome".to_string(),
//                         shuffle: false,
//                         questions: vec![
//                             Instruction {
//                                 id: "instruction-1wnjocfw".to_string(),
//                                 text: "Hello! Welcome to the study! This module only shows for those enrolled in the control condition.".to_string(),
//                                 required: false,
//                                 rand_group: None,
//                             },
//                         ],
//                     },
//                 ],
//                 uuid: "3fb09fcd-4fca-4074-a395-34d65ee5a521".to_string(),
//                 unlock_after: vec![],
//                 shuffle: false,
//             },
//             Module {
//                 r#type: "survey".to_string(),
//                 name: "Elements".to_string(),
//                 submit_text: "Submit".to_string(),
//                 condition: "*".to_string(),
//                 alerts: Alert {
//                     title: "Elements Demo".to_string(),
//                     message: "Tap to open app".to_string(),
//                     start_offset: 1,
//                     duration: 5,
//                     times: vec![
//                         Time {
//                             hours: 9,
//                             minutes: 30,
//                         },
//                         Time {
//                             hours: 12,
//                             minutes: 30,
//                         },
//                         Time {
//                             hours: 15,
//                             minutes: 30,
//                         },
//                         Time {
//                             hours: 18,
//                             minutes: 30,
//                         },
//                     ],
//                     random: true,
//                     random_interval: 30,
//                     sticky: false,
//                     sticky_label: "".to_string(),
//                     timeout: true,
//                     timeout_after: 30,
//                 },
//                 graph: Graph {
//                     display: true,
//                     variable: Some(
//                         "slider-0yih1evt".to_string(),
//                     ),
//                     title: Some(
//                         "Slider Graph".to_string(),
//                     ),
//                     blurb: Some(
//                         "This graph displays the values from the slider element as a bar graph, displaying the past 7 responses.".to_string(),
//                     ),
//                     r#type: Some(
//                         "bar".to_string(),
//                     ),
//                     max_points: Some(
//                         7,
//                     ),
//                 },
//                 sections: vec![
//                     Section {
//                         name: "Section 1".to_string(),
//                         shuffle: false,
//                         questions: vec![
//                             Instruction {
//                                 id: "instruction-pvke1yey".to_string(),
//                                 text: "This is an instruction type.".to_string(),
//                                 required: false,
//                                 rand_group: None,
//                             },
//                             Text {
//                                 id: "text-71nnpqzi".to_string(),
//                                 text: "This is a text input type.".to_string(),
//                                 required: true,
//                                 rand_group: None,
//                                 subtype: "short".to_string(),
//                             },
//                             Datetime {
//                                 id: "datetime-79ygddzl".to_string(),
//                                 text: "This is a date input type (date only).".to_string(),
//                                 required: true,
//                                 rand_group: None,
//                                 subtype: "date".to_string(),
//                             },
//                             Multi {
//                                 id: "multi-q8bohlar".to_string(),
//                                 text: "This is a multiple choice type with branching demo.".to_string(),
//                                 required: true,
//                                 rand_group: None,
//                                 radio: true,
//                                 modal: false,
//                                 options: vec![
//                                     "apple".to_string(),
//                                     "orange".to_string(),
//                                     "banana".to_string(),
//                                 ],
//                                 shuffle: true,
//                                 hide_id: Some(
//                                     "".to_string(),
//                                 ),
//                                 hide_value: Some(
//                                     "".to_string(),
//                                 ),
//                                 hide_if: Some(
//                                     true,
//                                 ),
//                             },
//                             Instruction {
//                                 id: "instruction-mof4ymv4".to_string(),
//                                 text: "This will only show if the user selects banana from the previous question".to_string(),
//                                 required: false,
//                                 rand_group: None,
//                             },
//                         ],
//                     },
//                     Section {
//                         name: "Section 2".to_string(),
//                         shuffle: false,
//                         questions: vec![
//                             Media {
//                                 id: "media-o3p069gi".to_string(),
//                                 text: "This is a media type.".to_string(),
//                                 required: false,
//                                 rand_group: None,
//                                 subtype: "image".to_string(),
//                                 src: "https://getschema.app/img/schema_banner.jpg".to_string(),
//                                 thumb: "".to_string(),
//                             },
//                             Slider {
//                                 id: "slider-0yih1evt".to_string(),
//                                 text: "This is a slider type".to_string(),
//                                 required: true,
//                                 rand_group: None,
//                                 min: 0,
//                                 max: 10,
//                                 hint_left: "less".to_string(),
//                                 hint_right: "more".to_string(),
//                                 hide_id: Some(
//                                     "".to_string(),
//                                 ),
//                                 hide_value: Some(
//                                     "".to_string(),
//                                 ),
//                                 hide_if: Some(
//                                     true,
//                                 ),
//                             },
//                             YesNo {
//                                 id: "yesno-mv09ggb1".to_string(),
//                                 text: "This is a switch".to_string(),
//                                 required: true,
//                                 rand_group: None,
//                                 yes_text: "Yes".to_string(),
//                                 no_text: "No".to_string(),
//                                 hide_id: Some(
//                                     "".to_string(),
//                                 ),
//                                 hide_value: Some(

//                                         api::StringOrBool::String("".to_string()),

//                                 ),
//                                 hide_if: Some(
//                                     true,
//                                 ),
//                             },
//                         ],
//                     },
//                 ],
//                 uuid: "dee87a08-8616-453a-9a6e-9e8f8ea9c942".to_string(),
//                 unlock_after: vec![],
//                 shuffle: false,
//             },
//         ],
//     };
//     let studies = init_study_repository();

//     let result = get_study(studies, "demo".to_string(), None).unwrap();
//     assert_eq!(result, study)
// }

// #[test]
// fn test_get_study_nonexistent() {
//     let studies = init_study_repository();

//     let result = get_study(studies, "fail".to_string(), None);
//     assert_eq!(result, Err(Error::StudyNotFound))
// }
// // #[test]
// // fn test_get_studies() -> Result<(), Error> {
// //     let result = get_studies()?;
// //     let num_of_studies = fs::read_dir("studies")?.count();
// //     if result.len() == num_of_studies -4 { // some are invalid
// //         Ok(())
// //     } else {
// //         println!("Expected {} studies, got {}", num_of_studies, result.len());
// //         Err(Error::StudiesNotFound)
// //     }

// // }

// // // #[cfg(test)]
// // mod tests {
// //     use super::*;
// //     use actix_web::{http::header::ContentType, test, web, App};

// //     // #[actix_web::test]
// //     // async fn test_index_get() {
// //     //     let app = test::init_service(App::new().route("/".to_string(), web::get().to(greet))).await;
// //     //     let req = test::TestRequest::default()
// //     //         .insert_header(ContentType::plaintext())
// //     //         .to_request();
// //     //     let resp = test::call_service(&app, req).await;
// //     //     assert!(resp.status().is_success());
// //     // }

// //     // #[actix_web::test]
// //     // async fn test_index_post() {
// //     //     let app = test::init_service(App::new().route("/".to_string(), web::get().to(index))).await;
// //     //     let req = test::TestRequest::post().uri("/").to_request();
// //     //     let resp = test::call_service(&app, req).await;
// //     //     assert!(resp.status().is_client_error());
// //     // }

// //     // #[test]
// //     // fn test_greet() {
// //     //     let req = test::TestRequest::default().to_http_request();
// //     //     let res = greet().await;
// //     //     assert_eq!(res.status(), http::StatusCode::OK);
// //     // }
// //     #[test]
// //     fn test_testing() {
// //         assert_eq!(1, 1);
// //     }
// // }
