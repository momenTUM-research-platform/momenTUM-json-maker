use std::fmt;

use actix_web::{body::BoxBody, http::header::ContentType, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct Study {
    pub properties: Properties,
    pub modules: Vec<Module>,
    pub metadata: Option<Metadata>,
}

impl Study {
    fn to_string(&self) -> String {
        serde_json::to_string(self).unwrap()
    }
}
impl fmt::Display for Study {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.to_string())
    }
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

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct Metadata {
    pub commit: String,
    pub timestamp: i64,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
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
#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
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
#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
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
#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct Time {
    pub hours: i8,
    pub minutes: i8,
}
#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct Graph {
    pub display: bool,
    pub variable: Option<String>,
    pub title: Option<String>,
    pub blurb: Option<String>,
    pub r#type: Option<String>,
    pub max_points: Option<i32>,
}
#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct Section {
    pub name: String,
    pub shuffle: bool,
    pub questions: Vec<Question>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
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
#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
#[serde(untagged)]
pub enum StringOrBool {
    String(String),
    Bool(bool),
}
