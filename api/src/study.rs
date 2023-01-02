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
#[derive(Clone, Serialize, Deserialize)]
pub struct Survey {
    pub r#type: String,
    pub _type: String,
    pub name: String,
    pub submit_text: String,
    pub condition: String,
    pub alerts: Alert,
    pub graph: GraphOrNoGraph,
    pub id: String,
    pub unlock_after: Vec<String>,

    pub sections: Vec<Section>,
    pub shuffle: bool,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Pvt {
    pub r#type: String,
    pub _type: String,
    pub name: String,
    pub submit_text: String,
    pub condition: String,
    pub alerts: Alert,
    pub id: String,
    pub unlock_after: Vec<String>,
    pub graph: GraphOrNoGraph,

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
        thumb: String,
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
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum StringOrBool {
    String(String),
    Bool(bool),
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum Modules {
    Survey(Survey),
    Pvt(Pvt),
    Info, // These three are not yet implemented
    Video,
    Audio,
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GraphOrNoGraph {
    Graph(Graph),
    NoGraph(NoGraph),
}
