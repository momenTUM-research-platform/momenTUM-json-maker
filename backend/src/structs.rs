pub mod structs {

    use actix_web::{
        body::BoxBody, http::header::ContentType, HttpRequest, HttpResponse, Responder,
        ResponseError,
    };
    use serde::{Deserialize, Serialize};
    use std::{collections::HashMap, fmt::Display, iter::Map};
    use thiserror;

    #[derive(Serialize, Deserialize, Debug)]
    pub struct Study {
        pub properties: Properties,
        pub modules: Vec<Module>,
    }
    #[derive(Serialize, Deserialize, Debug)]
    pub struct Properties {
        pub study_id: String,
        study_name: String,
        instructions: String,
        banner_url: String,
        support_email: String,
        support_url: String,
        ethics: String,
        pls: String,
        empty_msg: String,
        post_url: String,
        conditions: Vec<String>,
        cache: bool,
        created_by: String,
    }
    #[derive(Serialize, Deserialize, Debug)]

    pub struct Module {
        r#type: String,
        name: String,
        submit_text: String,

        condition: String,
        alerts: Alert,
        graph: Graph,
        pub sections: Vec<Section>,

        uuid: String,
        unlock_after: Vec<String>,
        shuffle: bool,
    }
    #[derive(Serialize, Deserialize, Debug)]

    pub struct Alert {
        title: String,
        message: String,
        start_offset: i32,
        duration: i32,
        times: Vec<Time>,
        random: bool,
        random_interval: i32,
        sticky: bool,
        sticky_label: String,
        timeout: bool,
        timeout_after: i32,
    }
    #[derive(Serialize, Deserialize, Debug)]

    pub struct Time {
        hours: i8,
        minutes: i8,
    }
    #[derive(Serialize, Deserialize, Debug)]

    pub struct Graph {
        display: bool,
        variable: Option<String>,
        title: Option<String>,
        blurb: Option<String>,
        r#type: Option<String>,
        max_points: Option<i32>,
    }
    #[derive(Serialize, Deserialize, Debug)]

    pub struct Section {
        name: String,
        shuffle: bool,
        pub questions: Vec<Question>,
    }

    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    #[serde(tag = "type")]
    pub enum Question {
        instruction {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
        },
        text {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            subtype: String,
        },
        datetime {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            subtype: String,
        },
        yesno {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            yes_text: String,
            no_text: String,
            hide_id: Option<String>,
            hide_value: Option<bool>,
            hide_if: Option<bool>,
        },
        slider {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            min: i32,
            max: i32,
            hint_left: String,
            hint_right: String,
            hide_id: Option<String>,
            hide_value: Option<String>,
            hide_if: Option<bool>,
        },
        multi {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            radio: bool,
            modal: bool,
            options: Vec<String>,
            shuffle: bool,
            hide_id: Option<String>,
            hide_value: Option<String>,
            hide_if: Option<bool>,
        },
        media {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            subtype: String,
            src: String,
            thumb: String,
        },
    }
    // #[derive(Serialize, Deserialize, Debug, PartialEq)]
    // pub struct Instruction {
    //     id: String,
    //     text: String,
    //    // r#type: String, // always "instruction"
    //     required: bool,
    //     rand_group: Option<String>,
    // }
    // #[derive(Serialize, Deserialize, Debug, PartialEq)]

    // pub struct DateTime {
    //     id: String,
    //     text: String,
    //   //  r#type: String, // always "datetime"
    //     required: bool,
    //     rand_group: Option<String>,
    //     subtype: String,
    // }
    // #[derive(Serialize, Deserialize, Debug, PartialEq)]

    // pub struct Text {
    //     id: String,
    //     text: String,
    //   //  r#type: String, // always "text"
    //     required: bool,
    //     rand_group: Option<String>,
    //     subtype: String,
    // }
    // #[derive(Serialize, Deserialize, Debug, PartialEq)]

    // pub struct YesNo {
    //     id: String,
    //     text: String,
    //   //  r#type: String, // always "yesno"
    //     required: bool,
    //     rand_group: Option<String>,
    //     yes_text: String,
    //     no_text: String,
    //     hide_id: Option<String>,
    //     hide_value: Option<bool>,
    //     hide_if: Option<bool>,
    // }
    // #[derive(Serialize, Deserialize, Debug, PartialEq)]

    // pub struct Slider {
    //     id: String,
    //     text: String,
    //     r#type: String, // always "slider"
    //     required: bool,
    //     rand_group: Option<String>,
    //     min: i32,
    //     max: i32,
    //     hint_left: String,
    //     hint_right: String,
    //     hide_id: Option<String>,
    //     hide_value: Option<String>, //  prefix with < or > => <50
    //     hide_if: Option<bool>,
    // }
    // #[derive(Serialize, Deserialize, Debug, PartialEq)]

    // pub struct Multi {
    //     id: String,
    //     text: String,
    //     r#type: String, // always "multi"
    //     required: bool,
    //     rand_group: Option<String>,
    //     radio: bool,
    //     modal: bool,
    //     options: Vec<String>,
    //     shuffle: bool,
    //     hide_id: Option<String>,
    //     hide_value: Option<String>,
    //     hide_if: Option<bool>,
    // }
    // #[derive(Serialize, Deserialize, Debug, PartialEq)]

    // pub struct Media {
    //     id: String,
    //     text: String,
    //     r#type: String, // always "media"
    //     required: bool,
    //     rand_group: Option<String>,
    //     subtype: String,
    //     src: String,
    //     thumb: String,
    // }

    #[derive(Serialize, Deserialize, Debug)]
    pub enum Submission {
        Regular,
        PVT,
    }
    // #[derive(Serialize, Deserialize)]

    pub struct Regular {
        module_index: i32,
        module_name: String,
        responses: Map<String, Response>, // TODO: make this a map of question_id to response
        response_time: String,
        response_time_in_ms: i32,
        alert_time: String,
    }
    #[derive(Serialize, Deserialize, Debug)]

    pub struct PVT {
        module_index: i32,
        module_name: String,
        entries: Vec<i8>,
        response_time: String,
        response_time_in_ms: i32,
        alert_time: String,
    }
    #[derive(Debug)]
    pub enum ApplicationError {
        CommitError,
        CloneError,
        PullError,
        PushError,
        AddError,
        StudyNotFound,
        StudyInvalid,
        StudyNotSaved,
        StudiesNotFound,
        StudyNotConvertible,
        // RedcapError,
    }

    pub enum Response {
        i32,
        String,
    }
    #[derive(Serialize, Deserialize, Debug)]
    pub struct Key {
        study_id: String,
        adi_key: String,
    }

    impl Responder for Study {
        type Body = BoxBody;

        fn respond_to(self, _req: &HttpRequest) -> HttpResponse<Self::Body> {
            let body = serde_json::to_string(&self).unwrap();

            // Create response and set content type
            HttpResponse::Ok()
                .content_type(ContentType::json())
                .body(body)
        }
    }
    impl ResponseError for ApplicationError {
        fn error_response(&self) -> HttpResponse {
            match self {
                ApplicationError::StudyNotFound => HttpResponse::NotFound().body("Study not found"),
                ApplicationError::StudyInvalid => HttpResponse::BadRequest().finish(),
                ApplicationError::StudyNotConvertible => HttpResponse::BadRequest().finish(),
                _ => HttpResponse::InternalServerError().finish(),
            }
        }
    }

    impl Display for ApplicationError {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            match self {
                ApplicationError::CommitError => {
                    write!(f, "Could not commit study to repository")
                }
                ApplicationError::CloneError => {
                    write!(f, "Could not clone repository")
                }
                ApplicationError::PullError => {
                    write!(f, "Could not pull from repository")
                }
                ApplicationError::PushError => {
                    write!(f, "Could not push to repository")
                }
                ApplicationError::AddError => {
                    write!(f, "Could not add study to repository")
                }
                ApplicationError::StudyNotFound => {
                    write!(f, "Study not found")
                }
                ApplicationError::StudyInvalid => {
                    write!(f, "Study invalid")
                }
                ApplicationError::StudyNotSaved => {
                    write!(f, "Study not saved")
                }
                ApplicationError::StudiesNotFound => {
                    write!(f, "Studies not found")
                }
                ApplicationError::StudyNotConvertible => {
                    write!(f, "Study not convertible to json")
                }
            }
        }
    }

    impl std::error::Error for ApplicationError {}

    impl From<std::io::Error> for ApplicationError {
        fn from(e: std::io::Error) -> Self {
            match e {
                // Add more
                _ => ApplicationError::StudyNotFound,
            }
        }
    }

    impl From<serde_json::Error> for ApplicationError {
        fn from(e: serde_json::Error) -> Self {
            match e {
                // Add more
                _ => ApplicationError::StudyInvalid,
            }
        }
    }
}
