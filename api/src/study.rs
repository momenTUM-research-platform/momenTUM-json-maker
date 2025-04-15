use std::fmt;

use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Study {
    pub _id: Option<ObjectId>,
    pub _type: String,
    pub timestamp: Option<i64>, // time of upload
    pub properties: Properties,
    pub modules: Vec<Modules>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Properties {
    pub _type: String,
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
    #[serde(default)]
    pub redcap_server_api_url: Option<String>
}
#[derive(Clone, Serialize, Deserialize)]
pub struct Modules {
    pub _type: String,
    pub id: String,
    pub name: String,
    pub condition: String,
    pub alerts: Alert,
    pub graph: GraphOrNoGraph,
    pub unlock_after: Vec<String>,
    pub params: Params,
}


#[derive(Clone, Serialize, Deserialize)]
pub struct Survey {
    pub r#type: String,
    pub _type: String,
    pub submit_text: String,
    pub id: String,
    pub sections: Vec<Section>,
    pub shuffle: bool,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Pvt {
    pub r#type: String,
    pub _type: String,
    pub id: String,
    pub trials: i32,
    pub min_waiting: i32,
    pub max_waiting: i32,
    pub max_reaction: i32,
    pub show: bool,
    pub exit: bool,
}

#[derive(Clone, Serialize, Deserialize)]
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
#[derive(Clone, Serialize, Deserialize)]
pub struct Time {
    pub hours: i8,
    pub minutes: i8,
}
#[derive(Clone, Serialize, Deserialize)]
pub struct Graph {
    pub display: bool, //true
    pub variable: String,
    pub title: String,
    pub blurb: String,
    pub r#type: String,
    pub max_points: i32,
}
#[derive(Clone, Serialize, Deserialize)]
pub struct NoGraph {
    pub display: bool, // false
}
#[derive(Clone, Serialize, Deserialize)]
pub struct Section {
    pub id: String,
    pub name: String,
    _type: String,
    pub shuffle: bool,
    pub questions: Vec<Question>,
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Question {
    #[serde(rename = "text")]
    Text {
        id: String,
        _type: String,
        text: String,
        required: bool,
        rand_group: Option<String>,
        subtype: String,
        hide_id: Option<String>,
        hide_value: Option<StringOrBool>,
        hide_if: Option<bool>,
    },
    #[serde(rename = "datetime")]
    Datetime {
        id: String,
        _type: String,
        text: String,
        required: bool,
        rand_group: Option<String>,
        subtype: String,
        hide_id: Option<String>,
        hide_value: Option<StringOrBool>,
        hide_if: Option<bool>,
    },
    #[serde(rename = "yesno")]
    YesNo {
        id: String,
        _type: String,
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
        _type: String,
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
        _type: String,
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
        _type: String,
        text: String,
        required: bool,
        rand_group: Option<String>,
        subtype: String,
        src: String,
        thumb: Option<String>,
        hide_id: Option<String>,
        hide_value: Option<StringOrBool>,
        hide_if: Option<bool>,
    },
    #[serde(rename = "instruction")]
    Instruction {
        id: String,
        _type: String,
        text: String,
        required: bool,
        rand_group: Option<String>,
        hide_id: Option<String>,
        hide_value: Option<StringOrBool>,
        hide_if: Option<bool>,
    },
    #[serde(rename = "photo")]
    Photo {
        id: String,
        _type: String,
        text: String,
        required: bool,
        rand_group: Option<String>,
        hide_id: Option<String>,
        hide_value: Option<StringOrBool>,
        hide_if: Option<bool>,
    },
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum StringOrBool {
    String(String),
    Bool(bool),
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
/// Enumeration of all the different Parameters.
/// https://serde.rs/enum-representations.html
///
/// Info parameters are treated as surveys, because they are a strict subset.
pub enum Params {
    Pvt(Pvt),
    Survey(Survey),
}

impl Params {
    pub fn get_id(&self) -> Option<String> {
        match self {
            Params::Survey(survey) => Some(survey.id.clone()),
            Params::Pvt(pvt) => Some(pvt.id.clone()),
        }
    }
    pub fn get_name(&self) -> Option<String> {
        match self {
            Params::Survey(survey) => Some(survey.r#type.clone()),
            Params::Pvt(pvt) => Some(pvt.r#type.clone()),
        }
    }
}

impl fmt::Debug for Params {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Params::Pvt(pvt) => write!(f, "Params::Pvt({:?})", pvt),
            Params::Survey(survey) => write!(f, "Params::Survey({:?})", survey),
        }
    }
}

impl fmt::Debug for Pvt {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Customize the formatting of `Pvt` fields here
        write!(
            f,
            "Pvt {{ min_waiting: {}, max_waiting: {}, max_reaction: {} }}",
            self.min_waiting, self.max_waiting, self.max_reaction
        )
    }
}

impl fmt::Debug for Survey {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Customize the formatting of `Pvt` fields here
        write!(
            f,
            "Pvt {{ Sections Length: {}, submit_text: {} }}",
            self.sections.len(), self.submit_text
        )
    }
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GraphOrNoGraph {
    Graph(Graph),
    NoGraph(NoGraph),
}

pub trait BasicQuestion {
    fn get_id(&self) -> &str;
    fn get_text(&self) -> &str;
    fn get_response_data_type(&self) -> &str;
}

// Implement the trait for the enum
impl BasicQuestion for Question {
    fn get_id(&self) -> &str {
        match self {
            Question::Text { id, .. } => id,
            Question::Datetime { id, .. } => id,
            Question::YesNo { id, .. } => id,
            Question::Slider { id, .. } => id,
            Question::Multi { id, .. } => id,
            Question::Media { id, .. } => id,
            Question::Instruction { id, .. } => id,
            Question::Photo { id, .. } => id,
        }
    }

    fn get_text(&self) -> &str {
        match self {
            Question::Text { text, .. } => text,
            Question::Datetime { text, .. } => text,
            Question::YesNo { text, .. } => text,
            Question::Slider { text, .. } => text,
            Question::Multi { text, .. } => text,
            Question::Media { text, .. } => text,
            Question::Instruction { text, .. } => text,
            Question::Photo { id, .. } => id,
        }
    }
    fn get_response_data_type(&self) -> &str {
        "text"
    }
}

