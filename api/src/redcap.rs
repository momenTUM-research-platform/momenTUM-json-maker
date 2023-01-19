use crate::study::{BasicQuestion, Modules, Question};
use crate::Result;
use crate::{error::Error, study::Study, Key, ACTIVE_DB, DB};
use mongodb::bson::doc;
use mongodb::bson::oid::ObjectId;
use mongodb::options::FindOneOptions;
use rocket_db_pools::Connection;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::env;
use std::str::FromStr;
use std::sync::Arc;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(untagged)]
enum Entry {
    Integer(i64),
    Text(String),
    Entries(Vec<i8>),
}

#[derive(Serialize, FromForm)]
pub struct Log {
    pub data_type: String,
    pub user_id: String,
    pub study_id: String,
    pub module_index: i32,
    pub platform: String,

    pub page: String,
    pub event: String,
    pub timestamp: String,
    pub timestamp_in_ms: i64,
}

#[derive(Serialize, FromForm)]
pub struct Response {
    pub data_type: String,
    pub user_id: String,
    pub study_id: String,
    pub module_index: i32,
    pub platform: String,

    pub module_name: String,
    pub responses: Option<String>, // JSON of type HashMap<String, Response>
    pub entries: Option<Vec<i8>>,
    pub response_time: String,
    pub response_time_in_ms: i64,
    pub alert_time: String,
}

#[derive(Serialize, Deserialize)]
pub struct Payload {
    token: String,
    content: String,
    format: String,
    r#type: String,
    data: String,
}

const REDCAP_API_URL: &str = "https://tuspl22-redcap.srv.mwn.de/redcap/api/";

pub async fn import_response(db: Connection<DB>, res: Response) -> Result<()> {
    let filter = doc! { "$or": [ {"properties.study_id": &res.study_id}, {"_id": ObjectId::from_str(&res.study_id).unwrap_or_default()}]};

    let study = db
        .database(ACTIVE_DB)
        .collection::<Study>("studies")
        .find_one(
            filter,
            FindOneOptions::builder()
                .sort(doc! { "timestamp": -1})
                .show_record_id(true)
                .build(),
        )
        .await?;

    if study.is_none() {
        return Err(Error::StudyNotFound);
    }

    let study = study.expect("Study should be present");

    // Get API key from DB
    let key = db
        .database(ACTIVE_DB)
        .collection::<Key>("keys")
        .find_one(doc! { "study_id": &res.study_id }, None)
        .await?;
    if key.is_none() {
        return Err(Error::NoCorrespondingAPIKey);
    }
    let key = key.expect("Key should be present");

    // Either the module name or the module id should be present
    // This will be reduced to just the module id when https://github.com/momenTUM-research-platform/momenTUM-app/issues/79 is fixed.
    // Then, the database lookup will not be neccessary anymore.
    let module = study.modules.iter().find(|m| {
        (m.get_name().is_some() && m.get_name().unwrap() == res.module_name)
            || (m.get_id().is_some() && m.get_id().unwrap() == res.module_name)
    });

    if module.is_none() {
        return Err(Error::StudyParsing(
            "The module name does not correspond to a module id".to_string(),
        ));
    }

    let module_id = module.unwrap().get_id().unwrap();

    // Create Redcap record, including module index for uniqueness
    let mut record: HashMap<String, Entry> = HashMap::from([
        (
            format!("field_record_id").to_string(),
            Entry::Text(res.user_id.to_string()),
        ),
        (
            "redcap_repeat_instrument".to_string(),
            Entry::Text(String::from("module_") + &module_id),
        ),
        (
            "redcap_repeat_instance".to_string(),
            Entry::Text("new".to_string()),
        ),
        (
            format!("field_response_time_in_ms_{}", &res.module_index),
            Entry::Integer(res.response_time_in_ms),
        ),
        (
            format!("field_response_time_{}", &res.module_index),
            Entry::Text(res.response_time.clone()),
        ),
    ]);

    if let Some(ref response) = res.responses {
        let response: HashMap<String, Entry> = serde_json::from_str(response.as_str())?;
        response.iter().for_each(|(k, v)| {
            record.insert(format!("field_{}", k), v.clone());
        });
    };

    if let Some(entries) = res.entries.clone() {
        record.insert("entries".to_string(), Entry::Entries(entries));
    };
    db.database(ACTIVE_DB)
        .collection::<HashMap<String, Entry>>("responses")
        .insert_one(&record, None)
        .await?;

    println!("Record: {:#?}", record);
    let payload = Payload {
        token: key.api_key,
        content: "record".to_string(),
        format: "json".to_string(),
        r#type: "flat".to_string(),
        data: serde_json::to_string(&vec![record]).unwrap(),
    };

    let response = reqwest::Client::new()
        .post(REDCAP_API_URL)
        .form(&payload)
        .send()
        .await?;

    match response.status() {
        reqwest::StatusCode::OK => Ok(()),
        reqwest::StatusCode::FORBIDDEN => {
            println!("Forbidden: {:#?}", response.text().await.unwrap());
            Err(Error::RedcapAuthenication)
        }
        _ => {
            let content = response.text().await.unwrap();
            println!("Error: {content:#?}");
            Err(Error::Redcap(content))
        }
    }
}

