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
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum StringOrBool {
    String(String),
    Bool(bool),
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
/// Enumeration of all the different modules.
/// https://serde.rs/enum-representations.html
///
/// Info modules are treated as surveys, because they are a strict subset.
pub enum Modules {
    Pvt(Pvt),
    Survey(Survey),
    Video, // These three are not yet implemented
    Audio,
}

impl Modules {
    pub fn get_id(&self) -> Option<String> {
        match self {
            Modules::Survey(survey) => Some(survey.id.clone()),
            Modules::Pvt(pvt) => Some(pvt.id.clone()),
            _ => None,
        }
    }
    pub fn get_name(&self) -> Option<String> {
        match self {
            Modules::Survey(survey) => Some(survey.name.clone()),
            Modules::Pvt(pvt) => Some(pvt.name.clone()),
            _ => None,
        }
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
        }
    }
    fn get_response_data_type(&self) -> &str {
        "text"
    }
}

#[cfg(test)]
mod test {
    #[test]
    fn deserialize_sleep_study() {
        let json = include_str!("../../studies/sleep.json");
        let study: super::Study = serde_json::from_str(json).unwrap();
        assert_eq!(study.properties.created_by, "Anna Biller")
    }
    #[test]
    fn deserialize_monster_study() {
        let json = include_str!("../../studies/monster.json");
        let study: super::Study = serde_json::from_str(json).unwrap();
        assert_eq!(study.properties.created_by, "Constantin Goeldel")
    }

    #[test]
    fn deserialize_pilot_study() {
        let json = include_str!("../../studies/pilot.json");
        let study: super::Study = serde_json::from_str(json).unwrap();
        assert_eq!(study.properties.study_id, "acticut_v1")
    }
    #[test]
    fn deserialize_alert() {
        let json = r#"{
            "title": "Wear LOG",
            "message": "Remember to log your watch wear!",
            "duration": 20,
            "times": [
                {
                    "hours": 18,
                    "minutes": 30
                }
            ],
            "random": false,
            "random_interval": 0,
            "sticky": true,
            "sticky_label": "logs",
            "timeout": false,
            "timeout_after": 0,
            "start_offset": 0
        }"#;
        let alert: super::Alert = serde_json::from_str(json).unwrap();
        assert_eq!(alert.title, "Wear LOG");
    }
    #[test]
    fn test_pvt() {
        let json = include_str!("../../studies/monster.json");
        let study: super::Study = serde_json::from_str(json).unwrap();
        let pvt = &study.modules[2];
        match pvt {
            super::Modules::Pvt(pvt) => {
                assert_eq!(pvt.min_waiting, 200);
                assert!(pvt.max_waiting > 200);
                assert!(pvt.max_reaction > pvt.max_waiting);
            }
            _ => panic!("Expected a pvt module"),
        }
    }

    #[test]
    fn test_survey() {
        let json = include_str!("../../studies/monster.json");
        let study: super::Study = serde_json::from_str(json).unwrap();
        let survey = &study.modules[0];
        match survey {
            super::Modules::Survey(survey) => {
                assert_eq!(survey.sections.len(), 4);
            }
            _ => panic!("Expected a survey module"),
        }
    }
}
