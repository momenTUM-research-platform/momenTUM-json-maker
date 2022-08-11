pub mod structs {

    use actix_web::{
        body::BoxBody, http::header::ContentType, HttpRequest, HttpResponse, Responder,
        ResponseError,
    };
    use serde::{Deserialize, Serialize};
    use std::{fmt::Display, sync::Mutex};

    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    pub struct Study {
        pub properties: Properties,
        pub modules: Vec<Module>,
        pub metadata: Option<Metadata>,
    }

    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    pub struct Metadata {
        pub commits: Vec<Commit>,
        pub url: String,
    }

    #[derive(Serialize, Deserialize, Debug, PartialEq)]
    pub struct Commit {
        pub id: String,
        pub timestamp: i64,
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

    #[derive(Debug, PartialEq)]
    pub enum ApplicationError {
        CommitError,
        CloneError,
        PullError,
        PushError,
        AddError,
        CheckoutError(String, String),
        StudyNotFound,
        StudyInvalid(String),
        GenerateMetadataError,
        StudyNotSaved,
        StudiesNotFound,
        StudyNotConvertible,

        NoCorrespondingAPIKey,
        NoEntriesOrResponses,
        RedcapAuthenicationError,
        RedcapError(String), // RedcapError,
    }

    #[derive(Serialize, Deserialize, Debug, Clone)]
    pub struct Key {
        pub study_id: String,
        pub api_key: String,
    }

    pub struct AppState {
        pub keys: Mutex<Vec<Key>>,
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

    impl Responder for Metadata {
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
                ApplicationError::CheckoutError(commit, error) => {
                    write!(
                        f,
                        "Could not checkout commit {commit}. \n \nDetails: {error}",
                    )
                }
                ApplicationError::GenerateMetadataError => {
                    write!(f, "Could not generate metadata")
                }
                ApplicationError::StudyNotFound => {
                    write!(f, "Study not found")
                }
                ApplicationError::StudyInvalid(e) => {
                    write!(f, "Study invalid: {}", e)
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
                ApplicationError::NoCorrespondingAPIKey => {
                    write!(f, "No corresponding API key found")
                }

                ApplicationError::NoEntriesOrResponses => {
                    write!(
                        f,
                        "No entries or responses found. Must contain any of the two."
                    )
                }
                ApplicationError::RedcapAuthenicationError => {
                    write!(f, "Redcap authentication error. Is the API key correct?")
                }
                ApplicationError::RedcapError(e) => {
                    write!(f, "Redcap error: {}", e)
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
                _ => ApplicationError::StudyInvalid(e.to_string()),
            }
        }
    }
}
