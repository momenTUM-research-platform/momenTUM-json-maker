pub mod structs {

    use actix_web::{
        body::BoxBody, http::header::ContentType, HttpRequest, HttpResponse, Responder,
        ResponseError,
    };
    use serde::{Deserialize, Serialize};
    use std::{fmt::Display, iter::Map};

    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    pub struct Study {
        pub properties: Properties,
        pub modules: Vec<Module>,
    }
    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    pub struct Properties {
        pub study_id: String,
        pub study_name: String,
        pub instructions: String,
        pub banner_url: String,
        pub support_email: String,
        pub support_url: String,
        pub ethics: String,
        pub pls: String,
        pub empty_msg: String,
        pub post_url: String,
        pub conditions: Vec<String>,
        pub cache: bool,
        pub created_by: String,
    }
    #[derive(Serialize, Deserialize, Debug, PartialEq)]

    pub struct Module {
        pub r#type: String,
        pub name: String,
        pub submit_text: String,
        pub condition: String,
        pub alerts: Alert,
        pub graph: Graph,
        pub sections: Vec<Section>,
        pub uuid: String,
        pub unlock_after: Vec<String>,
        pub shuffle: bool,
    }
    #[derive(Serialize, Deserialize, Debug, PartialEq)]

    pub struct Alert {
        pub title: String,
        pub message: String,
        pub start_offset: i32,
        pub duration: i32,
        pub times: Vec<Time>,
        pub random: bool,
        pub random_interval: i32,
        pub sticky: bool,
        pub sticky_label: String,
        pub timeout: bool,
        pub timeout_after: i32,
    }
    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    pub struct Time {
        pub hours: i8,
        pub minutes: i8,
    }
    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    pub struct Graph {
        pub display: bool,
        pub variable: Option<String>,
        pub title: Option<String>,
        pub blurb: Option<String>,
        pub r#type: Option<String>,
        pub max_points: Option<i32>,
    }
    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    pub struct Section {
        pub name: String,
        pub shuffle: bool,
        pub questions: Vec<Question>,
    }

    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    #[serde(tag = "type")]
    pub enum Question {
        #[serde(rename = "instruction")]
        Instruction {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
        },
        #[serde(rename = "text")]
        Text {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            subtype: String,
        },
        #[serde(rename = "datetime")]
        Datetime {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            subtype: String,
        },
        #[serde(rename = "yesno")]
        YesNo {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            yes_text: String,
            no_text: String,
            hide_id: Option<String>,
            hide_value: Option<StringOrBool>,
            hide_if: Option<bool>,
        },
        #[serde(rename = "slider")]
        Slider {
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
        #[serde(rename = "multi")]
        Multi {
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
        #[serde(rename = "media")]
        Media {
            id: String,
            text: String,
            required: bool,
            rand_group: Option<String>,
            subtype: String,
            src: String,
            thumb: String,
        },
    }
    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    #[serde(untagged)]
    pub enum StringOrBool {
        String(String),
        Bool(bool),
    }

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
    #[derive(Debug, PartialEq)]
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
    #[derive(Serialize, Deserialize, Debug, Clone)]
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
            HttpResponse::BadRequest().body(format!("Error while handling the request: {}", self))
            // match self {
            //     ApplicationError::StudyNotFound => HttpResponse::NotFound()
            //         .body(format!("Error while handling the request: {}", self)),
            //     ApplicationError::StudyInvalid => HttpResponse::BadRequest().finish(),
            //     ApplicationError::StudyNotConvertible => HttpResponse::BadRequest().finish(),
            //     _ => HttpResponse::InternalServerError().finish(),
            // }
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