pub type ApiKey = String;

pub async fn create_project(study: &Study) -> Result<ApiKey> {
    let super_api_token = env::var("REDCAP_SUPER_API_TOKEN").unwrap();

    let mut project: HashMap<&str, &str> = HashMap::new();
    project.insert("project_title", &study.properties.study_name);
    project.insert("purpose", "2"); // 2 = Research
    project.insert("is_longitudinal", "1"); // 1 = Yes
    project.insert("surveys_enabled", "1"); // 1 = Yes
    project.insert("record_autonumbering_enabled", "0"); // 0 = No
    project.insert("project_notes", &study.properties.instructions);

    let payload = Payload {
        token: super_api_token,
        content: "project".to_string(),
        format: "json".to_string(),
        r#type: "flat".to_string(),
        data: serde_json::to_string(&vec![project]).unwrap(),
    };

    let response = reqwest::Client::new()
        .post(REDCAP_API_URL)
        .form(&payload)
        .send()
        .await?;

    match response.status() {
        reqwest::StatusCode::OK => Ok(response.text().await.unwrap()),
        reqwest::StatusCode::FORBIDDEN => {
            println!("Forbidden: {:#?}", response.text().await.unwrap());
            Err(Error::RedcapAuthenication)
        }
        _ => {
            let content = response.text().await.unwrap();
            println!("Error: {content:#?}");
            Err(Error::Redcap(content))
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct MetaData<'a> {
    field_name: String,
    form_name: String,
    section_header: &'a str,
    field_type: &'a str,
    field_label: &'a str,
    select_choices_or_calculations: &'a str,
    field_note: &'a str,
    text_validation_type_or_show_slider_number: &'a str,
    text_validation_min: &'a str,
    text_validation_max: &'a str,
    identifier: &'a str,
    branching_logic: &'a str,
    required_field: &'a str,
    custom_alignment: &'a str,
    question_number: &'a str,
    matrix_group_name: &'a str,
    matrix_ranking: &'a str,
    field_annotation: &'a str,
}

impl<'a> MetaData<'a> {
    fn create(
        field_name: String,
        form_name: &'a str,
        field_type: &'a str,
        field_label: &'a str,
    ) -> Self {
        MetaData {
            field_name: String::from("field_") + &field_name, // field_name must not start with a number
            form_name: String::from("module_") + &form_name,
            section_header: "",
            field_type,
            field_label,
            select_choices_or_calculations: "",
            field_note: "",
            text_validation_type_or_show_slider_number: "",
            text_validation_min: "",
            text_validation_max: "",
            identifier: "",
            branching_logic: "",
            required_field: "",
            custom_alignment: "",
            question_number: "",
            matrix_group_name: "",
            matrix_ranking: "",
            field_annotation: "",
        }
    }
}
// https://tuspl22-redcap.srv.mwn.de/redcap/api/help/index.php?content=imp_metadata
pub async fn import_metadata(study: &Study, api_key: ApiKey) -> Result<()> {
    let mut dictionary: Vec<MetaData> = Vec::new();

    for (i, module) in study.modules.iter().enumerate() {
        match module {
            Modules::Info => continue,
            Modules::Survey(survey) => {
                if i == 0 {
                    dictionary.push(MetaData::create(
                        format!("record_id"),
                        &survey.id,
                        "text",
                        "Record ID",
                    ))
                }
                // dictionary.push(MetaData::create(
                //     format!("participant_id_{}", i),
                //     &survey.id,
                //     "text",
                //     "Participant ID",
                // ));
                dictionary.push(MetaData::create(
                    format!("response_time_in_ms_{}", i),
                    &survey.id,
                    "text",
                    "Response Time in Milliseconds",
                ));
                dictionary.push(MetaData::create(
                    format!("response_time_{}", i),
                    &survey.id,
                    "text",
                    "Response Time",
                ));
                for section in survey.sections.iter() {
                    for question in section.questions.iter() {
                        match question {
                            Question::Instruction { .. } => continue, // Skip instruction questions
                            _ => (),
                        }

                        let field = MetaData::create(
                            question.get_id().to_string(),
                            &survey.id,
                            question.get_response_data_type(),
                            question.get_text(),
                        );
                        dictionary.push(field);
                    }
                }
            }
            _ => continue, // not implemented for other
        }
    }
    println!("{:#?}", dictionary);

    let payload = Payload {
        token: api_key,
        content: "metadata".to_string(),
        format: "json".to_string(),
        r#type: "flat".to_string(),
        data: serde_json::to_string(&dictionary).unwrap(),
    };

    let response = reqwest::Client::new()
        .post(REDCAP_API_URL)
        .form(&payload)
        .send()
        .await?;
    match response.status() {
        reqwest::StatusCode::OK => Ok(()),
        reqwest::StatusCode::FORBIDDEN => {
            println!("Forbidden: {:#?}", response.text().await.unwrap());
            Err(Error::RedcapAuthenication)
        }
        _ => {
            let content = response.text().await.unwrap();
            println!("Error: {content:#?}");
            Err(Error::Redcap(content))
        }
    }
}
#[derive(Debug, Serialize, Deserialize)]
struct RepeatingInstrument {
    form_name: String,
    custom_form_label: String,
}

pub async fn enable_repeating_instruments(study: &Study, api_key: ApiKey) -> Result<()> {
    let mut repeating_instruments: Vec<RepeatingInstrument> = Vec::new();
    for module in study.modules.iter() {
        match module {
            Modules::Survey(survey) => {
                repeating_instruments.push(RepeatingInstrument {
                    form_name: format!("module_{}", survey.id.clone()),
                    custom_form_label: String::new(),
                });
            }
            _ => continue,
        }
    }
    println!("{:#?}", repeating_instruments);

    let payload = Payload {
        token: api_key,
        content: "repeatingFormsEvents".to_string(),
        format: "json".to_string(),
        r#type: "flat".to_string(),
        data: serde_json::to_string(&repeating_instruments).unwrap(),
    };

    let response = reqwest::Client::new()
        .post(REDCAP_API_URL)
        .form(&payload)
        .send()
        .await?;
    match response.status() {
        reqwest::StatusCode::OK => Ok(()),
        reqwest::StatusCode::FORBIDDEN => {
            println!("Forbidden: {:#?}", response.text().await.unwrap());
            Err(Error::RedcapAuthenication)
        }
        _ => {
            let content = response.text().await.unwrap();
            println!("Error: {content:#?}");
            Err(Error::Redcap(content))
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct UserData<'a> {
    username: &'a str,
    expiration: &'a str,
    data_access_group: &'a str,
    data_access_group_id: &'a str,
    design: u8,
    user_rights: u8,
    data_access_groups: u8,
    reports: u8,
    stats_and_charts: u8,
    manage_survey_participants: u8,
    calendar: u8,
    data_import_tool: u8,
    data_comparison_tool: u8,
    logging: u8,
    file_repository: u8,
    data_quality_create: u8,
    data_quality_execute: u8,
    api_export: u8,
    api_import: u8,
    mobile_app: u8,
    mobile_app_download_data: u8,
    record_create: u8,
    record_rename: u8,
    record_delete: u8,
    lock_records_all_forms: u8,
    lock_records: u8,
    lock_records_customization: u8,
    forms: HashMap<&'a str, u8>, // Needs to be set with the new form
    forms_export: HashMap<&'a str, u8>,
}

impl<'a> UserData<'a> {
    fn create(username: &'a str) -> Self {
        UserData {
            username,
            expiration: "",
            data_access_group: "",
            data_access_group_id: "",
            design: 1,
            user_rights: 1,
            data_access_groups: 1,
            reports: 1,
            stats_and_charts: 1,
            manage_survey_participants: 1,
            calendar: 1,
            data_import_tool: 1,
            data_comparison_tool: 1,
            logging: 1,
            file_repository: 1,
            data_quality_create: 1,
            data_quality_execute: 1,
            api_export: 1,
            api_import: 1,
            mobile_app: 0,
            mobile_app_download_data: 0,
            record_create: 1,
            record_rename: 1,
            record_delete: 1,
            lock_records_all_forms: 1,
            lock_records: 0,
            lock_records_customization: 1,
            forms: HashMap::new(),
            forms_export: HashMap::new(),
        }
    }
}

// https://tuspl22-redcap.srv.mwn.de/redcap/api/help/index.php?content=imp_users
pub async fn import_user(username: &str, api_key: ApiKey) -> Result<()> {
    let user = UserData::create(username);
    let payload = Payload {
        token: api_key,
        content: "user".to_string(),
        format: "json".to_string(),
        r#type: "flat".to_string(),
        data: serde_json::to_string(&vec![user]).unwrap(),
    };

    let response = reqwest::Client::new()
        .post(REDCAP_API_URL)
        .form(&payload)
        .send()
        .await?;

    match response.status() {
        reqwest::StatusCode::OK => Ok(()),
        reqwest::StatusCode::FORBIDDEN => {
            println!("Forbidden: {:#?}", response.text().await.unwrap());
            Err(Error::RedcapAuthenication)
        }
        _ => {
            let content = response.text().await.unwrap();
            println!("Error: {content:#?}");
            Err(Error::Redcap(content))
        }
    }
}
